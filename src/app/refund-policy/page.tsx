import { H2, LegalPage, Mail, Office, legalMetadata } from "@/components/legal/Legal";
import { company } from "@/lib/company";

export const metadata = legalMetadata("Refund and cancellation policy", "/refund-policy", "When and how Drisyon program fees are refunded.");

const schedule = [
  ["We decide after your technical screen that the cohort is not the right fit", "100%"],
  ["The cohort is sold out when your payment completes", "100%"],
  ["We cancel the cohort, or postpone its start by more than 30 days", "100%, or a seat in the next cohort"],
  ["You cancel on or before 25 October 2026 (7 days before start)", "100%"],
  ["You cancel between 26 October and 14 November 2026 (up to the end of week two)", "50%"],
  ["You cancel after 14 November 2026", "No refund. You may move to the next cohort once, if seats are available."],
  ["You are removed for breaking the lab rules", "No refund"],
];

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund and cancellation policy">
      <p>
        This policy applies to every paid seat in a Drisyon program. For Cloud Security Cohort 01, classes start on <b>1 November 2026</b>.
      </p>

      <H2>Refund schedule</H2>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-inset ring-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-3 font-medium">Situation</th>
              <th className="px-4 py-3 font-medium">Refund</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(([s, r]) => (
              <tr key={s} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{s}</td>
                <td className="px-4 py-3 font-medium">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>An offer price is not lost when you move to the next cohort.</p>

      <H2>How to cancel</H2>
      <p>
        Email <Mail /> from the address you used at checkout, with your Razorpay payment ID (it starts with <code>pay_</code>). The date we receive your email decides which row above applies. We confirm within two working days.
      </p>

      <H2>How you are paid back</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Refunds go back to the original payment method through Razorpay. We start the refund within 5 working days of confirming it. Your bank usually credits it within 5 to 7 working days after that.</li>
        <li>Refunds include the GST you paid. If a GST invoice was issued to a company, we issue a credit note to that company.</li>
        <li>We do not refund by cash or to a different account.</li>
      </ul>

      <H2>Contact</H2>
      <p>
        {company.legalName}, <Office />. Email <Mail />.
      </p>
    </LegalPage>
  );
}
