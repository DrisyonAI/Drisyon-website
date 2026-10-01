import { HERO_COLS as COLS, HERO_STAGES } from "@/lib/content";
import { HeroField } from "./HeroField";
import { Button } from "./ui";

const d = (s: number) => ({ animationDelay: `${s}s` });

function StageLabels({ compact = false }: { compact?: boolean }) {
  return (
    <ol aria-label="How an intelligent system works" className="pointer-events-none absolute inset-x-0 bottom-0">
      {HERO_STAGES.map((s, i) => (
        <li
          key={s}
          className="fade-up absolute bottom-0 -translate-x-1/2 text-center"
          style={{ left: `${COLS[i] * 100}%`, ...d(0.9 + i * 0.08) }}
        >
          <span className={`block font-mono text-muted/70 ${compact ? "text-[0.6rem]" : "text-[0.68rem]"}`}>0{i + 1}</span>
          <span
            className={`block ${i === 1 ? "w-[5.5rem] leading-tight" : "whitespace-nowrap"} font-medium tracking-[-0.01em] ${compact ? "text-[0.7rem]" : "text-[0.82rem]"} ${
              i === 1 ? "text-indigo" : "text-text/80"
            }`}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-[84px]">
      {/* quiet technical texture, faded at the edges */}
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_45%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[20%] top-[10%] -z-10 h-[70vh] w-[70vw] rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "var(--gradient-brand)" }}
      />

      <div className="container-x relative grid min-h-[calc(100svh-84px)] grid-cols-1 content-center gap-10 pb-12 pt-10 lg:grid-cols-12 lg:pb-20">
        <div className="relative z-10 lg:col-span-6">
          <p className="fade-up eyebrow mb-7 flex items-center gap-3 text-indigo" style={d(0.2)}>
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo" />
            </span>
            Super Intelligence Automation &amp; Intelligent Systems
          </p>

          <h1 id="hero-title" className="display text-hero text-text">
            {["See beyond.", "Automate", "everything."].map((line, i) => (
              <span key={line} className="-mb-[0.06em] block overflow-hidden pb-[0.06em]">
                <span className={`rise-line block ${i === 2 ? "text-gradient" : ""}`} style={d(0.15 + i * 0.1)}>
                  {line}
                  {i < 2 && " "}
                </span>
              </span>
            ))}
          </h1>

          <p className="fade-up mt-8 max-w-[30rem] text-[1.05rem] leading-relaxed text-muted md:text-[1.0625rem]" style={d(0.5)}>
            We build automations and intelligent systems powered by Super Intelligence that help businesses work smarter, move faster, and
            scale.
          </p>

          <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row" style={d(0.65)}>
            <Button href="#solutions" arrow>
              Explore Super Intelligence Solutions
            </Button>
            <Button href="#contact" variant="secondary">
              Talk to Us
            </Button>
          </div>
        </div>

        {/* Mobile / tablet: a lighter version of the system */}
        <div className="fade-in relative h-[300px] sm:h-[360px] lg:hidden" style={d(0.5)}>
          <div className="absolute inset-x-0 bottom-10 top-0">
            <HeroField compact />
          </div>
          <StageLabels compact />
        </div>
      </div>

      {/* Desktop: the interactive system fills the right side of the hero */}
      <div className="fade-in absolute bottom-16 right-0 top-[84px] hidden w-[56%] lg:block" style={d(0.4)}>
        <div className="absolute inset-0 bottom-12 [mask-image:linear-gradient(to_right,transparent,black_12%)]">
          <HeroField />
        </div>
        <StageLabels />
      </div>

      <a
        href="#solutions"
        className="fade-in absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted lg:flex"
        style={d(1.4)}
      >
        <span className="relative block h-9 w-px overflow-hidden bg-line">
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-indigo" />
        </span>
        Scroll
      </a>
    </section>
  );
}
