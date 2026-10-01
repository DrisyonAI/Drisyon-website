import "server-only";

/**
 * Google Calendar integration (server-only). Uses OAuth2 with a long-lived refresh token for the
 * organiser account (e.g. reachus@drisyon.com). Run `node scripts/google-auth.mjs` once to get it.
 *
 * Required env:  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 * Optional env:  GOOGLE_CALENDAR_ID (default "primary")
 *                GOOGLE_CALENDAR_ID_<FOUNDER> / FOUNDER_EMAIL_<FOUNDER>  (per-founder calendar & invitee)
 *
 * When the required variables are missing, isCalendarConfigured() is false and booking falls back
 * to request-by-email.
 */

const env = (k: string) => process.env[k]?.trim() || "";
const founderKey = (id: string) => id.toUpperCase().replace(/[^A-Z0-9]/g, "_");

export function isCalendarConfigured() {
  return Boolean(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET") && env("GOOGLE_REFRESH_TOKEN"));
}

/** Calendar the founder's bookings go into (and whose busy times are hidden). */
export function calendarIdFor(founderId: string) {
  return env(`GOOGLE_CALENDAR_ID_${founderKey(founderId)}`) || env("GOOGLE_CALENDAR_ID") || "primary";
}

/** Founder's own address, invited to each booking (optional). */
export function founderEmailFor(founderId: string) {
  return env(`FOUNDER_EMAIL_${founderKey(founderId)}`) || null;
}

let cached: { token: string; expires: number } | null = null;

async function accessToken() {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      refresh_token: env("GOOGLE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Google token error ${res.status}: ${await res.text().catch(() => "")}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

async function google<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Google Calendar ${path.split("?")[0]} ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json() as Promise<T>;
}

export type Busy = { start: number; end: number };

/** Busy intervals for a calendar between two instants. */
export async function busyIntervals(calendarId: string, timeMin: Date, timeMax: Date): Promise<Busy[]> {
  const data = await google<{ calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }> }>(
    "/freeBusy",
    {
      method: "POST",
      body: JSON.stringify({ timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), items: [{ id: calendarId }] }),
    },
  );
  const cal = data.calendars[calendarId];
  if (cal?.errors?.length) throw new Error(`Google freeBusy error for ${calendarId}: ${JSON.stringify(cal.errors)}`);
  return (cal?.busy || []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

export const overlaps = (start: number, end: number, busy: Busy[]) => busy.some((b) => start < b.end && end > b.start);

/** Creates the event with a Google Meet link and emails invitations to all attendees. */
export async function createEvent(
  calendarId: string,
  e: { summary: string; description: string; start: Date; end: Date; timeZone: string; attendees: { email: string; displayName?: string }[]; requestId: string },
) {
  return google<{ id: string; htmlLink: string; hangoutLink?: string }>(
    `/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all&conferenceDataVersion=1`,
    {
      method: "POST",
      body: JSON.stringify({
        summary: e.summary,
        description: e.description,
        start: { dateTime: e.start.toISOString(), timeZone: e.timeZone },
        end: { dateTime: e.end.toISOString(), timeZone: e.timeZone },
        attendees: e.attendees,
        reminders: { useDefault: true },
        conferenceData: { createRequest: { requestId: e.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      }),
    },
  );
}
