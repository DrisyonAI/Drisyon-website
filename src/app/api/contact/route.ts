import { NextResponse } from "next/server";
import { validateContact, type ContactFields } from "@/lib/contact";
import { clientIp, emailHtml, rateLimited, sendMail } from "@/lib/server/mail";

/** Contact form endpoint. The visitor's email is used as reply-to. */
export const runtime = "nodejs";

const MIN_FILL_MS = 2500; // humans take longer than this to fill the form

export async function POST(req: Request) {
  if (rateLimited("contact", clientIp(req))) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const fields: ContactFields = {
    name: str("name"),
    email: str("email"),
    company: str("company"),
    phone: str("phone"),
    interest: str("interest"),
    message: str("message"),
  };

  // Spam protection: honeypot + minimum fill time. Respond "ok" so bots learn nothing.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (str("website") || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(fields);
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const f = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])) as ContactFields;
  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Company", f.company],
    ["Phone", f.phone || "—"],
    ["Interested in", f.interest],
  ];

  const result = await sendMail({
    subject: `New enquiry: ${f.interest} — ${f.name} (${f.company})`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${f.message}`,
    html: emailHtml("New website enquiry", rows, f.message),
    replyTo: f.email,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}
