"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-dark" | "light";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-ink hover:bg-navy-2 shadow-[0_10px_30px_-12px_rgb(74_58_240/0.55)] [background-image:var(--gradient-brand)] bg-[length:200%_100%] bg-left hover:bg-right",
  secondary: "text-text bg-transparent ring-1 ring-inset ring-line hover:ring-text/40 hover:bg-white",
  "ghost-dark": "text-white bg-white/5 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:ring-white/30",
  light: "text-ink bg-white hover:bg-paper shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)]",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = `group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background-position,background-color,box-shadow,color] duration-500 ease-out-soft ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />}
    </>
  );
  const external = /^(https?:|mailto:)/.test(href);
  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Fade-up reveal on first entry into the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Headline where each line rises from a mask. */
export function RevealLines({
  lines,
  className = "",
  as: Tag = "h2",
  lineClassName = "",
  id,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  lineClassName?: string;
  id?: string;
}) {
  // The in-view trigger lives on the heading itself: the masked lines start fully clipped,
  // so observing them directly would never fire.
  const M = motion[Tag];
  return (
    <M id={id} className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
            transition={{ duration: 1, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
            {/* keeps words apart for assistive tech and copy/paste */}
            {i < lines.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

export function Eyebrow({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${dark ? "text-sky" : "text-indigo"} ${className}`}>
      <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-sky/60" : "bg-indigo/50"}`} />
      {children}
    </p>
  );
}

/** Small, clearly visible marker for content that is still to be supplied. */
export function PlaceholderTag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] ${
        dark ? "border-white/30 text-white/60" : "border-text/25 text-muted"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
