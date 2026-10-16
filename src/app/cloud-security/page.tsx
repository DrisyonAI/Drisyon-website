import type { Metadata } from "next";
import { Checkout } from "@/components/cohort/Checkout";
import { OfferCard } from "@/components/cohort/OfferCard";
import { ContactForm } from "@/components/ContactForm";
import { Eyebrow, Reveal } from "@/components/ui";
import { capstone, certs, facts, faq, hours, labBlocks, months, telemetry, tools, trainerFacts, who } from "@/lib/cohort/content";
import { GST_RATE_BPS, LIST_PRICE_PAISE, OFFER_ENDS_AT, OFFER_NAME, OFFER_PRICE_PAISE, PROGRAM, rupees } from "@/lib/cohort/pricing";
import { company, contactPhone } from "@/lib/company";
import { paymentsReady } from "@/lib/server/cohort-payments";
import { site } from "@/lib/site";

// Re-render every 5 minutes so the offer price and payment switch stay current.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cloud Security Cohort 01",
  description:
    "A 6-month, 90-hour cybersecurity program for DevOps, SRE and cloud engineers: ten hands-on labs, six OEM certification tracks and 30 hours in a working industry lab. Starts 1 November 2026.",
  alternates: { canonical: "/cloud-security" },
  openGraph: { title: "Cloud Security Cohort 01 | DRISYON", url: "/cloud-security" },
};

const H2 = "font-display text-h3 font-semibold tracking-[-0.03em]";

export default function CloudSecurityPage() {
  const payments = paymentsReady();
  const phone = contactPhone();
  const now = new Date();
  const offerLive = now <= OFFER_ENDS_AT;
  const base = (total: number) => Math.round((total * 10_000) / (10_000 + GST_RATE_BPS));
  const feeRows = [
    { label: "Program fee", list: rupees(base(LIST_PRICE_PAISE), true), offer: rupees(base(OFFER_PRICE_PAISE), true) },
    { label: `GST @ ${GST_RATE_BPS / 100}%`, list: rupees(LIST_PRICE_PAISE - base(LIST_PRICE_PAISE), true), offer: rupees(OFFER_PRICE_PAISE - base(OFFER_PRICE_PAISE), true) },
  ];
  const nowPrice = rupees(offerLive ? OFFER_PRICE_PAISE : LIST_PRICE_PAISE);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: PROGRAM.name,
    description: metadata.description,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Blended",
      startDate: PROGRAM.startDate,
      courseWorkload: "PT90H",
    },
    offers: {
      "@type": "Offer",
      price: (offerLive ? OFFER_PRICE_PAISE : LIST_PRICE_PAISE) / 100,
      priceCurrency: "INR",
      url: `${site.url}/cloud-security`,
      availability: "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section aria-labelledby="hero-h" className="relative isolate overflow-hidden pt-[120px] md:pt-[150px]">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_30%,black,transparent)]" />
        <div aria-hidden="true" className="absolute -right-[15%] top-0 -z-10 h-[60vh] w-[60vw] rounded-full opacity-[0.10] blur-[120px]" style={{ background: "var(--gradient-brand)" }} />
        <div className="container-x grid gap-12 pb-16 lg:grid-cols-12 lg:items-start lg:pb-24">
          <div className="lg:col-span-7">
            <p className="fade-up eyebrow text-indigo">Future-Ready Learners · Cybersecurity · Cohort 01</p>
            <h1 id="hero-h" className="fade-up mt-6 font-display text-hero font-semibold tracking-[-0.035em]" style={{ animationDelay: "0.1s" }}>
              You ship to the cloud every day. <span className="text-gradient">Now learn to defend it.</span>
            </h1>
            <p className="fade-up mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-muted md:text-lg" style={{ animationDelay: "0.2s" }}>
              A 6-month, 90-hour cybersecurity program built for DevOps, SRE and cloud engineers. Ten hands-on labs, six OEM
              certification tracks, and 30 hours inside a working industry lab on patented, licensed enterprise security tools.
              Taught by dedicated trainers with 8 to 10+ years of industry experience.
            </p>
            <ul className="fade-up mt-8 flex flex-wrap gap-2" style={{ animationDelay: "0.3s" }}>
              {facts.map((f) => (
                <li key={f.label} className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-inset ring-line">
                  <span className="text-muted">{f.label} · </span>
                  <b className="font-medium">{f.value}</b>
                </li>
              ))}
            </ul>
          </div>
          <div className="fade-up lg:col-span-5" style={{ animationDelay: "0.25s" }}>
            <OfferCard
              listPaise={LIST_PRICE_PAISE}
              offerPaise={OFFER_PRICE_PAISE}
              offerName={`Navratri offer · ${OFFER_NAME.replace("Navratri ", "")}`}
              offerEndsAt={OFFER_ENDS_AT.toISOString()}
              cohortSize={PROGRAM.cohortSize}
              cta={
                payments
                  ? { label: "Pay & reserve my seat", href: "#enrol", note: "Pay online with UPI, cards, net banking or EMI. A 20-minute technical screen follows; full refund if it is not a fit." }
                  : { label: "Enquire about a seat", href: "#enrol", note: "Send an enquiry and the course team will call you to answer questions and reserve your seat." }
              }
            />
          </div>
        </div>

        {/* Sample SIEM output */}
        <div aria-label="Sample SIEM output from the course lab" className="on-dark overflow-x-auto bg-ink py-5 text-white">
          <div className="container-x space-y-1 font-mono text-[0.75rem] leading-relaxed text-white/70 sm:text-[0.8rem]">
            {telemetry.map((l) => (
              <p key={l.t} className="whitespace-pre">
                <span className="text-white/40">{l.t}</span>  {l.line}  <span className={l.kind === "hit" ? "text-[#ff8fa3]" : "text-[#7fe0b0]"}>{l.tag}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who ─────────────────────────────────────────── */}
      <section aria-labelledby="who-h" className="bg-paper section-y">
        <div className="container-x">
          <Reveal>
            <Eyebrow>Who this cohort is for</Eyebrow>
            <h2 id="who-h" className={`mt-5 ${H2}`}>Engineers who already run production</h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
              You know pipelines, containers and at least one cloud. This program adds the security layer your team keeps asking someone else to own.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {who.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="h-full rounded-[22px] bg-white p-6 ring-1 ring-inset ring-line">
                  <h3 className="font-display text-lg font-semibold">{w.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {w.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[0.95rem] text-text/85">
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-indigo/60" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Format ─────────────────────────────────────────── */}
      <section aria-labelledby="hrs-h" className="bg-surface section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Format</Eyebrow>
            <h2 id="hrs-h" className={`mt-5 ${H2}`}>90 contact hours over 26 weeks</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">About 3.5 hours a week. Built to sit beside a full-time job, with self-paced OEM coursework between sessions.</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div role="img" aria-label="40 hours live labs, 20 hours clinics, 30 hours industry lab" className="flex h-12 overflow-hidden rounded-xl text-sm font-semibold text-white">
              {hours.map((h, i) => (
                <div key={h.title} className="grid place-items-center" style={{ flex: h.h, background: ["#10184a", "#4a3af0", "#a12be2"][i] }}>
                  {h.h}h
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-4">
              {hours.map((h, i) => (
                <li key={h.title} className="flex items-start gap-4">
                  <i aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 rounded-sm" style={{ background: ["#10184a", "#4a3af0", "#a12be2"][i] }} />
                  <span className="flex-1">
                    <b className="block font-medium">{h.title}</b>
                    <span className="text-sm text-muted">{h.text}</span>
                  </span>
                  <span className="font-display text-2xl font-semibold tabular-nums">{h.h}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Roadmap ─────────────────────────────────────────── */}
      <section aria-labelledby="road-h" className="bg-paper section-y">
        <div className="container-x">
          <Reveal>
            <Eyebrow>Six-month roadmap</Eyebrow>
            <h2 id="road-h" className={`mt-5 ${H2}`}>From telemetry to a working SOC, one month at a time</h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">Every session ends with a deliverable you keep. Each one also shows where it plugs into a DevOps pipeline.</p>
          </Reveal>
          <ol className="relative mt-12 space-y-10 border-l border-line pl-6 md:pl-10">
            {months.map((mo) => (
              <li key={mo.m} className="relative">
                <span aria-hidden="true" className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full md:-left-[47px]" style={{ background: "var(--gradient-brand)" }} />
                <Reveal>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
                      {mo.m}: {mo.title}
                    </h3>
                    <span className="font-mono text-xs text-muted">{mo.when}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mo.chips.map((c) => (
                      <span key={c} className="rounded-full bg-surface px-3 py-1 text-xs font-medium ring-1 ring-inset ring-line">{c}</span>
                    ))}
                    {mo.lab && <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-semibold text-violet">{mo.lab}</span>}
                  </div>
                  {mo.s.length ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {mo.s.map((s) => (
                        <article key={s.id} className="rounded-[20px] bg-white p-5 ring-1 ring-inset ring-line">
                          <span className="font-mono text-[0.7rem] text-indigo">{s.id} · 4 HRS</span>
                          <h4 className="mt-2 font-medium leading-snug">{s.t}</h4>
                          <dl className="mt-3 space-y-1.5 text-sm">
                            <div><dt className="inline text-muted">Tools: </dt><dd className="inline">{s.tools}</dd></div>
                            <div><dt className="inline text-muted">You deliver: </dt><dd className="inline">{s.out}</dd></div>
                          </dl>
                          <p className="mt-3 border-t border-line pt-3 text-sm text-text/80"><b className="font-medium">DevOps angle:</b> {s.ops}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 max-w-2xl leading-relaxed text-muted">{capstone}</p>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Industry lab ─────────────────────────────────────────── */}
      <section aria-labelledby="lab-h" className="on-dark relative isolate overflow-hidden bg-ink text-white section-y">
        <div aria-hidden="true" className="grid-lines-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="container-x">
          <Reveal>
            <Eyebrow dark>30 hours · Industry lab immersion</Eyebrow>
            <h2 id="lab-h" className={`mt-5 ${H2}`}>Train on the tools production SOCs pay for</h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-dark">
              Most courses stop at open-source simulators. Three times during the program, you work inside a real industry security lab on patented, licensed enterprise platforms, guided by the practitioners who run them.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {labBlocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <article className="h-full rounded-[22px] bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10">
                  <span className="font-mono text-xs text-sky">{b.when}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{b.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <ul aria-label="Platforms used" className="mt-8 flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t} className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-white/75 ring-1 ring-inset ring-white/10">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trainers ─────────────────────────────────────────── */}
      <section aria-labelledby="trainers-h" className="bg-paper section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Your trainers</Eyebrow>
            <h2 id="trainers-h" className={`mt-5 ${H2}`}>Taught by practitioners with 8 to 10+ years in the field</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              Every trainer has spent eight to ten years or more doing this work in industry, across network security, SOC operations, cloud security and digital forensics. They teach the way they work, and they stay with the cohort from the first lab to the capstone.
            </p>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:self-center">
            {trainerFacts.map((t, i) => (
              <li key={t.big}>
                <Reveal delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-[22px] bg-white p-5 ring-1 ring-inset ring-line">
                    <b className="font-display text-2xl font-semibold text-gradient">{t.big}</b>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Certifications ─────────────────────────────────────────── */}
      <section aria-labelledby="cert-h" className="bg-surface section-y">
        <div className="container-x">
          <Reveal>
            <Eyebrow>OEM certification tracks</Eyebrow>
            <h2 id="cert-h" className={`mt-5 ${H2}`}>Six certifications from four vendors</h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">Each track is timed to the lab that teaches it, so you sit the exam right after using the product.</p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <div className="flex h-full flex-col rounded-[22px] bg-white p-5 ring-1 ring-inset ring-line">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo">{c.oem}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{c.text}</p>
                    <span className="mt-4 font-mono text-xs text-muted">{c.when}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Fee ─────────────────────────────────────────── */}
      <section aria-labelledby="fee-h" className="bg-paper section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Fee</Eyebrow>
            <h2 id="fee-h" className={`mt-5 ${H2}`}>One fee. GST included. No add-ons.</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              {offerLive
                ? "The Navratri offer takes 25% off the full program fee for anyone who reserves a seat before Vijayadashami."
                : "The fee covers the full six-month program."}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="overflow-x-auto rounded-[22px] bg-white ring-1 ring-inset ring-line">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th className="px-5 py-3 font-medium">Component</th>
                    <th className="px-5 py-3 font-medium">List</th>
                    {offerLive && <th className="px-5 py-3 font-medium">Navratri offer</th>}
                  </tr>
                </thead>
                <tbody>
                  {feeRows.map((r) => (
                    <tr key={r.label} className="border-b border-line">
                      <td className="px-5 py-3">{r.label}</td>
                      <td className="px-5 py-3">{r.list}</td>
                      {offerLive && <td className="px-5 py-3">{r.offer}</td>}
                    </tr>
                  ))}
                  <tr className="border-b border-line font-semibold">
                    <td className="px-5 py-3">You pay</td>
                    <td className="px-5 py-3">{rupees(LIST_PRICE_PAISE)}</td>
                    {offerLive && <td className="px-5 py-3">{rupees(OFFER_PRICE_PAISE)}</td>}
                  </tr>
                  {offerLive && (
                    <tr>
                      <td className="px-5 py-3">You save (25%)</td>
                      <td className="px-5 py-3">—</td>
                      <td className="px-5 py-3 text-emerald-700">{rupees(LIST_PRICE_PAISE - OFFER_PRICE_PAISE)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-5 space-y-2 text-sm text-muted">
              <p>Includes 90 contact hours, all lab access, industry lab blocks and the Drisyon completion certificate.</p>
              <p>GST tax invoice issued in your name or your employer&apos;s, for reimbursement.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Enrol / enquire ─────────────────────────────────────────── */}
      <section id="enrol" aria-labelledby="enrol-h" className="on-dark relative isolate scroll-mt-20 overflow-hidden bg-ink text-white section-y">
        <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 h-[480px] w-[480px] rounded-full opacity-25 blur-[140px]" style={{ background: "var(--gradient-brand)" }} />
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow dark>Reserve your seat</Eyebrow>
              <h2 id="enrol-h" className={`mt-5 ${H2}`}>
                {payments ? "Pay online. Your seat is held at once." : "Talk to us and reserve your seat."}
              </h2>
            </Reveal>
            <ol className="mt-8 space-y-5">
              {(payments
                ? [
                    ["Pay and reserve", "Choose seats and pay securely through Razorpay. The offer price is locked the moment you pay."],
                    ["20-minute technical screen", "We call you within two working days to talk through your cloud and Linux experience. If the cohort is not the right fit, we refund you in full."],
                    ["Onboarding kit", "Calendar, lab access and OEM portal sign-up reach you by 31 October."],
                  ]
                : [
                    ["Send an enquiry", "Tell us a little about your role. The course team replies within one working day."],
                    ["20-minute technical screen", "A quick call about your cloud and Linux experience, so the cohort is the right fit."],
                    ["Reserve and onboard", "We confirm your seat and fee, then send the calendar, lab access and OEM portal sign-up by 31 October."],
                  ]
              ).map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <b className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm" style={{ background: "var(--gradient-brand)" }}>{i + 1}</b>
                  <span>
                    <span className="block font-medium">{t}</span>
                    <span className="text-sm text-white/60">{d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-[22px] bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10">
              <p className="eyebrow text-sky">Prefer to talk first?</p>
              <h3 className="mt-2 font-display text-lg font-semibold">Speak to the course team</h3>
              {phone ? (
                <>
                  <p className="mt-2 font-mono text-lg">{phone.display}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`tel:${phone.e164}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink">Call now</a>
                    <a
                      href={`https://wa.me/${phone.wa}?text=${encodeURIComponent("Hi, I'd like to know more about the Drisyon Cloud Security Cohort.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-5 py-2.5 text-sm font-medium ring-1 ring-inset ring-white/25"
                    >
                      WhatsApp
                    </a>
                  </div>
                  <p className="mt-3 text-xs text-white/50">Monday to Saturday, 10 am to 7 pm IST</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-white/65">
                  Email <a href={`mailto:${company.email}`} className="underline">{company.email}</a> and we&apos;ll call you back.
                </p>
              )}
            </div>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            {payments ? (
              <Checkout />
            ) : (
              <div className="rounded-[28px] bg-paper p-6 text-text sm:p-8 md:p-10">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">Enquire about Cloud Security Cohort 01</h3>
                <p className="mb-8 mt-2 text-sm text-muted">
                  Starts 1 November 2026 · {PROGRAM.cohortSize} seats · {nowPrice} incl. GST{offerLive ? " (Navratri offer)" : ""}
                </p>
                <ContactForm defaultInterest="Cloud Security Cohort" />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section aria-labelledby="faq-h" className="bg-surface section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="faq-h" className={`mt-5 ${H2}`}>Before you apply</h2>
          </Reveal>
          <div className="divide-y divide-line rounded-[22px] bg-white ring-1 ring-inset ring-line lg:col-span-8">
            {faq.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span aria-hidden="true" className="text-xl text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <p className="container-x mt-12 text-xs text-muted">
          <a href="/terms" className="underline">Terms</a> · <a href="/refund-policy" className="underline">Refund policy</a> ·{" "}
          <a href="/privacy" className="underline">Privacy</a> · <a href="/contact" className="underline">Contact</a>
        </p>
      </section>

      {/* Mobile action bar (the body padding keeps it from covering the footer) */}
      <style>{"@media (max-width: 767px) { body { padding-bottom: 72px; } }"}</style>
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        {phone && (
          <a href={`tel:${phone.e164}`} className="grid place-items-center rounded-full px-5 text-sm font-medium ring-1 ring-inset ring-line">Call</a>
        )}
        <a href="#enrol" className="flex-1 rounded-full py-3 text-center text-sm font-medium text-white" style={{ background: "var(--gradient-brand)" }}>
          {payments ? "Reserve seat" : "Enquire"} · {nowPrice}
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
