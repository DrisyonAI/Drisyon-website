"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { booking, formatSlot, upcomingDays } from "@/lib/booking";
import type { Founder } from "@/lib/content";
import { site } from "@/lib/site";

type Step = "pick" | "details" | "done";
type Errors = Partial<Record<"name" | "email" | "company" | "topic" | "slot", string>>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ease = [0.22, 1, 0.36, 1] as const;

/** Slot picker for a call with one founder. Submits a request that is confirmed by email. */
export function BookingDialog({ founder, onClose }: { founder: Founder | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>{founder && <Dialog key={founder.id} founder={founder} onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}

function Dialog({ founder, onClose }: { founder: Founder; onClose: () => void }) {
  const allDays = useMemo(() => upcomingDays(), []);
  // Live availability from Google Calendar (when connected). `live === null` while loading.
  const [live, setLive] = useState<boolean | null>(null);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [scheduled, setScheduled] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?founder=${encodeURIComponent(founder.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { live?: boolean; unavailable?: string[] }) => {
        if (cancelled) return;
        setUnavailable(new Set(d.unavailable || []));
        setLive(Boolean(d.live));
      })
      .catch(() => !cancelled && setLive(false));
    return () => {
      cancelled = true;
    };
  }, [founder.id]);

  const days = useMemo(
    () => allDays.map((d) => ({ ...d, slots: d.slots.filter((s) => !unavailable.has(s)) })).filter((d) => d.slots.length),
    [allDays, unavailable],
  );
  const [dayKeyState, setDayKey] = useState<string | undefined>(allDays[0]?.key);
  const dayKey = days.some((d) => d.key === dayKeyState) ? dayKeyState : days[0]?.key;
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("pick");
  const [f, setF] = useState({ name: "", email: "", company: "", topic: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const openedAt = useRef(Date.now());

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const showLocal = useMemo(() => {
    const probe = new Date().toISOString();
    return formatSlot(probe, { timeStyle: "short" }) !== formatSlot(probe, { timeStyle: "short" }, localTz);
  }, [localTz]);
  const day = days.find((d) => d.key === dayKey);
  const first = founder.name.split(" ").pop();

  // Modal behaviour: lock scroll, Escape closes, keep focus inside, restore focus on close.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const els = [...panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([tabindex='-1']), textarea, a[href]")];
      if (!els.length) return;
      const [a, z] = [els[0], els[els.length - 1]];
      if (e.shiftKey && document.activeElement === a) (z.focus(), e.preventDefault());
      else if (!e.shiftKey && document.activeElement === z) (a.focus(), e.preventDefault());
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [step, live]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Errors = {};
    if (f.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!EMAIL_RE.test(f.email.trim())) errs.email = "Please enter a valid email address.";
    if (f.topic.trim().length < 5) errs.topic = "Please add a line about what you'd like to discuss.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      panel.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setSending(true);
    setServerError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, founder: founder.id, slot, website: honeypot.current?.value ?? "", elapsed: Date.now() - openedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        if (data?.errors?.slot) {
          if (slot) setUnavailable((u) => new Set(u).add(slot));
          setSlot(null);
          setStep("pick");
        }
        throw new Error(data?.error || "Something went wrong.");
      }
      setScheduled(Boolean(data?.scheduled));
      setMeetLink(data?.meetLink || null);
      setStep("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-text outline-none transition-[border-color,box-shadow] focus:border-indigo focus:shadow-[0_0_0_4px_rgb(74_58_240/0.12)]";
  const slotLabel = slot ? `${formatSlot(slot, { weekday: "long", day: "numeric", month: "long" })} · ${formatSlot(slot, { timeStyle: "short" })} ${booking.timeZoneLabel}` : "";

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] bg-paper text-text shadow-[0_40px_120px_-30px_rgb(0_0_0/0.6)] sm:rounded-[28px]"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-line px-6 pb-5 pt-6 sm:px-8">
          {founder.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={founder.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover object-[50%_20%]" />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg font-semibold text-white" style={{ background: "var(--gradient-brand)" }} aria-hidden="true">
              {founder.initials}
            </span>
          )}
          <div className="flex-1">
            <p className="eyebrow text-indigo">Book a call</p>
            <h2 id="booking-title" className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">
              Talk to {founder.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              {founder.role} · {booking.slotMinutes}-minute conversation
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-line text-muted transition-colors hover:text-text">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {step === "pick" && live === null && (
            <div role="status" className="flex items-center justify-center gap-3 py-16 text-sm text-muted">
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-indigo/30 border-t-indigo" />
              Checking availability…
            </div>
          )}
          {step === "pick" && live !== null && days.length === 0 && (
            <p className="py-12 text-center text-sm text-muted">
              No open slots in the next two weeks. Please email{" "}
              <a href={`mailto:${site.email}`} className="text-indigo underline">
                {site.email}
              </a>{" "}
              and we&apos;ll find a time.
            </p>
          )}
          {step === "pick" && live !== null && days.length > 0 && (
            <div>
              <p className="text-sm font-medium">Choose a day</p>
              <div role="radiogroup" aria-label="Day" className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8">
                {days.map((d, i) => {
                  const on = d.key === dayKey;
                  const iso = d.date.toISOString();
                  return (
                    <button
                      key={d.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      data-autofocus={i === 0 ? true : undefined}
                      onClick={() => {
                        setDayKey(d.key);
                        setSlot(null);
                      }}
                      className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2.5 ring-1 ring-inset transition-colors ${
                        on ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-text/30"
                      }`}
                    >
                      <span className={`text-[0.7rem] uppercase tracking-[0.1em] ${on ? "text-white/70" : "text-muted"}`}>{formatSlot(iso, { weekday: "short" })}</span>
                      <span className="font-display text-xl font-semibold">{formatSlot(iso, { day: "numeric" })}</span>
                      <span className={`text-[0.7rem] ${on ? "text-white/70" : "text-muted"}`}>{formatSlot(iso, { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-sm font-medium">Choose a time</p>
                <p className="text-xs text-muted">Times in {booking.timeZoneLabel} (India)</p>
              </div>
              <div role="radiogroup" aria-label="Time" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {day?.slots.map((s) => {
                  const on = s === slot;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSlot(s)}
                      className={`rounded-xl py-2.5 text-sm font-medium ring-1 ring-inset transition-colors ${
                        on ? "text-white ring-transparent" : "bg-white ring-line hover:ring-indigo/50"
                      }`}
                      style={on ? { background: "var(--gradient-brand)" } : undefined}
                    >
                      {formatSlot(s, { timeStyle: "short" })}
                    </button>
                  );
                })}
              </div>
              {errors.slot && <p className="mt-3 text-sm text-red-600">{errors.slot}</p>}
              {slot && showLocal && (
                <p className="mt-3 text-xs text-muted">
                  That&apos;s {formatSlot(slot, { weekday: "short", day: "numeric", month: "short", timeStyle: "short" }, localTz)} in your time zone.
                </p>
              )}
            </div>
          )}

          {step === "details" && (
            <form id="booking-form" onSubmit={submit} noValidate className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-inset ring-line">
                <span className="text-sm">
                  <span className="block text-xs text-muted">Requested slot</span>
                  <span className="font-medium">{slotLabel}</span>
                </span>
                <button type="button" onClick={() => setStep("pick")} className="text-sm text-indigo underline-offset-4 hover:underline">
                  Change
                </button>
              </div>
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {(
                [
                  ["name", "Name", "text", "name"],
                  ["email", "Email", "email", "email"],
                  ["company", "Company (optional)", "text", "organization"],
                ] as const
              ).map(([k, label, type, ac], i) => (
                <div key={k}>
                  <label htmlFor={`bk-${k}`} className="mb-1.5 block text-sm font-medium">
                    {label}
                  </label>
                  <input
                    id={`bk-${k}`}
                    name={k}
                    type={type}
                    autoComplete={ac}
                    maxLength={k === "email" ? 200 : 160}
                    value={f[k]}
                    onChange={set(k)}
                    data-autofocus={i === 0 ? true : undefined}
                    aria-invalid={!!errors[k]}
                    aria-describedby={errors[k] ? `bk-${k}-err` : undefined}
                    className={`${field} ${errors[k] ? "border-red-500/70" : "border-line"}`}
                  />
                  {errors[k] && (
                    <p id={`bk-${k}-err`} className="mt-1 text-xs text-red-600">
                      {errors[k]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label htmlFor="bk-topic" className="mb-1.5 block text-sm font-medium">
                  What would you like to discuss?
                </label>
                <textarea
                  id="bk-topic"
                  name="topic"
                  rows={3}
                  maxLength={2000}
                  value={f.topic}
                  onChange={set("topic")}
                  aria-invalid={!!errors.topic}
                  aria-describedby={errors.topic ? "bk-topic-err" : undefined}
                  className={`${field} resize-y ${errors.topic ? "border-red-500/70" : "border-line"}`}
                />
                {errors.topic && (
                  <p id="bk-topic-err" className="mt-1 text-xs text-red-600">
                    {errors.topic}
                  </p>
                )}
              </div>
              {serverError && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError} You can also email{" "}
                  <a href={`mailto:${site.email}`} className="font-medium underline">
                    {site.email}
                  </a>
                  .
                </p>
              )}
            </form>
          )}

          {step === "done" && (
            <div role="status" className="py-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "var(--gradient-brand)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-5 font-display text-xl font-semibold tracking-[-0.02em]">{scheduled ? "You're booked" : "Request sent"}</p>
              {scheduled ? (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Your call with {founder.name} is on <span className="font-medium text-text">{slotLabel}</span>. A Google Calendar
                  invite{meetLink ? " with the Meet link" : ""} has been sent to <span className="font-medium text-text">{f.email}</span>.
                </p>
              ) : (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  You asked for <span className="font-medium text-text">{slotLabel}</span>. {first} will confirm by email at{" "}
                  <span className="font-medium text-text">{f.email}</span>.
                </p>
              )}
              <button type="button" data-autofocus onClick={onClose} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== "done" && (
          <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4 sm:px-8">
            <p className="text-xs leading-snug text-muted">{live ? "You'll receive a Google Calendar invite." : "Your slot is confirmed by email."}</p>
            {step === "pick" ? (
              <button
                type="button"
                disabled={!slot}
                onClick={() => setStep("details")}
                className="shrink-0 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
                style={{ background: "var(--gradient-brand)" }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                form="booking-form"
                disabled={sending}
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
                style={{ background: "var(--gradient-brand)" }}
              >
                {sending && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {sending ? (live ? "Booking…" : "Sending…") : live ? "Book this slot" : "Request this slot"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
