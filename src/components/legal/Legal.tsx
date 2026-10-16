import type { Metadata } from "next";
import Link from "next/link";
import { company, legalDetailsComplete } from "@/lib/company";

/** Shared shell for the policy pages: /terms, /refund-policy, /privacy, /contact. */

export function legalMetadata(title: string, path: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Kept out of search results until the registered office and grievance officer are filled in.
    robots: legalDetailsComplete() ? { index: true, follow: true } : { index: false, follow: true },
  };
}

/** Highlighted placeholder for details still to be supplied (see src/lib/company.ts). */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-amber-100 px-1 text-amber-900">[{children}]</mark>;
}

export const Office = () =>
  company.registeredOffice ? <>{company.registeredOffice}</> : <Todo>Registered office address: to be added</Todo>;

const links = [
  { href: "/terms", label: "Terms of enrolment" },
  { href: "/refund-policy", label: "Refund and cancellation policy" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/contact", label: "Contact us" },
];

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="bg-paper pb-24 pt-[130px] md:pt-[160px]">
      <div className="container-x max-w-3xl">
        <p className="eyebrow text-indigo">Drisyon · Policies</p>
        <h1 className="mt-4 font-display text-h2 font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {company.policiesUpdated}</p>
        <div className="legal mt-10 space-y-5 text-[0.98rem] leading-relaxed text-text/85">{children}</div>
        <nav aria-label="Policies" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
          <Link href="/cloud-security" className="text-muted hover:text-text">Cloud Security Cohort</Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted hover:text-text">{l.label}</Link>
          ))}
        </nav>
      </div>
    </article>
  );
}

export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="!mt-10 font-display text-xl font-semibold tracking-[-0.02em] text-text">{children}</h2>
);

export const Mail = () => (
  <a href={`mailto:${company.email}`} className="text-indigo underline underline-offset-2">{company.email}</a>
);
