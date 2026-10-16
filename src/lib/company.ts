/**
 * Legal entity details used by the policy pages (/terms, /refund-policy, /privacy, /contact).
 *
 * While a field is null, the pages show a highlighted placeholder, stay out of search results, and
 * online payments for the cohort cannot be switched on. Fill both fields before going live.
 */
export const company = {
  legalName: "Brain O Vision Solutions India Pvt. Ltd.",
  brand: "Drisyon",
  email: "reachus@drisyon.com",
  /** Registered office address, as on the certificate of incorporation. */
  registeredOffice: null as string | null,
  /** Grievance officer under the DPDP Act, 2023 (shown on the privacy page). */
  grievanceOfficer: null as string | null,
  jurisdiction: "Hyderabad, Telangana",
  policiesUpdated: "16 October 2026",
};

export const legalDetailsComplete = () => Boolean(company.registeredOffice && company.grievanceOfficer);

/** Course-director phone for Call / WhatsApp, from the CONTACT_PHONE env var. Returns null until set. */
export function contactPhone(raw = process.env.CONTACT_PHONE) {
  const digits = String(raw ?? "").replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return { e164: `+91${digits}`, display: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`, wa: `91${digits}` };
}
