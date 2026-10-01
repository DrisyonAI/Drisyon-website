"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Work } from "@/lib/content";
import { Button, PlaceholderTag, Reveal } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * One project on the Work page. Content comes from `works` in src/lib/content.ts.
 * Missing details and screenshots render as clearly marked placeholders.
 */
export function WorkCase({ work, index }: { work: Work; index: number }) {
  const [step, setStep] = useState(0);

  return (
    <article id={work.slug} aria-labelledby={`${work.slug}-title`} className="scroll-mt-28 border-t border-line pt-12 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Story */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {String(index + 1).padStart(2, "0")} · {work.label}
              </p>
              <h2 id={`${work.slug}-title`} className="mt-3 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.04em] sm:text-[2.75rem]">
                {work.name}
              </h2>
              <p className="mt-3 font-display text-lg text-text/80">{work.domain}</p>
              <p className="mt-5 max-w-md leading-relaxed text-muted">{work.summary}</p>
              {work.status && (
                <div className="mt-6">
                  <PlaceholderTag>{work.status}</PlaceholderTag>
                </div>
              )}
            </Reveal>

            {/* Problem → Intelligence → Agent → Workflow → Result */}
            <Reveal delay={0.1}>
              <ol className="mt-10 border-l border-line" aria-label={`${work.name} case study structure`}>
                {work.flow.map((f, i) => {
                  const on = step === i;
                  return (
                    <li key={f.key} className="relative">
                      <button
                        type="button"
                        onClick={() => setStep(i)}
                        onMouseEnter={() => setStep(i)}
                        aria-expanded={on}
                        className="group flex w-full items-start gap-4 py-3.5 pl-6 text-left"
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[5px] top-[1.3rem] h-[9px] w-[9px] rounded-full border transition-all duration-500 ${
                            on ? "scale-125 border-transparent" : "border-text/30 bg-paper"
                          }`}
                          style={on ? { background: "var(--gradient-brand)" } : undefined}
                        />
                        <span className="font-mono text-xs text-muted/80 pt-1.5">0{i + 1}</span>
                        <span className="flex-1">
                          <span
                            className={`block font-display text-lg tracking-[-0.02em] transition-colors duration-300 ${
                              on ? "text-text" : "text-text/45 group-hover:text-text/75"
                            }`}
                          >
                            {f.key}
                          </span>
                          <AnimatePresence initial={false}>
                            {on && (
                              <motion.span
                                className="block overflow-hidden"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease }}
                              >
                                <span className="block pt-1.5 text-sm leading-relaxed text-muted">{f.text}</span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <Button href="/#contact" variant="secondary" arrow>
                Ask about {work.name}
              </Button>
            </Reveal>
          </div>

          {/* Visual: system schematic + screenshot placeholder */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[28px] bg-ink p-3 shadow-[0_40px_80px_-40px_rgb(10_16_48/0.55)] ring-1 ring-ink/5">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[0.7rem] lowercase text-white/40">
                  {work.name} · {work.domain}
                </span>
              </div>
              <div className="grid-lines-dark relative aspect-[4/3] overflow-hidden rounded-[20px] bg-navy sm:aspect-[16/11]">
                {work.screenshot ? (
                  <Image
                    src={work.screenshot}
                    alt={`${work.name} — ${work.domain} screenshot`}
                    fill
                    sizes="(min-width: 1024px) 680px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <AgentSchematic step={step} />
                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-white/20 bg-ink/70 px-4 py-3 backdrop-blur">
                      <span className="text-xs text-white/60">Product screenshots will appear here once supplied.</span>
                      <PlaceholderTag dark>Placeholder</PlaceholderTag>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>
    </article>
  );
}

/** Abstract schematic — emphasises the stage selected in the story list. Not a product screenshot. */
function AgentSchematic({ step }: { step: number }) {
  const cols = [70, 190, 300, 410, 530];
  const nodes = [
    { x: cols[0], y: 150, l: "Problem" },
    { x: cols[1], y: 150, l: "Intelligence" },
    { x: cols[2], y: 80, l: "Agent" },
    { x: cols[2], y: 150, l: "Agent" },
    { x: cols[2], y: 220, l: "Agent" },
    { x: cols[3], y: 150, l: "Workflow" },
    { x: cols[4], y: 150, l: "Result" },
  ];
  const stageOf = [0, 1, 2, 2, 2, 3, 4];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 6],
  ];
  const path = (a: number, b: number) => {
    const A = nodes[a], B = nodes[b];
    const mx = (A.x + B.x) / 2;
    return `M ${A.x} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${B.x} ${B.y}`;
  };

  return (
    <svg viewBox="0 0 600 300" className="absolute inset-0 h-[80%] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="nip-g" x1="0" x2="1">
          <stop offset="0" stopColor="#0b63ff" />
          <stop offset="0.5" stopColor="#4a3af0" />
          <stop offset="1" stopColor="#a12be2" />
        </linearGradient>
      </defs>
      {links.map(([a, b], i) => {
        const lit = stageOf[b] <= step;
        return (
          <g key={i}>
            <path d={path(a, b)} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1.2" />
            <motion.path
              d={path(a, b)}
              fill="none"
              stroke="url(#nip-g)"
              strokeWidth="1.8"
              initial={false}
              animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const on = stageOf[i] === step;
        const lit = stageOf[i] <= step;
        const showLabel = stageOf[i] !== 2;
        return (
          <g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              initial={false}
              animate={{ r: on ? 22 : 16, opacity: on ? 0.35 : 0 }}
              fill="url(#nip-g)"
              transition={{ duration: 0.5 }}
            />
            <circle cx={n.x} cy={n.y} r={stageOf[i] === 1 ? 11 : 7} fill={lit ? "url(#nip-g)" : "#0a1030"} stroke={lit ? "none" : "rgb(255 255 255 / 0.3)"} />
            {showLabel && (
              <text x={n.x} y={n.y + 40} textAnchor="middle" className={`text-[11px] ${on ? "fill-white" : "fill-white/40"}`}>
                {n.l}
              </text>
            )}
          </g>
        );
      })}
      <text x={cols[2]} y={262} textAnchor="middle" className={`text-[11px] ${step === 2 ? "fill-white" : "fill-white/40"}`}>
        Agents
      </text>
    </svg>
  );
}
