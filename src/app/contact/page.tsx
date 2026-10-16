import Link from "next/link";
import { H2, LegalPage, Mail, Office, legalMetadata } from "@/components/legal/Legal";
import { company, contactPhone } from "@/lib/company";

export const metadata = legalMetadata("Contact us", "/contact", "How to reach Drisyon about programs, team enrolments, invoices or refunds.");
export const revalidate = 300;

export default function ContactPage() {
  const phone = contactPhone();
  return (
    <LegalPage title="Contact us">
      <p>Questions about the Cloud Security Cohort, team enrolments, invoices or refunds: talk to us directly.</p>

      <H2>Course team</H2>
      <p>
        {phone ? (
          <>
            Call or WhatsApp <a href={`tel:${phone.e164}`} className="text-indigo underline underline-offset-2">{phone.display}</a>
          </>
        ) : (
          <>Call or WhatsApp: details on the <Link href="/cloud-security#enrol" className="text-indigo underline underline-offset-2">course page</Link></>
        )}
        <br />
        Monday to Saturday, 10 am to 7 pm IST
      </p>

      <H2>Email</H2>
      <p>
        <Mail />. We reply within one working day. You can also use the <Link href="/#contact" className="text-indigo underline underline-offset-2">contact form</Link>.
      </p>

      <H2>Registered office</H2>
      <p>
        {company.legalName}
        <br />
        <Office />
      </p>

      <p className="!mt-10 rounded-2xl bg-surface px-5 py-4 text-sm ring-1 ring-inset ring-line">
        For a cancellation or refund, include your Razorpay payment ID (it starts with <code>pay_</code>). See the{" "}
        <Link href="/refund-policy" className="text-indigo underline underline-offset-2">refund policy</Link>.
      </p>
    </LegalPage>
  );
}
