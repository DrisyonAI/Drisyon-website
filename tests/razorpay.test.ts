// @ts-nocheck -- ported verbatim from Talia's drisyon-cyber-cohort (plain JS tests); runs under tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyPaymentSignature, verifyWebhookSignature, createOrder } from "../src/lib/server/razorpay";

const SECRET = "test_secret";
const sign = (payload, secret = SECRET) => crypto.createHmac("sha256", secret).update(payload).digest("hex");

test("verifies a genuine checkout signature", () => {
  const sig = sign("order_1|pay_1");
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: sig, secret: SECRET }), true);
});

test("rejects a tampered or malformed checkout signature", () => {
  const sig = sign("order_1|pay_1");
  assert.equal(verifyPaymentSignature({ orderId: "order_2", paymentId: "pay_1", signature: sig, secret: SECRET }), false);
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: "abc", secret: SECRET }), false);
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: undefined, secret: SECRET }), false);
});

test("verifies webhook signature over the raw body", () => {
  const body = JSON.stringify({ event: "order.paid" });
  assert.equal(verifyWebhookSignature({ rawBody: body, signature: sign(body, "wh"), secret: "wh" }), true);
  assert.equal(verifyWebhookSignature({ rawBody: body + " ", signature: sign(body, "wh"), secret: "wh" }), false);
});

test("createOrder posts amount in paise with basic auth and returns the order", async () => {
  let seen;
  const fakeFetch = async (url, init) => {
    seen = { url, init };
    return new Response(JSON.stringify({ id: "order_X", amount: 7500000, currency: "INR" }), { status: 200 });
  };
  const order = await createOrder({ amountPaise: 7500000, receipt: "r1", notes: { a: "b" }, keyId: "k", keySecret: "s", fetchImpl: fakeFetch });
  assert.equal(order.id, "order_X");
  assert.equal(seen.url, "https://api.razorpay.com/v1/orders");
  assert.equal(seen.init.headers.Authorization, "Basic " + Buffer.from("k:s").toString("base64"));
  assert.deepEqual(JSON.parse(seen.init.body), { amount: 7500000, currency: "INR", receipt: "r1", notes: { a: "b" } });
});

test("createOrder throws on a Razorpay error without leaking the secret", async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ error: { description: "bad" } }), { status: 400 });
  await assert.rejects(
    createOrder({ amountPaise: 1, receipt: "r", notes: {}, keyId: "k", keySecret: "topsecret", fetchImpl: fakeFetch }),
    (err) => /Razorpay order failed \(400\)/.test(err.message) && !err.message.includes("topsecret"),
  );
});
