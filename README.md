# DRISYON — Website

**See beyond. Automate everything.** Marketing site for DRISYON, an AI Automation & Intelligent Systems company.

## Stack

- **Next.js 16** (App Router, TypeScript), statically pre-rendered, with one server route for the contact form
- **Tailwind CSS v4**. The design tokens live in `src/app/globals.css` (`@theme`)
- **Motion** for in-view reveals and interactions. The hero network is a lightweight Canvas 2D animation (no WebGL)
- Fonts: Outfit (display) and Inter (text), self-hosted by `next/font`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Contact form email

`POST /api/contact` validates the input, applies spam protection (a honeypot field, a minimum fill time and a per-IP rate limit) and sends the message through the [Resend](https://resend.com) HTTP API. The visitor's address is set as **reply-to**.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (server-only; never prefix it with `NEXT_PUBLIC_`) |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend, e.g. `DRISYON Website <noreply@drisyon.com>` |
| `CONTACT_TO_EMAIL` | Destination address (defaults to `reachus@drisyon.com`) |

Without these variables, development mode logs each message to the server console. Production returns a "temporarily unavailable" error so that no message is silently lost.

Note: the rate limit lives in memory, per server instance. On serverless hosting, add a shared store such as Upstash or Vercel KV, or Cloudflare Turnstile, if spam becomes a problem.

## Booking a call with a founder

Clicking a founder's card in **Talk to Us** opens a slot picker. The visitor chooses a day and time, then adds their details.

**Hours:** Mon–Fri, 9:30–17:00 IST, 30-minute slots, no slots from 13:00 to 14:00, up to 14 days ahead, and at least 12 hours' notice. To change these, edit `booking` in `src/lib/booking.ts`. The server only accepts slots the picker actually offers.

The booking flow works in two modes. It switches automatically based on environment variables:

| | Google Calendar **not** connected (today) | Google Calendar connected |
| --- | --- | --- |
| Slots shown | Every slot within working hours | Slots that are busy in the calendar are hidden |
| On booking | Request emailed to reachus@drisyon.com; the founder confirms by replying | Event created with a Google Meet link; the visitor (and founder) get a calendar invite; reachus@drisyon.com is emailed |
| Visitor sees | "Request sent" | "You're booked" |

If Google is unreachable, the booking falls back to an emailed request, so no booking is lost.

## Going live (once subscriptions are purchased)

Add these in your hosting provider's environment-variable settings (e.g. Vercel → Project → Settings → Environment Variables), then redeploy. All are server-side secrets, so don't commit them.

**1. Email: required for the contact form and booking notifications**
1. Create a [Resend](https://resend.com) account and verify the `drisyon.com` domain. This means adding the DNS records Resend shows you.
2. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (e.g. `DRISYON Website <noreply@drisyon.com>`) and `CONTACT_TO_EMAIL=reachus@drisyon.com`.

**2. Google Calendar: automatic scheduling**
1. In [Google Cloud Console](https://console.cloud.google.com), create a project and enable the **Google Calendar API**.
2. Under *APIs & Services → OAuth consent screen*, choose **Internal** if drisyon.com is on Google Workspace. Otherwise choose External and **publish** the app; apps left in "Testing" have refresh tokens that expire after 7 days.
3. Under *Credentials*, create an **OAuth client ID** (type *Web application*) with the authorised redirect URI `http://localhost:53682/callback`.
4. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, then run `node scripts/google-auth.mjs`. Sign in as the account that should own the bookings (e.g. reachus@drisyon.com), and copy the printed `GOOGLE_REFRESH_TOKEN`.
5. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REFRESH_TOKEN` in production.
6. Optional: to book into each founder's own calendar, share that calendar with the connected account ("Make changes to events") and set `GOOGLE_CALENDAR_ID_NARAYANAMURTHY` / `GOOGLE_CALENDAR_ID_MADHURA_REDDY`. To invite the founder to each of their calls, set `FOUNDER_EMAIL_NARAYANAMURTHY` / `FOUNDER_EMAIL_MADHURA_REDDY`. Without these, every booking goes into the connected account's primary calendar.

**3. Site URL:** set `NEXT_PUBLIC_SITE_URL` to the final domain.

Alternative: set `NEXT_PUBLIC_BOOKING_URL_<FOUNDER>` to a Calendly or Cal.com link. That founder's card then opens the external scheduler instead of the built-in picker.

## Content still to supply

Nothing below was invented. Each item shows a clearly marked placeholder until the real content is added:

| Item | Where to update |
| --- | --- |
| Photograph of T. Narayanamurthy (K. Madhura Reddy's is in place) | `src/lib/content.ts` → `founders[].photo` (place images in `public/team/`) |
| NIPUNA case study details and screenshots | `works` in `src/lib/content.ts` (set `flow`, `screenshot`, remove `status`) |
| Course details (FDE, Agentic AI, Gen AI) | `courses` in `src/lib/content.ts` |
| Social links (LinkedIn, Instagram, YouTube, Meetup) | `NEXT_PUBLIC_*_URL` environment variables |
| Community link | `NEXT_PUBLIC_COMMUNITY_URL` |
| Site URL (canonical, sitemap, Open Graph) | `NEXT_PUBLIC_SITE_URL` |

## Structure

```
src/
  app/                    layout (SEO, JSON-LD), home page, /work, /solutions/[slug], sitemap, robots, api/contact
  components/             one component per section (Hero, Solutions, Industries, WorkCase, …)
  lib/content.ts          all section content (solutions, industries, process, …)
  lib/site.ts             site config, navigation, social links
  lib/contact.ts          validation shared by the form and the API
scripts/                  one-off asset generators (logo crops, Open Graph image)
```

Adding a project to `works` in `src/lib/content.ts` adds a new case study to the `/work` page.

Adding a solution to `solutions` in `src/lib/content.ts` updates the homepage explorer, creates a `/solutions/<slug>` page and adds it to the sitemap. New sections or pages (case studies, blog, events) can reuse `ui.tsx` primitives (`Button`, `Reveal`, `RevealLines`, `Eyebrow`) and the tokens.

## Logo

The official logo (`public/logo-source.jpg`) is used as supplied. `scripts/make-logo.js` only removes the white background and crops the mark and wordmark for the horizontal navbar lockup. It also makes a reversed (white-text) wordmark for dark backgrounds. The artwork is never redrawn.

## Accessibility and motion

The site uses semantic landmarks, a skip link, visible focus states, keyboard-operable tabs in the solution explorer, and labelled form fields with inline errors. With `prefers-reduced-motion`, CSS animations are switched off, Motion transforms are disabled, the hero canvas renders a single static frame, and autoplay stops.
