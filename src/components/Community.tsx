import { communityFormats } from "@/lib/content";
import { communityUrl } from "@/lib/site";
import { Button, Eyebrow, PlaceholderTag, Reveal } from "./ui";

export function Community() {
  return (
    <section id="community" aria-labelledby="community-title" className="relative bg-paper py-24 md:py-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[32px] bg-white px-6 py-14 ring-1 ring-line sm:px-10 md:px-16 md:py-20">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="relative grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow>Community</Eyebrow>
              <h2 id="community-title" className="display mt-5 text-h2">
                Build <span className="text-gradient">with us.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-muted">
                DRISYON is building a community of students, professionals, founders, developers and technology
                enthusiasts exploring what Super Intelligence and automation can actually do.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {communityUrl ? (
                  <Button href={communityUrl} target="_blank" rel="noopener noreferrer" arrow>
                    Join the DRISYON Community
                  </Button>
                ) : (
                  <>
                    <Button href="/#contact" data-interest="Other" arrow>
                      Join the DRISYON Community
                    </Button>
                    <PlaceholderTag>Community link coming soon</PlaceholderTag>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-6 lg:pl-8">
              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-3">
                {communityFormats.map((f, i) => (
                  <li
                    key={f}
                    className="group flex aspect-[4/3] flex-col justify-between bg-white p-5 transition-colors duration-500 hover:bg-surface"
                  >
                    <span className="font-mono text-xs text-muted/70">0{i + 1}</span>
                    <span className="font-display text-[1.0625rem] font-medium tracking-[-0.02em] text-text transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
