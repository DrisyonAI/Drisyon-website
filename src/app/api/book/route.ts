import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { booking, formatSlot, isValidSlot } from "@/lib/booking";
import { founders } from "@/lib/content";
import { clientIp, emailHtml, rateLimited, sendMail } from "@/lib/server/mail";
import { busyIntervals, calendarIdFor, createEvent, founderEmailFor, isCalendarConfigured, overlaps } from "@/lib/server/google-calendar";

/**
 * Book a call with a founder.
 * - Google Calendar connected: re-checks the slot is free, creates the event (with a Meet link) and
 *   sends calendar invitations. The team is also notified by email.
 * - Not connected (or Google unavailable): the request is emailed to the team to confirm manually.
 * Either way, every booking reaches CONTACT_TO_EMAIL (reachus@drisyon.com).
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2000;

type BookingErrors = Partial<Record<"name" | "email" | "company" | "topic" | "slot" | "founder", string>>;

export async function POST(req: Request) {
  if (rateLimited("book", clientIp(req))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (str("website") || elapsed < MIN_FILL_MS) return NextResponse.json({ ok: true, scheduled: false });

  const founder = founders.find((f) => f.id === str("founder"));
  const slot = str("slot");
  const name = str("name"), email = str("email"), company = str("company"), topic = str("topic");

  const errors: BookingErrors = {};
  if (!founder) errors.founder = "Please choose who you'd like to talk to.";
  if (!isValidSlot(slot)) errors.slot = "That slot is no longer available. Please pick another.";
  if (name.length < 2 || name.length > 120) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = "Please enter a valid email address.";
  if (company.length > 160) errors.company = "Please shorten the company name.";
  if (topic.length < 5) errors.topic = "Please add a line about what you'd like to discuss.";
  else if (topic.length > 2000) errors.topic = "Please keep this under 2000 characters.";
  if (Object.keys(errors).length || !founder) {
    return NextResponse.json({ error: errors.slot || "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const start = new Date(slot);
  const end = new Date(start.getTime() + booking.slotMinutes * 60_000);
  const when = `${formatSlot(slot, { dateStyle: "full", timeStyle: "short" })} ${booking.timeZoneLabel}`;

  // ── Google Calendar ───────────────────────────────────────────────
  let scheduled = false;
  let calendarNote = "Google Calendar not connected — reply to the visitor to confirm this slot.";
  let meetLink: string | undefined;

  if (isCalendarConfigured()) {
    const calendarId = calendarIdFor(founder.id);
    try {
      const busy = await busyIntervals(calendarId, start, end);
      if (overlaps(start.getTime(), end.getTime(), busy)) {
        return NextResponse.json(
          { error: "Sorry, that slot was just taken. Please pick another.", errors: { slot: "That slot was just taken." } },
          { status: 409 },
        );
      }
      const founderEmail = founderEmailFor(founder.id);
      const event = await createEvent(calendarId, {
        summary: `DRISYON × ${name}${company ? ` (${company})` : ""} — call with ${founder.name}`,
        description: `Booked via drisyon.com\n\nWith: ${founder.name}\nVisitor: ${name} <${email}>${company ? `\nCompany: ${company}` : ""}\n\nTopic:\n${topic}`,
        start,
        end,
        timeZone: booking.timeZone,
        attendees: [
          { email, displayName: name },
          ...(founderEmail ? [{ email: founderEmail, displayName: founder.name }] : []),
        ],
        requestId: randomUUID(),
      });
      scheduled = true;
      meetLink = event.hangoutLink;
      calendarNote = `Added to Google Calendar: ${event.htmlLink}${meetLink ? `\nGoogle Meet: ${meetLink}` : ""}`;
    } catch (err) {
      console.error("[book] Google Calendar failed — falling back to email request", err);
      calendarNote = "⚠ Could not add to Google Calendar automatically — please schedule this manually and confirm with the visitor.";
    }
  }

  // ── Email to the team (always) ────────────────────────────────────
  const rows: [string, string][] = [
    ["Status", scheduled ? "Booked — calendar invite sent" : "Requested — needs confirmation"],
    ["With", founder.name],
    ["Slot", `${when} (${booking.slotMinutes} min)`],
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ...(meetLink ? ([["Google Meet", meetLink]] as [string, string][]) : []),
  ];
  const mail = await sendMail({
    subject: `${scheduled ? "Call booked" : "Call request"} with ${founder.name}: ${when} — ${name}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nTopic:\n${topic}\n\n${calendarNote}`,
    html: emailHtml(scheduled ? "New call booked" : "New call request", rows, `${topic}\n\n${calendarNote}`),
    replyTo: email,
  });

  // The calendar invite already reached the visitor, so a failed notification email shouldn't fail the booking.
  if (!mail.ok && !scheduled) return NextResponse.json({ error: mail.error }, { status: mail.status });
  if (!mail.ok) console.error("[book] Team notification email failed after calendar booking", mail.error);

  return NextResponse.json({ ok: true, scheduled, meetLink: meetLink ?? null });
}
