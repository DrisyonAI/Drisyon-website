import Link from "next/link";
import { H2, LegalPage, Mail, Office, legalMetadata } from "@/components/legal/Legal";
import { company } from "@/lib/company";

export const metadata = legalMetadata("Terms of enrolment", "/terms", "Terms that apply when you or your employer pay for a seat in a Drisyon program.");

const ul = "list-disc space-y-2 pl-5";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of enrolment">
      <p>
        These terms apply when you or your employer pay for a seat in a Drisyon program, including the Cloud Security Cohort 01. Drisyon is a brand of{" "}
        {company.legalName} (&quot;Drisyon&quot;, &quot;we&quot;). By paying, you accept these terms, the{" "}
        <Link href="/refund-policy" className="text-indigo underline underline-offset-2">refund and cancellation policy</Link> and the{" "}
        <Link href="/privacy" className="text-indigo underline underline-offset-2">privacy policy</Link>.
      </p>

      <H2>1. The program</H2>
      <ul className={ul}>
        <li>Cloud Security Cohort 01 starts on 1 November 2026 and runs for about six months: 90 hours of live, instructor-led sessions on weekends (IST), hands-on labs and three industry-lab blocks.</li>
        <li>The schedule, session order and named tools may change for reasons such as trainer availability or vendor licensing. When a tool is unavailable, we substitute an equivalent enterprise tool covering the same skill.</li>
        <li>Sessions are delivered online unless a session is announced as in person. You need a laptop with 16 GB RAM and a stable internet connection.</li>
      </ul>

      <H2>2. Enrolment and the technical screen</H2>
      <ul className={ul}>
        <li>Your seat is reserved when your payment succeeds. A 20-minute technical screen follows within two working days.</li>
        <li>If we decide after the screen that the cohort is not the right fit for you, we cancel your seat and refund you in full.</li>
        <li>Each cohort has 30 seats. If seats sell out while your payment is in progress, we refund you in full.</li>
      </ul>

      <H2>3. Fees, offers and invoices</H2>
      <ul className={ul}>
        <li>All prices are in Indian rupees and include 18% GST. The price charged is the one shown at checkout. An offer price applies only to payments completed before the offer deadline.</li>
        <li>Payments are processed by Razorpay. We never receive or store your card or bank details.</li>
        <li>If you give a company name and GSTIN at checkout, the tax invoice is issued to that company. Check these details before paying; we cannot reissue an invoice to a different GSTIN after the GST return for that month is filed.</li>
      </ul>

      <H2>4. Certifications</H2>
      <p>
        The program prepares you for the OEM certifications named on the course page. Certification exams are set, run and graded by the vendors (for example Fortinet, Palo Alto Networks, Microsoft and Qualys), and passing them is not guaranteed. Exam fees are payable to the vendor unless your onboarding kit states that a voucher is included.
      </p>

      <H2>5. Lab rules and acceptable use</H2>
      <p>You will use offensive and defensive security tools. These rules protect you, other learners and our lab partners:</p>
      <ul className={ul}>
        <li>Use the tools, credentials and techniques you learn only against lab targets we provide, or systems you own or have written permission to test.</li>
        <li>Do not share lab credentials, licensed console access or course material with anyone outside your cohort.</li>
        <li>Follow the instructions of the industry-lab staff during lab blocks, including any confidentiality terms they set.</li>
        <li>We may suspend or remove a learner who breaks these rules, without a refund, and report unlawful activity to the authorities.</li>
      </ul>

      <H2>6. Course material</H2>
      <p>
        Recordings, slides, lab guides and code are licensed to you for your personal learning. You may keep your own lab outputs and use them in your portfolio, as long as they do not reveal partner or lab-system details.
      </p>

      <H2>7. Conduct</H2>
      <p>Treat trainers, lab staff and other learners with respect. Harassment, discrimination or disruption of sessions may lead to removal from the program.</p>

      <H2>8. Liability</H2>
      <p>
        We deliver the program with reasonable skill and care. To the extent the law allows, our total liability to you for any claim about the program is limited to the fee you paid for it. We are not liable for indirect losses, including loss of employment opportunities.
      </p>

      <H2>9. Changes to the program</H2>
      <p>If we cancel the cohort, or postpone its start by more than 30 days, you may choose a full refund or a seat in the next cohort.</p>

      <H2>10. Governing law</H2>
      <p>These terms are governed by the laws of India. Courts in {company.jurisdiction} have exclusive jurisdiction.</p>

      <H2>11. Contact</H2>
      <p>
        {company.legalName}, <Office />. Email <Mail />.
      </p>
    </LegalPage>
  );
}
