"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { bookableFounders, type Founder } from "@/lib/content";
import { BookingDialog } from "./BookingDialog";

/**
 * "Talk to a founder": one row per co-founder (photo, name, role, Book a call). Clicking a row opens a
 * slot picker to request a call, or the founder's own scheduler when `bookingUrl` is configured.
 * Founders without a photo show their initials; set `photo` in src/lib/content.ts.
 */
export function FounderCards() {
  const [open, setOpen] = useState<Founder | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="space-y-3">
        {bookableFounders.map((f) => {
          const inner = <RowBody f={f} />;
          const cls =
            "group flex w-full items-center gap-4 rounded-[20px] bg-white/[0.04] p-3 pr-4 text-left ring-1 ring-inset ring-white/10 transition-[transform,background-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-0.5 hover:bg-white/[0.07] hover:ring-white/25";
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

function RowBody({ f }: { f: Founder }) {
  return (
    <>
      <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-navy-2">
        {f.photo ? (
          <Image
            src={f.photo}
            alt={`Portrait of ${f.name}, ${f.role} of DRISYON`}
            fill
            sizes="64px"
            className="object-cover object-[50%_20%] transition-transform duration-700 ease-out-soft group-hover:scale-[1.06]"
          />
        ) : (
          <span
            role="img"
            aria-label={`Photo of ${f.name} coming soon`}
            className="absolute inset-0 grid place-items-center font-display text-lg font-semibold text-white/85"
            style={{ background: "linear-gradient(135deg, rgb(11 99 255 / 0.55), rgb(161 43 226 / 0.55)), #10184a" }}
          >
            {f.initials}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-white">{f.name}</span>
        <span className="block text-sm text-white/50">{f.role}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.5" y="2.5" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.5 6.5h13M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="hidden whitespace-nowrap sm:inline">Book a call</span>
        <span className="whitespace-nowrap sm:hidden">Book</span>
      </span>
    </>
  );
}
