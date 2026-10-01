/**
 * Call-booking configuration and slot generation.
 * Shared by the booking dialog (client) and /api/book (server), so the server only accepts
 * slots that the dialog could actually have offered.
 *
 * Slots are booking *requests* — they're confirmed by email, since the site isn't connected
 * to the founders' live calendars.
 */
export const booking = {
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  /** Fixed UTC offset for the time zone above (IST has no daylight saving). */
  utcOffsetMinutes: 330,
  /** 0 = Sunday … 6 = Saturday */
  workingDays: [1, 2, 3, 4, 5],
  /** Day window as minutes from midnight: 9:30 → 17:00 */
  startMinute: 9 * 60 + 30,
  endMinute: 17 * 60,
  /** No slots overlap these windows (lunch 13:00–14:00) */
  breaks: [{ start: 13 * 60, end: 14 * 60 }],
  slotMinutes: 30,
  daysAhead: 14,
  /** Earliest bookable slot, relative to now */
  minLeadHours: 12,
};

export type Day = { key: string; date: Date; slots: string[] };

const MS_MIN = 60_000;

/** Calendar date (y, m, d, weekday) in the booking time zone for a given instant. */
function zonedParts(t: number) {
  const z = new Date(t + booking.utcOffsetMinutes * MS_MIN);
  return { y: z.getUTCFullYear(), m: z.getUTCMonth(), d: z.getUTCDate(), wd: z.getUTCDay() };
}

/** UTC instant for a wall-clock time in the booking time zone. */
function zonedInstant(y: number, m: number, d: number, h: number, min: number) {
  return Date.UTC(y, m, d, h, min) - booking.utcOffsetMinutes * MS_MIN;
}

/** Upcoming working days with their available slot start times (ISO strings, UTC). */
export function upcomingDays(now = Date.now()): Day[] {
  const earliest = now + booking.minLeadHours * 60 * MS_MIN;
  const days: Day[] = [];
  const today = zonedParts(now);
  for (let i = 0; i <= booking.daysAhead; i++) {
    const noon = zonedInstant(today.y, today.m, today.d + i, 12, 0);
    const p = zonedParts(noon);
    if (!booking.workingDays.includes(p.wd)) continue;
    const slots: string[] = [];
    for (let min = booking.startMinute; min + booking.slotMinutes <= booking.endMinute; min += booking.slotMinutes) {
      const end = min + booking.slotMinutes;
      if (booking.breaks.some((b) => min < b.end && end > b.start)) continue;
      const t = zonedInstant(p.y, p.m, p.d, Math.floor(min / 60), min % 60);
      if (t >= earliest) slots.push(new Date(t).toISOString());
    }
    if (slots.length) days.push({ key: `${p.y}-${p.m + 1}-${p.d}`, date: new Date(noon), slots });
  }
  return days;
}

export function isValidSlot(iso: string, now = Date.now()) {
  return upcomingDays(now).some((d) => d.slots.includes(iso));
}

export function formatSlot(iso: string, opts: Intl.DateTimeFormatOptions, timeZone = booking.timeZone) {
  return new Intl.DateTimeFormat("en-IN", { timeZone, ...opts }).format(new Date(iso));
}
