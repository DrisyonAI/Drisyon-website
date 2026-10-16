import "server-only";
import crypto from "node:crypto";

const API = "https://api.razorpay.com/v1";

function safeEqualHex(expectedHex: string, givenHex: unknown) {
  if (typeof givenHex !== "string" || !/^[0-9a-f]+$/i.test(givenHex)) return false;
  const a = Buffer.from(expectedHex, "hex");
  const b = Buffer.from(givenHex, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const hmac = (secret: string, payload: string) => crypto.createHmac("sha256", secret).update(payload).digest("hex");

/** Checkout callback signature: HMAC-SHA256(order_id|payment_id) with the key secret, timing-safe compare. */
export function verifyPaymentSignature({ orderId, paymentId, signature, secret }: { orderId?: string; paymentId?: string; signature?: unknown; secret?: string }) {
  if (!orderId || !paymentId || !secret) return false;
  return safeEqualHex(hmac(secret, `${orderId}|${paymentId}`), signature);
}

/** Webhook signature over the raw request body. */
export function verifyWebhookSignature({ rawBody, signature, secret }: { rawBody: unknown; signature?: unknown; secret?: string }) {
  if (typeof rawBody !== "string" || !secret) return false;
  return safeEqualHex(hmac(secret, rawBody), signature);
}

export async function createOrder({
  amountPaise,
  receipt,
  notes,
  keyId,
  keySecret,
  fetchImpl = fetch,
}: {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
  keyId: string;
  keySecret: string;
  fetchImpl?: typeof fetch;
}): Promise<{ id: string; amount: number; currency: string }> {
  const res = await fetchImpl(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed (${res.status})`);
  return res.json();
}
