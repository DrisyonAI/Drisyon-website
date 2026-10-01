"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Eyebrow, Reveal, RevealLines } from "./ui";

const statement =
  "The next generation of businesses won't simply use Super Intelligence tools. They will build *intelligent* *systems* around them. DRISYON brings together Super Intelligence, automation, practical learning and business implementation to turn *repetitive* *processes* into *systems* *that* *work* *for* *you.*";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const emphasis = word.startsWith("*");
  const text = word.replace(/\*/g, "");
  return (
    <motion.span style={{ opacity }} className={emphasis ? "text-gradient-dark" : undefined}>
      {text}{" "}
    </motion.span>
  );
}

/** Flowing streamlines — the visual thread of "process → intelligence → action". */
function Streams() {
  const lines = [0, 1, 2, 3, 4, 5];
  return (
    <svg aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
      <defs>
        <linearGradient id="why-g" x1="0" x2="1">
          <stop offset="0" stopColor="#0b63ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#7fb2ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c48bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lines.map((i) => (
        <path
          key={i}
          d={`M -50 ${560 + i * 26} C 360 ${420 + i * 34}, 760 ${720 - i * 22}, 1490 ${380 + i * 30}`}
          fill="none"
          stroke="url(#why-g)"
          strokeWidth="1"
          className="flow-dash"
          style={{ animationDuration: `${3 + i * 0.6}s` }}
        />
      ))}
    </svg>
  );
}

export function WhyDrisyon() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");

  return (
    <section
      aria-labelledby="why-title"
      className="on-dark relative isolate overflow-hidden text-white section-y"
      style={{ background: "linear-gradient(160deg, #070b22 0%, #121a5c 52%, #2c1266 100%)" }}
    >
      <Streams />
      <div className="container-x">
        <Reveal>
          <Eyebrow dark>Our belief</Eyebrow>
        </Reveal>
        <RevealLines
          id="why-title"
          lines={[
            "Super Intelligence isn't just something to use.",
            <>
              It&apos;s something to <span className="text-gradient-dark">build with.</span>
            </>,
          ]}
          className="display mt-6 text-h2"
        />
        <p
          ref={ref}
          className="mt-14 max-w-4xl font-display text-lead font-normal tracking-[-0.02em] md:ml-auto md:mt-20"
        >
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]} />
          ))}
        </p>
      </div>
    </section>
  );
}
