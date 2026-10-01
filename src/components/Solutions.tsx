"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { solutions } from "@/lib/content";
import { SolutionFlow } from "./SolutionFlow";
import { Arrow, Eyebrow, Reveal, RevealLines } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 7000;

export function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="on-dark relative isolate overflow-hidden bg-ink text-white section-y">
      <div aria-hidden="true" className="grid-lines-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[140px]"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow dark>Super Intelligence Solutions</Eyebrow>
            </Reveal>
            <RevealLines
              id="solutions-title"
              lines={[
                "We don't just use Super Intelligence.",
                <>
                  We <span className="text-gradient-dark">build</span> with it.
                </>,
              ]}
              className="display mt-6 text-h2"
            />
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted-dark">
              Every business has repetitive processes. We turn those processes into intelligent systems.
            </p>
          </Reveal>
        </div>

        <SolutionExplorer />
      </div>
    </section>
  );
}

function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const autoplay = inView && !interacted && !reduce;
  const s = solutions[active];

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % solutions.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplay, active]);

  const select = useCallback((i: number, focus = false) => {
    setInteracted(true);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = solutions.length;
    if (["ArrowDown", "ArrowRight"].includes(e.key)) select((active + 1) % n, true);
    else if (["ArrowUp", "ArrowLeft"].includes(e.key)) select((active - 1 + n) % n, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(n - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-12">
      {/* Solution index */}
      <div
        role="tablist"
        aria-label="DRISYON Super Intelligence solutions"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {solutions.map((sol, i) => {
          const on = i === active;
          return (
            <button
              key={sol.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`sol-tab-${sol.slug}`}
              aria-selected={on}
              aria-controls="sol-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={`group relative shrink-0 snap-start text-left transition-colors duration-500 lg:border-t lg:border-white/10 lg:py-6 lg:last:border-b ${
                on ? "text-white" : "text-white/45 hover:text-white/80"
              } rounded-full px-4 py-2.5 ring-1 ring-inset lg:rounded-none lg:px-0 lg:ring-0 ${
                on ? "bg-white/10 ring-white/25 lg:bg-transparent" : "ring-white/10"
              }`}
            >
              <span className="flex items-baseline gap-5">
                <span className="hidden font-mono text-xs text-white/35 lg:inline">{sol.index}</span>
                <span className="font-display text-[0.95rem] font-medium tracking-[-0.02em] lg:text-[1.35rem]">{sol.title}</span>
              </span>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.span
                    className="hidden overflow-hidden pl-[2.6rem] lg:block"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <span className="block pt-2 text-[0.95rem] text-muted-dark">{sol.short}</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {/* autoplay progress */}
              {on && (
                <span aria-hidden="true" className="absolute -top-px left-0 hidden h-px w-full overflow-hidden lg:block">
                  <motion.span
                    key={`${active}-${autoplay}`}
                    className="block h-full origin-left"
                    style={{ background: "var(--gradient-brand)" }}
                    initial={{ scaleX: autoplay ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: autoplay ? AUTOPLAY_MS / 1000 : 0.4, ease: "linear" }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live system panel */}
      <div
        id="sol-panel"
        role="tabpanel"
        aria-labelledby={`sol-tab-${s.slug}`}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 ring-1 ring-inset ring-white/10 sm:p-8 lg:col-span-7 lg:p-10"
      >
        <div className="flex items-center justify-between text-xs text-white/50">
          <span className="font-mono">
            SOLUTION {s.index} / 0{solutions.length}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_10px_#7fb2ff]" />
            Intelligent workflow
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease }}
          >
            <h3 className="mt-6 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2rem]">
              {s.title}
            </h3>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-muted-dark">{s.description}</p>

            <div className="my-8 md:-mx-2 md:my-6">
              <SolutionFlow id={s.slug} flow={s.flow} />
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="eyebrow text-white/45">Where it fits</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.useCases.map((u, i) => (
                  <motion.li
                    key={u}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                    className="rounded-full bg-white/[0.06] px-3.5 py-1.5 text-sm text-white/80 ring-1 ring-inset ring-white/10"
                  >
                    {u}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={`/solutions/${s.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
                >
                  Explore {s.title}
                  <Arrow className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="#contact" className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
                  Discuss a use case
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
