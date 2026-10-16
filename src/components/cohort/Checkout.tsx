"use client";

import { useState } from "react";
import { GST_RATE_BPS, LIST_PRICE_PAISE, MAX_SEATS_PER_ORDER, OFFER_ENDS_AT, OFFER_PRICE_PAISE, rupees } from "@/lib/cohort/pricing";
import { GSTIN_RE } from "@/lib/cohort/validate";

/**
 * Seat cart + Razorpay checkout (ported from Talia's cart.js). Rendered only when online payment is
 * switched on. The amount shown here is for display: the server recomputes it for every order.
 */
type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open(): void; on(event: string, cb: (r: { error?: { description?: string } }) => void): void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function quote(n: number, now = Date.now()) {
  const offer = now <= OFFER_ENDS_AT.getTime();
  const unit = offer ? OFFER_PRICE_PAISE : LIST_PRICE_PAISE;
  const total = unit * n;
  const base = Math.round((total * 10000) / (10000 + GST_RATE_BPS));
  return { offer, list: LIST_PRICE_PAISE * n, discount: (LIST_PRICE_PAISE - unit) * n, base, gst: total - base, total };
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Secure checkout did not load. Refresh the page, or call us to reserve."));
    document.body.appendChild(s);
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const out = await res.json().catch(() => ({ success: false, error: "" }));
  if (!res.ok || !out.success) throw new Error(out.error || "Payment is not available right now. Please call us to reserve.");
  return out.data as T;
}

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] text-text outline-none transition-[border-color,box-shadow] focus:border-indigo focus:shadow-[0_0_0_4px_rgb(74_58_240/0.12)]";

export function Checkout() {
  const [seats, setSeats] = useState(1);
  const [d, setD] = useState({ name: "", phone: "", email: "", company: "", gstin: "", agree: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paidId, setPaidId] = useState<string | null>(null);
  const q = quote(seats);

  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setD((p) => ({ ...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function check() {
    if (d.name.trim().length < 2) return "Enter your full name.";
    if (!/^(\+?91|0)?[6-9]\d{9}$/.test(d.phone.replace(/[\s()-]/g, ""))) return "Enter a 10-digit Indian mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) return "Enter a valid email address.";
    if (d.gstin && !GSTIN_RE.test(d.gstin.trim().toUpperCase())) return "Enter a valid 15-character GSTIN, or leave it blank.";
    if (!d.agree) return "Tick the box to accept the terms and refund policy.";
    return "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const problem = check();
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      const order = await postJson<{
        orderId: string;
        keyId: string;
        quote: { totalPaise: number; seats: number };
        program: { name: string; code: string };
        prefill: Record<string, string>;
      }>("/api/razorpay/order", { ...d, gstin: d.gstin.trim().toUpperCase(), seats });
      await loadRazorpay();
      let failed = false;
      const rzp = new window.Razorpay!({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.quote.totalPaise,
        currency: "INR",
        name: "DRISYON",
        description: `${order.program.name} · ${order.quote.seats} seat${order.quote.seats > 1 ? "s" : ""}`,
        prefill: order.prefill,
        notes: { program: order.program.code },
        theme: { color: "#4a3af0" },
        handler: async (resp: RazorpayResponse) => {
          try {
            const v = await postJson<{ paymentId: string }>("/api/razorpay/verify", resp);
            setPaidId(String(v.paymentId).replace(/[^\w]/g, ""));
            setSeats(1);
            setD({ name: "", phone: "", email: "", company: "", gstin: "", agree: false });
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            if (!failed) setError("Payment was cancelled. Your seat is not reserved yet.");
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        failed = true;
        setBusy(false);
        setError(`Payment failed: ${r?.error?.description || "please try another method"}. No money was taken for this attempt.`);
      });
      rzp.open();
    } catch (err) {
      setBusy(false);
      setError((err as Error).message);
    }
  }

  if (paidId) {
    return (
      <div role="status" className="rounded-[28px] bg-paper p-8 text-center text-text">
        <p className="font-display text-xl font-semibold">Payment received. Your seat is reserved.</p>
        <p className="mt-2 text-sm text-muted">
          Payment ID <code className="font-mono">{paidId}</code>. A receipt is on its way to your email, and we will call you within two working days to book your technical screen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="cart-title" className="rounded-[28px] bg-paper p-6 text-text sm:p-8">
      <h3 id="cart-title" className="font-display text-xl font-semibold">Your order</h3>
      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-inset ring-line">
        <div>
          <b className="block">Cloud Security Cohort 01</b>
          <span className="text-xs text-muted">Seat · 6 months · starts 1 Nov 2026</span>
        </div>
        <div role="group" aria-label="Number of seats" className="flex items-center gap-2">
          <button type="button" onClick={() => setSeats((s) => Math.max(1, s - 1))} disabled={seats <= 1} aria-label="Remove a seat" className="h-9 w-9 rounded-full ring-1 ring-line disabled:opacity-40">−</button>
          <output aria-live="polite" className="w-6 text-center font-mono">{seats}</output>
          <button type="button" onClick={() => setSeats((s) => Math.min(MAX_SEATS_PER_ORDER, s + 1))} disabled={seats >= MAX_SEATS_PER_ORDER} aria-label="Add a seat" className="h-9 w-9 rounded-full ring-1 ring-line disabled:opacity-40">+</button>
        </div>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm tabular-nums">
        <div className="flex justify-between"><dt className="text-muted">List price</dt><dd>{rupees(q.list)}</dd></div>
        {q.offer && <div className="flex justify-between"><dt className="text-muted">Navratri discount (25%)</dt><dd className="text-emerald-700">−{rupees(q.discount)}</dd></div>}
        <div className="flex justify-between text-xs"><dt className="text-muted">Taxable value</dt><dd>{rupees(q.base, true)}</dd></div>
        <div className="flex justify-between text-xs"><dt className="text-muted">GST @ 18%</dt><dd>{rupees(q.gst, true)}</dd></div>
        <div className="flex justify-between border-t border-line pt-2 font-semibold"><dt>Total payable</dt><dd>{rupees(q.total)}</dd></div>
      </dl>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium">Learner details</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Full name<input name="name" autoComplete="name" maxLength={80} value={d.name} onChange={set("name")} className={field} /></label>
          <label className="text-sm">Mobile<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={16} value={d.phone} onChange={set("phone")} className={field} /></label>
        </div>
        <label className="block text-sm">Email<input name="email" type="email" autoComplete="email" maxLength={120} value={d.email} onChange={set("email")} className={field} /></label>
        <details className="rounded-xl bg-white px-4 py-3 ring-1 ring-inset ring-line">
          <summary className="cursor-pointer text-sm">Need a GST invoice for your company?</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Company name<input name="company" autoComplete="organization" maxLength={120} value={d.company} onChange={set("company")} className={field} /></label>
            <label className="text-sm">GSTIN<input name="gstin" maxLength={15} value={d.gstin} onChange={set("gstin")} className={`${field} uppercase`} /></label>
          </div>
        </details>
      </fieldset>

      <label className="mt-4 flex items-start gap-3 text-sm">
        <input type="checkbox" checked={d.agree} onChange={set("agree")} className="mt-1" />
        <span>
          I agree to the <a href="/terms" target="_blank" rel="noopener" className="underline">terms</a> and{" "}
          <a href="/refund-policy" target="_blank" rel="noopener" className="underline">refund policy</a>.
        </span>
      </label>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="mt-5 w-full rounded-full px-6 py-3.5 font-medium text-white disabled:opacity-70" style={{ background: "var(--gradient-brand)" }}>
        {busy ? "Opening secure checkout…" : `Pay ${rupees(q.total)} securely`}
      </button>
      <p className="mt-3 text-center text-xs text-muted">UPI, cards, net banking and EMI, processed by Razorpay. We never see your card details.</p>
    </form>
  );
}
