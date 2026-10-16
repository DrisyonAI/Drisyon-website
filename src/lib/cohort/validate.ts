import { MAX_SEATS_PER_ORDER } from "./pricing";

/** Buyer validation for the cohort checkout. Shared by the checkout form (client) and the order endpoint (server). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const GSTIN_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export type Buyer = Readonly<{ name: string; email: string; phone: string; company: string; gstin: string; seats: number }>;
type Result = { ok: true; value: Buyer } | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });

export function normalisePhone(raw: unknown) {
  const digits = String(raw ?? "")
    .replace(/[\s()-]/g, "")
    .replace(/^\+?91(?=\d{10}$)/, "")
    .replace(/^0(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

export function validateBuyer(input: unknown): Result {
  if (!input || typeof input !== "object") return fail("Send your details as a form.");
  const i = input as Record<string, unknown>;
  const name = String(i.name ?? "").trim();
  const email = String(i.email ?? "").trim().toLowerCase();
  const company = String(i.company ?? "").trim();
  const gstin = String(i.gstin ?? "").trim().toUpperCase();
  const phone = normalisePhone(i.phone);
  const seats = Number(i.seats);

  if (name.length < 2 || name.length > 80) return fail("Enter your full name.");
  if (!EMAIL_RE.test(email) || email.length > 120) return fail("Enter a valid email address.");
  if (!phone) return fail("Enter a 10-digit Indian mobile number.");
  if (company.length > 120) return fail("Company name must be under 120 characters.");
  if (gstin && !GSTIN_RE.test(gstin)) return fail("Enter a valid 15-character GSTIN, or leave it blank.");
  if (!Number.isInteger(seats) || seats < 1 || seats > MAX_SEATS_PER_ORDER) {
    return fail(`Choose 1 to ${MAX_SEATS_PER_ORDER} seats. For more, call us.`);
  }
  return { ok: true, value: Object.freeze({ name, email, phone, company, gstin, seats }) };
}
