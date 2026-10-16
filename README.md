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

`POST /api/contact` validates the input, applies spam protection (a honeypot field, a minimum fill time and a per-IP rate limit) and sends the message through the **Hostinger mailbox** over SMTP. The visitor's address is set as **reply-to**.

| Variable | Purpose |
| --- | --- |
| `SMTP_USER` | Mailbox that sends the emails: `reachus@drisyon.com` |
| `SMTP_PASS` | That mailbox's password (server-only; never prefix it with `NEXT_PUBLIC_`) |
| `SMTP_HOST` / `SMTP_PORT` | Default to `smtp.hostinger.com` / `465` |
| `CONTACT_TO_EMAIL` | Destination address (defaults to `SMTP_USER`) |

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

## Going live on drisyon.com

**Setup:** code on GitHub at `DrisyonAI/Drisyon-website`, hosting on Vercel, and domain, DNS and email on Hostinger.

**1. Deploy on Vercel**
1. Sign in at [vercel.com](https://vercel.com) with GitHub. Use the **Pro** plan for a company site, because the free Hobby plan is for non-commercial use.
2. **Add New → Project**, import `DrisyonAI/Drisyon-website`, and keep the detected Next.js settings.
3. Under **Environment Variables**, add the values from `.env.example`. At minimum:
   - `SMTP_USER=reachus@drisyon.com`
   - `SMTP_PASS` (the mailbox password)
   - `CONTACT_TO_EMAIL=reachus@drisyon.com`
   - `NEXT_PUBLIC_SITE_URL=https://drisyon.com`
4. Click **Deploy**. From then on, every push to `main` redeploys automatically.

**2. Connect the domain**
1. In Vercel, go to **Project → Settings → Domains** and add `drisyon.com` and `www.drisyon.com`. Redirect `www` to `drisyon.com`.
2. In **Hostinger → Domains → drisyon.com → DNS / Nameservers**, edit only these records. Use the values Vercel displays if they differ:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `76.76.21.21` (replaces the current `2.57.91.91`) |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Delete any other `A`/`AAAA`/`ALIAS` record on `@` or `www`. **Leave the MX, TXT (SPF/DKIM/DMARC) and other mail records untouched**, or reachus@drisyon.com stops receiving email. Keep the Hostinger nameservers.
3. DNS changes take from a few minutes to a few hours to spread. Vercel then issues the HTTPS certificate automatically.

**3. Google Calendar: automatic scheduling (optional, can be done later)**
1. In [Google Cloud Console](https://console.cloud.google.com), create a project and enable the **Google Calendar API**.
2. Under *APIs & Services → OAuth consent screen*, choose **Internal** if drisyon.com is on Google Workspace. Otherwise choose External and **publish** the app; apps left in "Testing" have refresh tokens that expire after 7 days.
3. Under *Credentials*, create an **OAuth client ID** (type *Web application*) with the authorised redirect URI `http://localhost:53682/callback`.
4. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, then run `node scripts/google-auth.mjs`. Sign in as the account that should own the bookings (e.g. reachus@drisyon.com), and copy the printed `GOOGLE_REFRESH_TOKEN`.
5. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REFRESH_TOKEN` in production.
6. Optional: to book into each founder's own calendar, share that calendar with the connected account ("Make changes to events") and set `GOOGLE_CALENDAR_ID_NARAYANAMURTHY` / `GOOGLE_CALENDAR_ID_MADHURA_REDDY`. To invite the founder to each of their calls, set `FOUNDER_EMAIL_NARAYANAMURTHY` / `FOUNDER_EMAIL_MADHURA_REDDY`. Without these, every booking goes into the connected account's primary calendar.

Alternative: set `NEXT_PUBLIC_BOOKING_URL_<FOUNDER>` to a Calendly or Cal.com link. That founder's card then opens the external scheduler instead of the built-in picker.

## Cloud Security Cohort 01 (`/cloud-security`)

This course page was merged from Talia Technologies' `drisyon-cyber-cohort` project and rebuilt in this site's design. It includes the policy pages Razorpay requires: `/terms`, `/refund-policy`, `/privacy` and `/contact`.

| What | Where |
| --- | --- |
| Price, offer, deadline, seat cap | `src/lib/cohort/pricing.ts` (the single source of truth; the server recomputes every order) |
| Page text: roadmap, labs, certifications, FAQ | `src/lib/cohort/content.ts` |
| Company legal details for the policy pages | `src/lib/company.ts` |
| Payment endpoints | `/api/razorpay/order`, `/api/razorpay/verify`, `/api/razorpay/webhook` (logic in `src/lib/server/cohort-payments.ts`) |
| Enrolment table | `supabase/migrations/20261016000000_drisyon_enrolments.sql` (table `drisyon_enrolments`) |
| Tests | `npm test` (42 tests ported from the original project) |

**Current mode: enquiries only.** The page shows an enquiry form, which arrives at reachus@drisyon.com tagged "Cloud Security Cohort". Online payment switches on only when all three of these are true:

1. `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in Vercel.
2. `COHORT_PAYMENTS=on` is set.
3. `registeredOffice` and `grievanceOfficer` are filled in `src/lib/company.ts`. Until they are, the policy pages show highlighted placeholders and are kept out of search engines.

**Go-live checklist** (from the original project's launch plan):
- [ ] Fill the registered office address and grievance officer in `src/lib/company.ts`.
- [ ] Sign off the refund windows (100% until 25 Oct, 50% until 14 Nov) and the exam-voucher wording in the terms.
- [ ] Get written confirmation from the industry-lab partner for "patented, licensed enterprise tools" and the named vendors.
- [ ] Set `CONTACT_PHONE` to show the Call / WhatsApp buttons.
- [ ] Set the Razorpay **test** keys, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then `COHORT_PAYMENTS=on`.
- [ ] In Razorpay, add the webhook `https://drisyon.com/api/razorpay/webhook` with the events `order.paid`, `payment.captured`, `payment.failed` and `refund.processed`.
- [ ] Make one test payment and one test refund. Check that the row appears in `drisyon_enrolments` and then shows `refunded`.
- [ ] Switch to the **live** keys after Razorpay KYC and submit drisyon.com for live activation.

The Navratri offer price ends automatically on 20 Oct 2026 at 11:59 pm IST. The page re-renders every 5 minutes, and an open tab switches over at the deadline.

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
