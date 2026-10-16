// @ts-nocheck -- ported verbatim from Talia's drisyon-cyber-cohort (plain JS tests); runs under tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateBuyer } from "../src/lib/cohort/validate";

const good = { name: "Asha Rao", email: "asha@example.com", phone: "9876543210", seats: 1 };

test("accepts a valid individual buyer and normalises fields", () => {
  const r = validateBuyer({ ...good, email: " Asha@Example.com " });
  assert.equal(r.ok, true);
  assert.equal(r.value.email, "asha@example.com");
  assert.equal(r.value.phone, "+919876543210");
  assert.equal(r.value.gstin, "");
});

test("accepts a company buyer with a valid GSTIN", () => {
  const r = validateBuyer({ ...good, seats: 3, company: "Acme GCC", gstin: "36aabcu9603r1zm" });
  assert.equal(r.ok, true);
  assert.equal(r.value.gstin, "36AABCU9603R1ZM");
});

test("rejects bad fields with a readable message", () => {
  const cases = [
    [{ ...good, name: "A" }, /name/i],
    [{ ...good, email: "nope" }, /email/i],
    [{ ...good, phone: "12345" }, /mobile/i],
    [{ ...good, gstin: "XYZ" }, /GSTIN/],
    [{ ...good, seats: 11 }, /seats/i],
    [{ ...good, company: "x".repeat(121) }, /company/i],
  ];
  for (const [input, re] of cases) {
    const r = validateBuyer(input);
    assert.equal(r.ok, false);
    assert.match(r.error, re);
  }
});

test("rejects non-object input", () => {
  assert.equal(validateBuyer(null).ok, false);
  assert.equal(validateBuyer("x").ok, false);
});

test("does not mutate the input", () => {
  const input = { ...good, email: " A@B.co " };
  validateBuyer(input);
  assert.equal(input.email, " A@B.co ");
});
