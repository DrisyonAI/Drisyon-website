// @ts-nocheck -- ported verbatim from Talia's drisyon-cyber-cohort (plain JS tests); runs under tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import { isConfigured, seatsTaken, recordPaid, recordRefund } from "../src/lib/server/enrolments";

const env = { SUPABASE_URL: "https://db.example.co", SUPABASE_SERVICE_ROLE_KEY: "srv_key" };

function recorder(responseBody = "[]", status = 200) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return new Response(responseBody, { status });
  };
  return { calls, fetchImpl };
}

test("isConfigured needs both url and service key", () => {
  assert.equal(isConfigured(env), true);
  assert.equal(isConfigured({ SUPABASE_URL: env.SUPABASE_URL }), false);
  assert.equal(isConfigured({}), false);
});

test("seatsTaken sums seats on paid enrolments only", async () => {
  const { calls, fetchImpl } = recorder(JSON.stringify([{ seats: 2 }, { seats: 3 }]));
  assert.equal(await seatsTaken({ env, fetchImpl }), 5);
  assert.equal(calls[0].url, "https://db.example.co/rest/v1/drisyon_enrolments?select=seats&status=eq.paid");
  assert.equal(calls[0].init.headers.apikey, "srv_key");
  assert.equal(calls[0].init.headers.Authorization, "Bearer srv_key");
});

test("seatsTaken throws on a database error without leaking the key", async () => {
  const { fetchImpl } = recorder("{}", 500);
  await assert.rejects(seatsTaken({ env, fetchImpl }), (e) => /drisyon_enrolments read failed \(500\)/.test(e.message) && !e.message.includes("srv_key"));
});

test("recordPaid upserts on payment_id using the order notes", async () => {
  const { calls, fetchImpl } = recorder("", 201);
  await recordPaid({
    payment: { id: "pay_1", order_id: "order_1", amount: 15000000 },
    order: { notes: { program: "CYB-DEVOPS-2026-11", seats: "2", offer: "Navratri 25% off", name: "Asha Rao", email: "asha@example.com", phone: "+919876543210", company: "", gstin: "" } },
    env,
    fetchImpl,
  });
  const { url, init } = calls[0];
  assert.equal(url, "https://db.example.co/rest/v1/drisyon_enrolments?on_conflict=payment_id");
  assert.equal(init.method, "POST");
  assert.match(init.headers.Prefer, /resolution=merge-duplicates/);
  assert.deepEqual(JSON.parse(init.body), {
    payment_id: "pay_1",
    order_id: "order_1",
    program: "CYB-DEVOPS-2026-11",
    seats: 2,
    amount_paise: 15000000,
    offer: "Navratri 25% off",
    name: "Asha Rao",
    email: "asha@example.com",
    phone: "+919876543210",
    company: null,
    gstin: null,
    status: "paid",
  });
});

test("recordPaid refuses a payment without seats in the order notes", async () => {
  const { calls, fetchImpl } = recorder();
  await assert.rejects(recordPaid({ payment: { id: "pay_1", order_id: "o", amount: 1 }, order: { notes: {} }, env, fetchImpl }), /seats/);
  assert.equal(calls.length, 0);
});

test("recordRefund marks a full refund and frees the seats", async () => {
  const { calls, fetchImpl } = recorder(null, 204);
  await recordRefund({ payment: { id: "pay_1", amount_refunded: 15000000, refund_status: "full" }, env, fetchImpl });
  const { url, init } = calls[0];
  assert.equal(url, "https://db.example.co/rest/v1/drisyon_enrolments?payment_id=eq.pay_1");
  assert.equal(init.method, "PATCH");
  assert.deepEqual(JSON.parse(init.body), { refunded_paise: 15000000, status: "refunded" });
});

test("recordRefund keeps a partial refund as paid", async () => {
  const { calls, fetchImpl } = recorder(null, 204);
  await recordRefund({ payment: { id: "pay_1", amount_refunded: 5000000, refund_status: "partial" }, env, fetchImpl });
  assert.deepEqual(JSON.parse(calls[0].init.body), { refunded_paise: 5000000, status: "paid" });
});

test("recordRefund encodes the payment id in the filter", async () => {
  const { calls, fetchImpl } = recorder(null, 204);
  await recordRefund({ payment: { id: "pay_1&status=eq.paid", amount_refunded: 1, refund_status: "full" }, env, fetchImpl });
  assert.equal(calls[0].url, "https://db.example.co/rest/v1/drisyon_enrolments?payment_id=eq.pay_1%26status%3Deq.paid");
});
