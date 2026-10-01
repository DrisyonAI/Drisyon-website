import "server-only";

/**
 * Server-only helpers shared by the form endpoints. Secrets come from environment variables
 * (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL) and never reach the browser.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>(); // best-effort, per-instance rate limit

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** `bucket` keeps each form's limit separate. */
export function rateLimited(bucket: string, ip: string) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function emailHtml(heading: string, rows: [string, string][], message?: string) {
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#0b1024">
<h2 style="margin:0 0 16px">${esc(heading)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#5b6282">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>${
    message ? `\n<p style="margin:20px 0 6px;color:#5b6282">Message</p>\n<p style="white-space:pre-wrap;margin:0">${esc(message)}</p>` : ""
  }</div>`;
}

export type SendResult = { ok: true; dev?: boolean } | { ok: false; status: number; error: string };

/** Sends via the Resend HTTP API. In development without keys, logs the message instead. */
export async function sendMail({ subject, text, html, replyTo }: { subject: string; text: string; html: string; replyTo: string }): Promise<SendResult> {
  const to = process.env.CONTACT_TO_EMAIL || "reachus@drisyon.com";
  const from = process.env.CONTACT_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[mail] Delivery not configured — logged instead:\nSubject: ${subject}\n${text}`);
      return { ok: true, dev: true };
    }
    console.error("[mail] RESEND_API_KEY / CONTACT_FROM_EMAIL are not set.");
    return { ok: false, status: 503, error: "This form is temporarily unavailable." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject: oneLine(subject).slice(0, 180), text, html }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("[mail] Resend error", res.status, await res.text().catch(() => ""));
      return { ok: false, status: 502, error: "We couldn't send your message right now." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mail] Delivery failed", err);
    return { ok: false, status: 502, error: "We couldn't send your message right now." };
  }
}
