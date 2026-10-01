import { courses } from "@/lib/content";
import { Button, Eyebrow, Reveal } from "./ui";

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

        {/* Courses */}
        <ul className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
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
