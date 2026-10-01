"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { processSteps } from "@/lib/content";
import { Eyebrow, Reveal, RevealLines } from "./ui";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(processSteps.length - 1, Math.floor(v * processSteps.length + 0.15)));
  });

  return (
    <section aria-labelledby="process-title" className="relative bg-paper section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>How DRISYON builds</Eyebrow>
            </Reveal>
            <RevealLines
              id="process-title"
              lines={["From idea to", <span key="s" className="text-gradient">intelligent system.</span>]}
              className="display mt-6 text-h2"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="max-w-sm text-[1.0625rem] leading-relaxed text-muted">
              A clear, practical path from understanding your process to a system that runs inside it.
            </p>
          </Reveal>
        </div>

        <ol ref={ref} className="relative mt-16 grid gap-10 pl-10 lg:mt-24 lg:grid-cols-5 lg:gap-6 lg:pl-0 lg:pt-14">
          {/* track: vertical on mobile, horizontal on desktop */}
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[7px] lg:h-px lg:w-auto" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top lg:hidden"
            style={{ scaleY: progress, background: "var(--gradient-brand)" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 top-[7px] hidden h-px origin-left lg:block"
            style={{ scaleX: progress, background: "var(--gradient-brand)" }}
          />

          {processSteps.map((s, i) => {
            const on = i <= reached;
            return (
              <li key={s.n} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute -left-10 top-1 h-[15px] w-[15px] rounded-full border-2 transition-all duration-500 lg:-top-14 lg:left-0 ${
                    on ? "scale-110 border-transparent shadow-[0_0_0_6px_rgb(74_58_240/0.12)]" : "border-line bg-paper"
                  }`}
                  style={on ? { background: "var(--gradient-brand)" } : undefined}
                />
                <p className={`font-mono text-sm transition-colors duration-500 ${on ? "text-indigo" : "text-muted/60"}`}>{s.n}</p>
                <h3
                  className={`mt-2 font-display text-[1.5rem] font-semibold uppercase tracking-[-0.03em] transition-colors duration-500 xl:text-[1.6rem] ${
                    on ? "text-text" : "text-text/35"
                  }`}
                >
                  {s.title}
                </h3>
                <p className={`mt-2 max-w-[16rem] leading-relaxed transition-colors duration-500 ${on ? "text-muted" : "text-muted/50"}`}>
                  {s.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
