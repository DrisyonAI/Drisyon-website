"use client";

import { motion, useReducedMotion } from "motion/react";
import { STAGE_NAMES } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

// Five points along a gentle wave: trigger → reason → workflow → action → outcome
const PTS = [
  [56, 168],
  [188, 92],
  [320, 160],
  [452, 92],
  [584, 160],
] as const;

function wavePath() {
  let d = `M ${PTS[0][0]} ${PTS[0][1]}`;
  for (let i = 1; i < PTS.length; i++) {
    const [x0, y0] = PTS[i - 1];
    const [x1, y1] = PTS[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}
const D = wavePath();

/**
 * Animated workflow for one solution. `id` changes trigger a fresh draw:
 * the path traces itself, each stage lights up in order, then a signal keeps flowing.
 */
export function SolutionFlow({ id, flow, dark = true }: { id: string; flow: readonly string[]; dark?: boolean }) {
  const reduce = useReducedMotion();
  const gid = `flow-grad-${dark ? "d" : "l"}`;
  const nodeFill = dark ? "#0a1030" : "#fafafc";
  const label = dark ? "fill-white" : "fill-text";
  const sub = dark ? "fill-white/45" : "fill-muted";
  const base = dark ? "rgb(255 255 255 / 0.1)" : "rgb(11 16 36 / 0.1)";

  return (
    <>
      {/* Horizontal diagram (tablet and up) */}
      <svg key={id} viewBox="0 0 640 250" className="hidden w-full md:block" role="img" aria-label={`Workflow: ${flow.join(" then ")}`}>
        <defs>
          <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0b63ff" />
            <stop offset="0.5" stopColor="#4a3af0" />
            <stop offset="1" stopColor="#a12be2" />
          </linearGradient>
          <filter id={`${gid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <path d={D} fill="none" stroke={base} strokeWidth="1.5" />
        <motion.path
          d={D}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease }}
        />
        {!reduce && (
          <path d={D} fill="none" stroke={dark ? "#ffffff" : "#4a3af0"} strokeOpacity="0.55" strokeWidth="2" className="flow-dash" />
        )}

        {/* travelling signal */}
        {!reduce && (
          <motion.circle
            r="5"
            fill={dark ? "#fff" : "#4a3af0"}
            style={{ offsetPath: `path("${D}")`, filter: dark ? "drop-shadow(0 0 6px #9d8cff)" : undefined }}
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, delay: 1.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
          />
        )}

        {PTS.map(([x, y], i) => {
          const core = i === 1;
          const above = y < 130;
          return (
            <motion.g
              key={i}
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : 0.15 + i * 0.22, duration: 0.6, ease }}
              style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
            >
              {core && <circle cx={x} cy={y} r="26" fill={`url(#${gid})`} opacity="0.5" filter={`url(#${gid}-glow)`} />}
              <circle
                cx={x}
                cy={y}
                r={core ? 17 : 9}
                fill={core ? `url(#${gid})` : nodeFill}
                stroke={core ? "none" : `url(#${gid})`}
                strokeWidth="2"
              />
              {core && (
                <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-[11px] font-semibold">
                  SI
                </text>
              )}
              <text
                x={x}
                y={above ? y - (core ? 38 : 26) : y + 40}
                textAnchor="middle"
                className={`${sub} text-[10px] uppercase tracking-[0.16em]`}
              >
                {STAGE_NAMES[i]}
              </text>
              <text
                x={x}
                y={above ? y - (core ? 38 : 26) - 17 : y + 58}
                textAnchor="middle"
                className={`${label} text-[13.5px] font-medium`}
              >
                {flow[i]}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Vertical flow (mobile) */}
      <ol key={`${id}-m`} className="relative space-y-5 md:hidden" aria-label="Workflow">
        <span
          aria-hidden="true"
          className={`absolute bottom-3 left-[11px] top-3 w-px ${dark ? "bg-white/10" : "bg-line"}`}
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-[11px] top-3 w-px origin-top"
          style={{ background: "var(--gradient-brand)", bottom: 12 }}
          initial={{ scaleY: reduce ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        {flow.map((step, i) => (
          <motion.li
            key={step}
            className="relative flex items-center gap-4 pl-0"
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduce ? 0 : 0.1 + i * 0.15, duration: 0.5, ease }}
          >
            <span
              className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-semibold ${
                i === 1 ? "text-white" : dark ? "bg-navy ring-1 ring-sky/50" : "bg-paper ring-1 ring-indigo/40"
              }`}
              style={i === 1 ? { background: "var(--gradient-brand)" } : undefined}
            >
              {i === 1 ? "SI" : ""}
            </span>
            <span className="flex flex-col">
              <span className={`text-[0.65rem] uppercase tracking-[0.16em] ${dark ? "text-white/45" : "text-muted"}`}>
                {STAGE_NAMES[i]}
              </span>
              <span className={`text-[0.95rem] font-medium ${dark ? "text-white" : "text-text"}`}>{step}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </>
  );
}
