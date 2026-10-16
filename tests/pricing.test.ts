// @ts-nocheck -- ported verbatim from Talia's drisyon-cyber-cohort (plain JS tests); runs under tsx.
import { test } from "node:test";
import assert from "node:assert/strict";
import { quote, PROGRAM, MAX_SEATS_PER_ORDER } from "../src/lib/cohort/pricing";

const BEFORE_DEADLINE = new Date("2026-10-18T10:00:00+05:30");
const AFTER_DEADLINE = new Date("2026-10-21T00:00:01+05:30");

test("applies the Navratri price before the deadline", () => {
  const q = quote({ seats: 1, now: BEFORE_DEADLINE });
  assert.equal(q.offerApplied, true);
  assert.equal(q.unitPaise, 75_000_00);
  assert.equal(q.totalPaise, 75_000_00);
  assert.equal(q.savingPaise, 25_000_00);
});

test("charges the list price after the deadline", () => {
  const q = quote({ seats: 1, now: AFTER_DEADLINE });
  assert.equal(q.offerApplied, false);
  assert.equal(q.totalPaise, 1_00_000_00);
  assert.equal(q.savingPaise, 0);
});

test("offer is still valid at the last second of 20 Oct IST", () => {
  const q = quote({ seats: 1, now: new Date("2026-10-20T23:59:59+05:30") });
  assert.equal(q.offerApplied, true);
});

test("multiplies by seat count", () => {
  const q = quote({ seats: 3, now: BEFORE_DEADLINE });
  assert.equal(q.totalPaise, 3 * 75_000_00);
});

test("splits GST-inclusive total into base and 18% GST that add up exactly", () => {
  const q = quote({ seats: 1, now: BEFORE_DEADLINE });
  assert.equal(q.basePaise + q.gstPaise, q.totalPaise);
  assert.equal(q.basePaise, 63_559_32);
  assert.equal(q.gstPaise, 11_440_68);
});

test("rejects seat counts outside 1..MAX", () => {
  for (const seats of [0, -1, MAX_SEATS_PER_ORDER + 1, 1.5, "2", NaN]) {
    assert.throws(() => quote({ seats, now: BEFORE_DEADLINE }), /seats/);
  }
});

test("program metadata is fixed server-side", () => {
  assert.equal(PROGRAM.code, "CYB-DEVOPS-2026-11");
  assert.equal(PROGRAM.cohortSize, 30);
});
