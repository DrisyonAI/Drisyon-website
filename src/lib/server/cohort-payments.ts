import "server-only";
import crypto from "node:crypto";
import { PROGRAM, quote } from "@/lib/cohort/pricing";
import { validateBuyer } from "@/lib/cohort/validate";
import { legalDetailsComplete } from "@/lib/company";
import { isConfigured, recordPaid, recordRefund, seatsTaken, type Env } from "./enrolments";
import { createOrder, verifyPaymentSignature, verifyWebhookSignature } from "./razorpay";

/**
 * Razorpay checkout for the Cloud Security Cohort (ported from Talia's drisyon-cyber-cohort).
 *
 * Online payment is OFF unless all of these hold:
 *   1. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set,
 *   2. COHORT_PAYMENTS=on (an explicit switch, so adding keys alone never starts taking money),
 *   3. the registered office and grievance officer are filled in src/lib/company.ts (the policy pages
 *      Razorpay requires must be complete).
 * While off, the course page shows an enquiry form and the order endpoint answers 503.
 */
export function paymentsReady(env: Env = process.env as Env, legalReady = legalDetailsComplete()) {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.COHORT_PAYMENTS === "on" && legalReady);
}

// Response shape kept from the original API: { success, data, error }.
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const ok = (data: unknown) => json(200, { success: true, data, error: null });
const err = (status: number, error: string) => json(status, { success: false, data: null, error });

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
const clientIp = (request: Request) => (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

// Best-effort per-instance limiter (5 orders/min/IP). For a hard limit, add a Vercel Firewall rule on /api/razorpay/order.
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
let hits = new Map<string, number[]>();
function isRateLimited(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const next = [...recent, now];
  hits = new Map(hits).set(key, next);
  return next.length > MAX_HITS;
}
export function resetRateLimit() {
  hits = new Map();
}

type Opts = { env?: Env; now?: Date; fetchImpl?: typeof fetch; legalReady?: boolean };

/** null = unknown. Fails open: a database outage should not stop sales; the error is logged. */
async function seatsLeft({ env, fetchImpl }: { env: Env; fetchImpl: typeof fetch }) {
  if (!isConfigured(env)) return null;
  try {
    return Math.max(0, PROGRAM.cohortSize - (await seatsTaken({ env, fetchImpl })));
  } catch (e) {
    console.error("[razorpay.order] seat check skipped:", (e as Error).message);
    return null;
  }
}

export async function handleOrder(request: Request, { env = process.env as Env, now = new Date(), fetchImpl = fetch, legalReady }: Opts = {}) {
  if (isRateLimited(`order:${clientIp(request)}`)) return err(429, "Too many attempts. Wait a minute and try again.");
  if (!paymentsReady(env, legalReady)) {
    return err(503, "Online payment is not open yet. Send us an enquiry or call us to reserve a seat.");
  }
  const keyId = env.RAZORPAY_KEY_ID!;
  const keySecret = env.RAZORPAY_KEY_SECRET!;

  const checked = validateBuyer(await readJson(request));
  if (!checked.ok) return err(400, checked.error);
  const buyer = checked.value;

  const left = await seatsLeft({ env, fetchImpl });
  if (left !== null && buyer.seats > left) {
    return err(
      409,
      left === 0
        ? "This cohort is full. Call us to join the waitlist for the next one."
        : `Only ${left} seat${left === 1 ? "" : "s"} left. Reduce your seats, or call us.`,
    );
  }
  const q = quote({ seats: buyer.seats, now });

  const receipt = `cyb01_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
  const notes = {
    program: PROGRAM.code,
    seats: String(buyer.seats),
    offer: q.offerName || "none",
    name: buyer.name,
    email: buyer.email,
    phone: buyer.phone,
    company: buyer.company,
    gstin: buyer.gstin,
  };

  try {
    const order = await createOrder({ amountPaise: q.totalPaise, receipt, notes, keyId, keySecret, fetchImpl });
    return ok({ orderId: order.id, keyId, quote: q, program: PROGRAM, prefill: { name: buyer.name, email: buyer.email, contact: buyer.phone } });
  } catch (e) {
    console.error("[razorpay.order]", (e as Error).message, { receipt });
    return err(502, "We could not start the payment. Please try again or call us.");
  }
}

/** Confirms the checkout callback is genuine. The webhook remains the record of truth. */
export async function handleVerify(request: Request, { env = process.env as Env }: Opts = {}) {
  const body = ((await readJson(request)) ?? {}) as Record<string, string>;
  const valid = verifyPaymentSignature({
    orderId: body.razorpay_order_id,
    paymentId: body.razorpay_payment_id,
    signature: body.razorpay_signature,
    secret: env.RAZORPAY_KEY_SECRET,
  });
  if (!valid) return err(400, "We could not confirm this payment. If money left your account, call us with the payment ID.");
  return ok({ paymentId: body.razorpay_payment_id, orderId: body.razorpay_order_id });
}

const HANDLED = new Set(["order.paid", "payment.captured", "payment.failed", "refund.processed"]);

type WebhookEvent = {
  event: string;
  payload?: { payment?: { entity?: Record<string, unknown> }; order?: { entity?: { notes?: Record<string, string> } } };
};

// order.paid is the only event that carries the order notes (seats, buyer), so it writes the enrolment.
async function persist(event: WebhookEvent, payment: Record<string, unknown>, { env, fetchImpl }: { env: Env; fetchImpl: typeof fetch }) {
  if (!isConfigured(env)) return;
  const p = payment as { id: string };
  if (event.event === "order.paid") await recordPaid({ payment: p, order: event.payload?.order?.entity, env, fetchImpl });
  if (event.event === "refund.processed") await recordRefund({ payment: p, env, fetchImpl });
}

/** Razorpay → Dashboard → Webhooks: https://drisyon.com/api/razorpay/webhook, events listed in HANDLED. */
export async function handleWebhook(request: Request, { env = process.env as Env, fetchImpl = fetch }: Opts = {}) {
  const rawBody = await request.text();
  const valid = verifyWebhookSignature({ rawBody, signature: request.headers.get("x-razorpay-signature"), secret: env.RAZORPAY_WEBHOOK_SECRET });
  if (!valid) return err(401, "invalid signature");

  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return err(400, "invalid body");
  }
  if (!HANDLED.has(event.event)) return ok({ received: true });

  const payment = event.payload?.payment?.entity ?? {};
  // Structured log line: IDs and amounts only, no personal data.
  console.log(JSON.stringify({ tag: "razorpay.webhook", event: event.event, paymentId: payment.id, orderId: payment.order_id, amount: payment.amount }));

  try {
    await persist(event, payment, { env, fetchImpl });
  } catch (e) {
    // Non-2xx makes Razorpay retry, so a transient database error does not lose a seat.
    console.error("[razorpay.webhook]", (e as Error).message, { event: event.event, paymentId: payment.id });
    return err(500, "could not record");
  }
  return ok({ received: true });
}
