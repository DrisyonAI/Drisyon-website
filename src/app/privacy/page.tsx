import { H2, LegalPage, Mail, Office, Todo, legalMetadata } from "@/components/legal/Legal";
import { company } from "@/lib/company";

export const metadata = legalMetadata("Privacy policy", "/privacy", "What personal data Drisyon collects, why, and your rights under the DPDP Act, 2023.");

const collected = [
  ["Name, email, mobile number", "To reply to enquiries, reserve your seat, send receipts and schedules, and call you for the technical screen"],
  ["Company name and GSTIN (optional)", "To issue a GST invoice to your employer"],
  ["Payment ID, order ID, amount, payment status", "To confirm your payment, process refunds and keep tax records"],
  ["Technical screen notes and lab progress", "To place you in the cohort and support your learning"],
];

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        {company.legalName} (&quot;Drisyon&quot;, &quot;we&quot;) runs drisyon.com and its program pages. This policy explains what personal data we collect when you contact us, enquire about or enrol in a program, and how we use it, in line with the Digital Personal Data Protection Act, 2023.
      </p>

      <H2>What we collect</H2>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-inset ring-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {collected.map(([d, w]) => (
              <tr key={d} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{d}</td>
                <td className="px-4 py-3">{w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>We do not receive your card, UPI or bank details. Razorpay handles them under its own privacy policy.</p>

      <H2>Who processes it</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Razorpay</b>: payments and refunds.</li>
        <li><b>Vercel</b>: hosting of this website and its form and payment functions.</li>
        <li><b>Supabase</b>: the database that records enrolments.</li>
        <li><b>Hostinger</b>: the mailbox that receives website enquiries.</li>
        <li>Email, calendar and video-meeting providers we use to run sessions.</li>
      </ul>
      <p>
        We do not sell your data or share it for advertising. We share it with lab partners or certification vendors only when you need an account on their platform, and only the minimum needed for that account.
      </p>

      <H2>How long we keep it</H2>
      <p>
        We keep enrolment and payment records for 8 years to meet tax and accounting law. We delete screen notes and lab-progress data 12 months after your cohort ends unless you ask us to keep them for a reference.
      </p>

      <H2>Your rights</H2>
      <p>
        You can ask us to access, correct or erase your personal data, withdraw consent for future use, or nominate someone to act for you. Records we must keep by law are retained until the legal period ends. Email <Mail /> with the subject &quot;Data request&quot;; we respond within 30 days.
      </p>

      <H2>Grievance officer</H2>
      <p>
        {company.grievanceOfficer ?? <Todo>Name of grievance officer: to be added</Todo>}, {company.legalName}, <Office />. Email <Mail />. If you are not satisfied with our response, you may complain to the Data Protection Board of India.
      </p>

      <H2>Security</H2>
      <p>
        Data is encrypted in transit. Database access is limited to our payment functions and named staff. Payment confirmations are checked with Razorpay&apos;s cryptographic signatures.
      </p>

      <H2>Changes</H2>
      <p>If we change this policy, we update the date at the top of this page.</p>
    </LegalPage>
  );
}
