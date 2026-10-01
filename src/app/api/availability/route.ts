import { NextResponse } from "next/server";
import { booking, upcomingDays } from "@/lib/booking";
import { founders } from "@/lib/content";
import { busyIntervals, calendarIdFor, isCalendarConfigured, overlaps } from "@/lib/server/google-calendar";

/**
 * Which offered slots are already taken in the founder's Google Calendar.
 * `live: false` means the calendar isn't connected yet — every slot is shown and bookings are
 * sent as requests by email.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("founder") || "";
  if (!founders.some((f) => f.id === id)) return NextResponse.json({ error: "Unknown founder." }, { status: 404 });
  if (!isCalendarConfigured()) return NextResponse.json({ live: false, unavailable: [] });

  const slots = upcomingDays().flatMap((d) => d.slots);
  if (!slots.length) return NextResponse.json({ live: true, unavailable: [] });

  const len = booking.slotMinutes * 60_000;
  try {
    const busy = await busyIntervals(calendarIdFor(id), new Date(slots[0]), new Date(Date.parse(slots[slots.length - 1]) + len));
    const unavailable = slots.filter((s) => overlaps(Date.parse(s), Date.parse(s) + len, busy));
    return NextResponse.json({ live: true, unavailable }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[availability]", err);
    // Calendar unreachable: fall back to request mode rather than blocking visitors.
    return NextResponse.json({ live: false, unavailable: [] });
  }
}
