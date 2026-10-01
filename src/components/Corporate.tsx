import { corporateTopics } from "@/lib/content";
import { Button, Eyebrow, Reveal } from "./ui";

/** Secondary capability — compact, sits below the solutions story. */
export function Corporate() {
  return (
    <section id="corporate" aria-labelledby="corporate-title" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <Eyebrow>Corporate Super Intelligence Enablement</Eyebrow>
            <h2 id="corporate-title" className="display mt-5 text-h2">
              Make your team ready for <span className="text-gradient">Super Intelligence.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-muted">
              Super Intelligence adoption isn&apos;t just about buying tools. It&apos;s about teaching teams how to apply intelligence to
              real workflows.
            </p>
            <div className="mt-10">
              <Button href="/#contact" data-interest="Corporate Training" arrow>
                Discuss Corporate Training
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6">
            <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
              {corporateTopics.map((t, i) => (
                <li
                  key={t}
                  className="group flex items-center gap-4 border-b border-line py-5 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
                >
                  <span className="font-mono text-xs text-muted/70">0{i + 1}</span>
                  <span className="text-[1.05rem] text-text/85 transition-transform duration-500 ease-out-soft group-hover:translate-x-1">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
