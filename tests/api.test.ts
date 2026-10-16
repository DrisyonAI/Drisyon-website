// Ported from Talia's drisyon-cyber-cohort tests/api.test.js. The /api/config tests are replaced by
// tests of the payments switch (drisyon.com renders the page server-side, so it has no config endpoint).
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { handleOrder, handleVerify, handleWebhook, paymentsReady, resetRateLimit } from "../src/lib/server/cohort-payments";

const env = { RAZORPAY_KEY_ID: "rzp_test_k", RAZORPAY_KEY_SECRET: "s3cret", RAZORPAY_WEBHOOK_SECRET: "wh", COHORT_PAYMENTS: "on" };
const live = { env, legalReady: true };
const buyer = { name: "Asha Rao", email: "asha@example.com", phone: "9876543210", seats: 2 };
const req = (body: unknown, ip = "1.1.1.1") =>
  new Request("https://x/api/razorpay/order", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });

beforeEach(() => resetRateLimit());

test("payments switch: needs keys, COHORT_PAYMENTS=on and complete legal details", () => {
  assert.equal(paymentsReady(env, true), true);
  assert.equal(paymentsReady({ ...env, COHORT_PAYMENTS: undefined }, true), false);
  assert.equal(paymentsReady({ ...env, COHORT_PAYMENTS: "off" }, true), false);
  assert.equal(paymentsReady({ ...env, RAZORPAY_KEY_SECRET: undefined }, true), false);
  assert.equal(paymentsReady(env, false), false);
});

test("order: 503 while payments are switched off, without calling Razorpay", async () => {
  const fetchImpl = (async () => { throw new Error("should not call"); }) as typeof fetch;
  for (const opts of [{ env: {}, legalReady: true }, { env: { ...env, COHORT_PAYMENTS: undefined }, legalReady: true }, { env, legalReady: false }]) {
    resetRateLimit();
    const res = await handleOrder(req(buyer), { ...opts, fetchImpl });
    assert.equal(res.status, 503);
  }
});

test("order: computes the amount server-side and ignores any client amount", async () => {
  let sent: { amount: number; notes: Record<string, string> } | undefined;
  const fetchImpl = (async (_u: unknown, init: RequestInit) => {
    sent = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ id: "order_1", amount: sent!.amount, currency: "INR" }));
  }) as typeof fetch;
  const res = await handleOrder(req({ ...buyer, amount: 1 }), { ...live, now: new Date("2026-10-18T10:00:00+05:30"), fetchImpl });
  const out = await res.json();
  assert.equal(res.status, 200);
  assert.equal(sent!.amount, 2 * 75_000_00);
  assert.equal(sent!.notes.program, "CYB-DEVOPS-2026-11");
  assert.equal(out.data.orderId, "order_1");
  assert.equal(out.data.keyId, "rzp_test_k");
  assert.equal(out.data.quote.totalPaise, 2 * 75_000_00);
});

test("order: 400 with message on invalid buyer", async () => {
  const res = await handleOrder(req({ ...buyer, email: "x" }), { ...live, fetchImpl: (async () => { throw new Error("should not call"); }) as typeof fetch });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /email/i);
});

test("order: 502 with generic message when Razorpay fails", async () => {
  const res = await handleOrder(req(buyer), { ...live, fetchImpl: (async () => new Response("{}", { status: 500 })) as typeof fetch });
  const out = await res.json();
  assert.equal(res.status, 502);
  assert.doesNotMatch(out.error, /s3cret/);
});

test("order: rate-limits repeated calls from one IP", async () => {
  const fetchImpl = (async () => new Response(JSON.stringify({ id: "o", amount: 1, currency: "INR" }))) as typeof fetch;
  let last: Response | undefined;
  for (let i = 0; i < 6; i++) last = await handleOrder(req(buyer, "9.9.9.9"), { ...live, fetchImpl });
  assert.equal(last!.status, 429);
});

test("verify: accepts a valid signature and rejects a forged one", async () => {
  const sig = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update("order_1|pay_1").digest("hex");
  const mk = (s: string) => new Request("https://x", { method: "POST", body: JSON.stringify({ razorpay_order_id: "order_1", razorpay_payment_id: "pay_1", razorpay_signature: s }) });
  assert.equal((await handleVerify(mk(sig), { env })).status, 200);
  assert.equal((await handleVerify(mk("0".repeat(64)), { env })).status, 400);
});

test("webhook: 401 on bad signature, 200 on good", async () => {
  const body = JSON.stringify({ event: "order.paid", payload: { payment: { entity: { id: "pay_1", order_id: "order_1", amount: 7500000, notes: {} } } } });
  const sig = crypto.createHmac("sha256", "wh").update(body).digest("hex");
  const mk = (s: string) => new Request("https://x", { method: "POST", headers: { "x-razorpay-signature": s }, body });
  assert.equal((await handleWebhook(mk("bad"), { env })).status, 401);
  assert.equal((await handleWebhook(mk(sig), { env })).status, 200);
});

const db = { SUPABASE_URL: "https://db.example.co", SUPABASE_SERVICE_ROLE_KEY: "srv" };
const razorpayOk = () => new Response(JSON.stringify({ id: "order_9", amount: 1, currency: "INR" }));

test("order: 409 when the cohort is full, without calling Razorpay", async () => {
  const fetchImpl = (async (url: unknown) => {
    if (String(url).startsWith(db.SUPABASE_URL)) return new Response(JSON.stringify([{ seats: 10 }, { seats: 10 }, { seats: 10 }]));
    throw new Error("Razorpay should not be called");
  }) as typeof fetch;
  const res = await handleOrder(req(buyer), { env: { ...env, ...db }, legalReady: true, fetchImpl });
  assert.equal(res.status, 409);
  assert.match((await res.json()).error, /full/);
});

test("order: 409 names the seats left when the request is too large", async () => {
  const fetchImpl = (async (url: unknown) => (String(url).startsWith(db.SUPABASE_URL) ? new Response(JSON.stringify([{ seats: 29 }])) : razorpayOk())) as typeof fetch;
  const res = await handleOrder(req(buyer), { env: { ...env, ...db }, legalReady: true, fetchImpl });
  assert.equal(res.status, 409);
  assert.match((await res.json()).error, /Only 1 seat left/);
});

test("order: proceeds when the seat check fails (fails open)", async () => {
  const fetchImpl = (async (url: unknown) => (String(url).startsWith(db.SUPABASE_URL) ? new Response("{}", { status: 500 }) : razorpayOk())) as typeof fetch;
  const res = await handleOrder(req(buyer), { env: { ...env, ...db }, legalReady: true, fetchImpl });
  assert.equal(res.status, 200);
});

const signed = (payload: unknown) => {
  const body = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
  return new Request("https://x", { method: "POST", headers: { "x-razorpay-signature": sig }, body });
};
const paidEvent = {
  event: "order.paid",
  payload: {
    payment: { entity: { id: "pay_7", order_id: "order_7", amount: 7500000, notes: { program: "CYB-DEVOPS-2026-11" } } },
    order: { entity: { id: "order_7", notes: { seats: "1", name: "Asha Rao", email: "asha@example.com", phone: "+919876543210" } } },
  },
};

test("webhook: order.paid writes the enrolment from the order notes", async () => {
  const calls: { url: unknown; body: Record<string, unknown> }[] = [];
  const fetchImpl = (async (url: unknown, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)) });
    return new Response("", { status: 201 });
  }) as typeof fetch;
  const res = await handleWebhook(signed(paidEvent), { env: { ...env, ...db }, fetchImpl });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.payment_id, "pay_7");
  assert.equal(calls[0].body.seats, 1);
});

test("webhook: 500 when the write fails, so Razorpay retries", async () => {
  const res = await handleWebhook(signed(paidEvent), { env: { ...env, ...db }, fetchImpl: (async () => new Response("{}", { status: 503 })) as typeof fetch });
  assert.equal(res.status, 500);
});

test("webhook: refund.processed updates the enrolment", async () => {
  const calls: { url: unknown; method?: string }[] = [];
  const fetchImpl = (async (url: unknown, init: RequestInit) => {
    calls.push({ url, method: init.method });
    return new Response(null, { status: 204 });
  }) as typeof fetch;
  const event = { event: "refund.processed", payload: { payment: { entity: { id: "pay_7", amount_refunded: 7500000, refund_status: "full" } } } };
  assert.equal((await handleWebhook(signed(event), { env: { ...env, ...db }, fetchImpl })).status, 200);
  assert.equal(calls[0].method, "PATCH");
});

test("webhook: payment.captured and unknown events do not touch the database", async () => {
  const fetchImpl = (async () => { throw new Error("should not call"); }) as typeof fetch;
  for (const name of ["payment.captured", "payment.failed", "invoice.paid"]) {
    const res = await handleWebhook(signed({ event: name, payload: { payment: { entity: { id: "pay_8" } } } }), { env: { ...env, ...db }, fetchImpl });
    assert.equal(res.status, 200);
  }
});

test("webhook: log line carries no personal data", async () => {
  const lines: string[] = [];
  const original = console.log;
  console.log = (line: string) => lines.push(line);
  try {
    await handleWebhook(signed(paidEvent), { env, fetchImpl: (async () => { throw new Error("no db configured"); }) as typeof fetch });
  } finally {
    console.log = original;
  }
  assert.equal(lines.some((l) => l.includes("asha@example.com") || l.includes("9876543210")), false);
});

test("webhook: 400 on a signed but malformed body", async () => {
  const body = "not json";
  const sig = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
  const res = await handleWebhook(new Request("https://x", { method: "POST", headers: { "x-razorpay-signature": sig }, body }), { env });
  assert.equal(res.status, 400);
});
