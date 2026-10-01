import type { Metadata } from "next";
import { Button, Eyebrow, Reveal, RevealLines } from "@/components/ui";
import { WorkCase } from "@/components/WorkCase";
import { works } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Solutions DRISYON has built — SI agents, automations and intelligent systems designed for real workflows.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Work | DRISYON", url: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section aria-labelledby="work-title" className="relative isolate overflow-hidden pb-6 pt-[130px] md:pt-[160px]">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
        <div className="container-x">
          <Reveal>
            <Eyebrow>Our work</Eyebrow>
          </Reveal>
          <RevealLines
            as="h1"
            id="work-title"
            lines={["Built for the", <span key="r" className="text-gradient">real world.</span>]}
            className="display mt-6 text-hero"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
              Solutions DRISYON has built — intelligent systems designed around real problems and real workflows.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Projects" className="bg-paper pb-24 pt-10 md:pb-32">
        <div className="container-x space-y-20 md:space-y-28">
          {works.map((w, i) => (
            <WorkCase key={w.slug} work={w} index={i} />
          ))}
        </div>

        <div className="container-x mt-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-ink p-8 text-white md:flex-row md:items-center md:p-12">
            <div>
              <p className="font-display text-h3 font-semibold tracking-[-0.03em]">Have a process worth automating?</p>
              <p className="mt-2 text-white/60">Let&apos;s turn repetitive work into an intelligent system.</p>
            </div>
            <Button href="/#contact" variant="light" arrow>
              Talk to Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
