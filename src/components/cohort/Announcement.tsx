import Link from "next/link";
import { isOfferLive, PROGRAM } from "@/lib/cohort/pricing";

/** Cohort start in IST; the announcement disappears once classes begin. */
const STARTS_AT = new Date(`${PROGRAM.startDate}T00:00:00+05:30`);

/**
 * "Now enrolling" pill at the top of the homepage hero, linking to the course page.
 * Rendered on the server; the homepage revalidates periodically so the offer line and cutoff stay current.
 */
export function CohortAnnouncement({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const now = new Date();
  if (now >= STARTS_AT) return null;
  const offer = isOfferLive(now);

  return (
    <Link
      href="/cloud-security"
      style={style}
      className={`group inline-flex max-w-full items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm shadow-[0_8px_30px_-12px_rgb(74_58_240/0.45)] ring-1 ring-inset ring-indigo/20 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgb(74_58_240/0.6)] ${className}`}
    >
      <span className="shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white" style={{ background: "var(--gradient-brand)" }}>
        New
      </span>
      <span className="min-w-0 truncate text-text">
        <b className="font-semibold">Cloud Security Cohort 01</b>
        <span className="hidden text-muted sm:inline"> · Enrolling now</span>
        {offer ? (
          <span className="hidden font-medium text-indigo sm:inline"> · 25% off until 20 Oct</span>
        ) : (
          <span className="hidden text-muted sm:inline"> · Starts 1 Nov</span>
        )}
      </span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-indigo transition-transform group-hover:translate-x-0.5">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
