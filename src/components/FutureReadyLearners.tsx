import Link from "next/link";
import { courses } from "@/lib/content";
import { Arrow, Button, Eyebrow, Reveal } from "./ui";

const audiences = ["Undergraduate students", "Graduates", "Aspiring builders"];

/** Intentionally compact — a supporting capability, not the centre of the site. */
export function FutureReadyLearners() {
  return (
    <section id="learners" aria-labelledby="learners-title" className="relative bg-paper py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Future-Ready Learners</Eyebrow>
            <h2 id="learners-title" className="display mt-5 text-h2">
              Builders of <span className="text-gradient">tomorrow.</span>
            </h2>
            <p className="mt-4 font-display text-lg text-text/80">Learn Super Intelligence by building with it.</p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-muted">
              Practical Super Intelligence and automation learning for undergraduate students, graduates and aspiring builders — focused on
              SI agents, automation workflows, intelligent systems and real-world projects.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {audiences.map((a) => (
                <li key={a} className="flex items-center gap-2.5 text-sm text-text/80">
                  <span aria-hidden="true" className="h-px w-4 bg-indigo/60" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Featured cohort: now enrolling */}
        <Reveal className="mt-12 md:mt-14">
          <Link
            href="/cloud-security"
            className="on-dark group relative flex flex-col gap-6 overflow-hidden rounded-[26px] bg-ink p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between"
          >
            <span aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
            <span className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky" aria-hidden="true" />
                Now enrolling · Starts 1 Nov 2026
              </span>
              <span className="mt-4 block font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.9rem]">
                Cloud Security Cohort 01
              </span>
              <span className="mt-2 block max-w-xl text-sm leading-relaxed text-white/65">
                6 months · 90 hours · 10 hands-on labs · 6 OEM certification tracks · 30 hours in a live industry lab. For DevOps, SRE and cloud engineers. 30 seats.
              </span>
            </span>
            <span className="relative inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 group-hover:translate-x-0.5 md:self-center">
              View program
              <Arrow />
            </span>
          </Link>
        </Reveal>

        {/* Courses */}
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {courses.map((c, i) => (
            <li key={c.code}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white p-6 ring-1 ring-inset ring-line transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(74_58_240/0.45)] md:p-7">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-out-soft group-hover:scale-x-100"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted/70">Course {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em]">
                    <span className="text-gradient">{c.code}</span>
                  </h3>
                  {c.title !== c.code && <p className="mt-2 text-sm font-medium text-text/75">{c.title}</p>}
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Button href="/#contact" data-interest="Student Training" variant="secondary" arrow>
            Explore Learning
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
