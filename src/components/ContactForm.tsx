"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { interestOptions } from "@/lib/content";
import { LIMITS, validateContact as validate, type ContactErrors as Errors, type ContactFields as Fields } from "@/lib/contact";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

const empty: Fields = { name: "", email: "", company: "", phone: "", interest: "", message: "" };

export function ContactForm() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // CTAs elsewhere on the page (data-interest="…") preselect the matching option.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-interest]");
      const v = el?.getAttribute("data-interest");
      if (v && interestOptions.includes(v as (typeof interestOptions)[number])) {
        setF((p) => ({ ...p, interest: v }));
        setErrors((p) => ({ ...p, interest: undefined }));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, website: honeypot.current?.value ?? "", elapsed: Date.now() - startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        throw new Error(data?.error || "Something went wrong.");
      }
      setStatus("success");
      setF(empty);
    } catch (err) {
      setStatus("error");
      setServerMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "peer w-full rounded-xl border bg-white px-4 pb-2.5 pt-6 text-[0.98rem] text-text outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-transparent focus:border-indigo focus:shadow-[0_0_0_4px_rgb(74_58_240/0.12)]";
  const errCls = (k: keyof Fields) => (errors[k] ? "border-red-500/70" : "border-line");

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[420px] flex-col items-center justify-center text-center"
        role="status"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: "var(--gradient-brand)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] text-text">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            startedAt.current = Date.now();
          }}
          className="mt-6 text-sm text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-note" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field id="name" label="Name" error={errors.name}>
        <input id="name" name="name" maxLength={LIMITS.name} autoComplete="name" placeholder="Name" value={f.name} onChange={set("name")} className={`${field} ${errCls("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} required />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" name="email" maxLength={LIMITS.email} type="email" autoComplete="email" placeholder="Email" value={f.email} onChange={set("email")} className={`${field} ${errCls("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} required />
      </Field>
      <Field id="company" label="Company" error={errors.company}>
        <input id="company" name="company" maxLength={LIMITS.company} autoComplete="organization" placeholder="Company" value={f.company} onChange={set("company")} className={`${field} ${errCls("company")}`} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-err" : undefined} required />
      </Field>
      <Field id="phone" label="Phone (optional)" error={errors.phone}>
        <input id="phone" name="phone" maxLength={LIMITS.phone} type="tel" autoComplete="tel" placeholder="Phone" value={f.phone} onChange={set("phone")} className={`${field} ${errCls("phone")}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-err" : undefined} />
      </Field>
      <Field id="interest" label="Interested in" error={errors.interest} className="sm:col-span-2" filled={!!f.interest}>
        <select id="interest" name="interest" value={f.interest} onChange={set("interest")} className={`${field} ${errCls("interest")} appearance-none pr-10 ${f.interest ? "" : "text-transparent"}`} aria-invalid={!!errors.interest} aria-describedby={errors.interest ? "interest-err" : undefined} required>
          <option value="" disabled hidden>
            Select
          </option>
          {interestOptions.map((o) => (
            <option key={o} value={o} className="text-text">
              {o}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </Field>
      <Field id="message" label="Message" error={errors.message} className="sm:col-span-2">
        <textarea id="message" name="message" maxLength={LIMITS.message} rows={5} placeholder="Message" value={f.message} onChange={set("message")} className={`${field} ${errCls("message")} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} required />
      </Field>

      <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="text-xs leading-relaxed text-muted">
          We&apos;ll only use your details to reply. Or email us at{" "}
          <a href={`mailto:${site.email}`} className="text-text underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-medium text-white shadow-[0_10px_30px_-12px_rgb(74_58_240/0.6)] transition-opacity disabled:opacity-70"
          style={{ background: "var(--gradient-brand)" }}
        >
          {status === "sending" ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>

      <div aria-live="polite" className="sm:col-span-2">
        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverMsg || "Something went wrong."} You can also email us directly at{" "}
              <a href={`mailto:${site.email}`} className="font-medium underline">
                {site.email}
              </a>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
  className = "",
  filled,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  filled?: boolean;
}) {
  return (
    <div className={className}>
      <div className="relative">
        {children}
        {/* Floating label: sits inside the field, lifts when focused or filled */}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 text-muted transition-all duration-200 ${
            filled === undefined
              ? "top-2 text-[0.72rem] peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-[0.98rem] peer-focus:top-2 peer-focus:text-[0.72rem] peer-focus:text-indigo"
              : filled
                ? "top-2 text-[0.72rem]"
                : "top-[1.05rem] text-[0.98rem] peer-focus:top-2 peer-focus:text-[0.72rem] peer-focus:text-indigo"
          }`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 px-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
