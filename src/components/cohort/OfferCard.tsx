"use client";

import { useEffect, useState } from "react";
import { rupees } from "@/lib/cohort/pricing";

/**
 * Fee card with the live offer countdown. The server renders the correct state; this keeps it
 * correct in an open tab, switching to the list price the moment the offer ends.
 */
export function OfferCard({
  listPaise,
  offerPaise,
  offerName,
  offerEndsAt,
  cohortSize,
  cta,
}: {
  listPaise: number;
  offerPaise: number;
  offerName: string;
  offerEndsAt: string;
  cohortSize: number;
  cta: { label: string; href: string; note: string };
}) {
  const end = new Date(offerEndsAt).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [end]);

  // Before hydration, trust the server-rendered price; after, follow the clock.
  const offerLive = left === null ? Date.now() <= end : left > 0;
  const pad = (n: number) => String(n).padStart(2, "0");
  const parts = left
    ? [
        [Math.floor(left / 864e5), "days"],
        [Math.floor(left / 36e5) % 24, "hrs"],
        [Math.floor(left / 6e4) % 60, "min"],
        [Math.floor(left / 1e3) % 60, "sec"],
      ]
    : [];

  return (
    <aside aria-label="Fee and offer" className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-40px_rgb(10_16_48/0.35)] ring-1 ring-line sm:p-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--gradient-brand)" }} />
      {offerLive && (
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo/10 px-3 py-1 text-xs font-semibold text-indigo">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo" aria-hidden="true" />
          {offerName}
        </span>
      )}
      <div className="mt-4">
        {offerLive && <p className="font-display text-lg text-muted line-through decoration-1">{rupees(listPaise)}</p>}
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[2.6rem] font-semibold leading-none tracking-[-0.03em]">{rupees(offerLive ? offerPaise : listPaise)}</span>
          <span className="text-sm text-muted">incl. 18% GST</span>
        </p>
      </div>

      {offerLive && (
        <div className="mt-5">
          <p className="text-xs text-muted">Offer closes on Vijayadashami, 20 Oct 2026, 11:59 pm IST</p>
          <div role="timer" aria-live="off" className="mt-2 grid grid-cols-4 gap-2">
            {(parts.length ? parts : [["--", "days"], ["--", "hrs"], ["--", "min"], ["--", "sec"]]).map(([v, l]) => (
              <div key={String(l)} className="rounded-xl bg-surface px-2 py-2 text-center ring-1 ring-inset ring-line">
                <b className="block font-mono text-lg tabular-nums">{typeof v === "number" ? pad(v) : v}</b>
                <span className="text-[0.65rem] uppercase tracking-[0.12em] text-muted">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <div aria-hidden="true" className="flex flex-wrap gap-1">
          {Array.from({ length: cohortSize }, (_, i) => (
            <i key={i} className="h-2.5 w-2.5 rounded-[3px]" style={{ background: "var(--gradient-brand)", opacity: 0.55 + (i % 5) * 0.08 }} />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">One cohort. {cohortSize} engineers. Admission closes when seats fill.</p>
      </div>

      <a
        href={cta.href}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-white shadow-[0_10px_30px_-12px_rgb(74_58_240/0.6)]"
        style={{ background: "var(--gradient-brand)" }}
      >
        {cta.label}
      </a>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted">{cta.note}</p>
    </aside>
  );
}
