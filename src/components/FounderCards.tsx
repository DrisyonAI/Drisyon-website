"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { founders, type Founder } from "@/lib/content";
import { BookingDialog } from "./BookingDialog";
import { PlaceholderTag } from "./ui";

/**
 * Co-founder profiles. Clicking a card opens a slot picker to request a call
 * (or the founder's own scheduler when `bookingUrl` is configured).
 * Official photographs aren't available yet, so a labelled placeholder is shown — set `photo` in src/lib/content.ts.
 */
export function FounderCards() {
  const [open, setOpen] = useState<Founder | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {founders.map((f) => {
          const inner = <CardBody f={f} />;
          const cls =
            "group block w-full overflow-hidden rounded-[22px] bg-white/[0.04] p-3 text-left ring-1 ring-inset ring-white/10 transition-[transform,background-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:bg-white/[0.07] hover:ring-white/25";
          return (
            <li key={f.id}>
              {f.bookingUrl ? (
                <a href={f.bookingUrl} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`Book a call with ${f.name} (opens scheduler)`}>
                  {inner}
                </a>
              ) : (
                <button type="button" onClick={() => setOpen(f)} className={cls} aria-haspopup="dialog" aria-label={`Book a call with ${f.name}, ${f.role}`}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <BookingDialog founder={open} onClose={close} />
    </>
  );
}

function CardBody({ f }: { f: Founder }) {
  return (
    <>
      <span className="relative block aspect-[4/5] overflow-hidden rounded-[16px] bg-navy-2">
        {f.photo ? (
          <Image
            src={f.photo}
            alt={`Portrait of ${f.name}, ${f.role} of DRISYON`}
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
            className="object-cover object-[50%_22%] transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
          />
        ) : (
          <span
            role="img"
            aria-label={`Photo placeholder for ${f.name}`}
            className="absolute inset-0 grid place-items-center"
            style={{
              background:
                "radial-gradient(120% 80% at 30% 0%, rgb(11 99 255 / 0.35), transparent 60%), radial-gradient(100% 80% at 100% 100%, rgb(161 43 226 / 0.35), transparent 60%), #10184a",
            }}
          >
            <span className="font-display text-5xl font-semibold tracking-[-0.04em] text-white/85 transition-transform duration-700 ease-out-soft group-hover:scale-105">
              {f.initials}
            </span>
            <span className="absolute left-3 top-3">
              <PlaceholderTag dark>Photo placeholder</PlaceholderTag>
            </span>
          </span>
        )}
      </span>
      <span className="block px-2 pb-1 pt-4">
        <span className="block font-display text-[1.05rem] font-medium tracking-[-0.02em] text-white">{f.name}</span>
        <span className="block text-sm text-white/50">{f.role}</span>
        <span className="mt-4 flex items-center justify-between rounded-full bg-white/[0.08] px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="2.5" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1.5 6.5h13M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Book a call
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </>
  );
}
