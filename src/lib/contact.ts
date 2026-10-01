import { interestOptions } from "./content";

/** Shared by the contact form (client) and /api/contact (server). */
export type ContactFields = { name: string; email: string; company: string; phone: string; interest: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const LIMITS = { name: 120, email: 200, company: 160, phone: 30, message: 5000 };

export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {};
  const name = f.name.trim(), email = f.email.trim(), company = f.company.trim(), phone = f.phone.trim(), message = f.message.trim();
  if (name.length < 2 || name.length > LIMITS.name) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) e.email = "Please enter a valid email address.";
  if (!company || company.length > LIMITS.company) e.company = "Please enter your company or organisation.";
  if (phone && !/^[+()\-\s\d]{7,20}$/.test(phone)) e.phone = "Please enter a valid phone number.";
  if (!interestOptions.includes(f.interest as (typeof interestOptions)[number])) e.interest = "Please choose an option.";
  if (message.length < 10) e.message = "Please tell us a little more (at least 10 characters).";
  else if (message.length > LIMITS.message) e.message = `Please keep your message under ${LIMITS.message} characters.`;
  return e;
}
