"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { industries, type Industry } from "@/lib/content";
import { Eyebrow, Reveal, RevealLines } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const VH_PER_INDUSTRY = 42;

/**
 * Scroll-driven industry explorer.
 * Desktop: the panel stays pinned while scrolling advances through each industry and its sample use cases.
 * Mobile: each industry is its own block in the normal scroll flow.
 */
export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="on-dark relative isolate bg-ink text-white">
      <div aria-hidden="true" className="grid-lines-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />
      <div className="container-x pt-20 md:pt-26 xl:pt-32">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow dark>Industries</Eyebrow>
            </Reveal>
            <RevealLines
              id="industries-title"
              lines={["Intelligence where", <span key="w" className="text-gradient-dark">work happens.</span>]}
              className="display mt-6 text-h2"
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted-dark">
              Repetitive processes exist in every sector. Scroll through the areas where DRISYON can design and build
              intelligent systems.
            </p>
          </Reveal>
        </div>
      </div>

      <DesktopExplorer />
      <MobileList />

      <div className="container-x pb-20 md:pb-26">
        <p className="border-t border-white/10 pt-5 text-xs text-white/40">
          Sample use cases are illustrative opportunities — not a list of clients or completed implementations.
        </p>
      </div>
    </section>
  );
}

function DesktopExplorer() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const n = industries.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  // Jump to an industry: scroll to the middle of its slice of the track.
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * travel, behavior: "smooth" });
  };

  const ind = industries[active];

  return (
    <div ref={track} className="relative hidden lg:block" style={{ height: `${n * VH_PER_INDUSTRY + 60}vh` }}>
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center">
        <div className="container-x grid grid-cols-12 gap-10">
          {/* Index */}
          <nav aria-label="Industries" className="col-span-4 xl:col-span-3">
            <div className="relative pl-5">
              <span aria-hidden="true" className="absolute bottom-1 left-0 top-1 w-px bg-white/10" />
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-1 w-px origin-top"
                style={{ scaleY: scrollYProgress, bottom: 4, background: "var(--gradient-brand)" }}
              />
              <ul className="space-y-1">
                {industries.map((it, i) => {
                  const on = i === active;
                  return (
                    <li key={it.name}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={on ? "true" : undefined}
                        className={`flex w-full items-center gap-3 py-1.5 text-left text-[0.95rem] transition-colors duration-300 ${
                          on ? "text-white" : "text-white/35 hover:text-white/70"
                        }`}
                      >
                        <span className="w-6 font-mono text-[0.7rem] text-white/30">{String(i + 1).padStart(2, "0")}</span>
                        <span className={on ? "font-medium" : ""}>{it.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Active industry */}
          <div className="col-span-8 xl:col-span-9" aria-live="polite">
            {/* Re-keyed on change: always renders the current industry, even during fast scrolling */}
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
            >
              <IndustryDetail ind={ind} index={active} total={n} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustryDetail({ ind, index, total }: { ind: Industry; index: number; total: number }) {
  return (
    <div>
      <p className="font-mono text-xs text-white/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h3 className="mt-3 font-display text-h3 font-semibold tracking-[-0.03em]">
        <span className="text-gradient-dark">{ind.name}</span>
      </h3>
      <p className="mt-3 max-w-xl text-[1.0625rem] text-muted-dark">{ind.summary}</p>
      <p className="eyebrow mt-10 text-white/45">Sample use cases</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {ind.useCases.map((u, i) => (
          <motion.li
            key={u.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease }}
            className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-inset ring-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.7rem] text-sky/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium text-white">{u.title}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{u.text}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function MobileList() {
  return (
    <ol className="container-x mt-12 space-y-14 pb-14 lg:hidden">
      {industries.map((ind, i) => (
        <li key={ind.name}>
          <Reveal>
            <IndustryDetail ind={ind} index={i} total={industries.length} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
