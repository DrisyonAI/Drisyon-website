import { pillars } from "@/lib/content";
import { Eyebrow, Reveal } from "./ui";

const icons: Record<(typeof pillars)[number]["icon"], React.ReactNode> = {
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5a3 3 0 0 0-5.8-1A3 3 0 0 0 4 8.5a3 3 0 0 0 .6 5.4A3.5 3.5 0 0 0 8.5 19 3 3 0 0 0 12 20Z" />
      <path d="M12 5a3 3 0 0 1 5.8-1A3 3 0 0 1 20 8.5a3 3 0 0 1-.6 5.4A3.5 3.5 0 0 1 15.5 19 3 3 0 0 1 12 20Z" />
      <path d="M12 5v15M8 10h1.5M14.5 10H16M8.5 15H10M14 15h1.5" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  play: <path d="M7 4.5v15L19 12 7 4.5Z" />,
};

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-paper section-y">
      <div className="container-x">
        <Reveal>
          <Eyebrow>About DRISYON</Eyebrow>
          <h2 id="about-title" className="mt-5 font-display text-h2 font-semibold tracking-[-0.03em]">
            Why DRISYON?
          </h2>
          <p className="mt-6 max-w-3xl text-[1.0625rem] leading-relaxed text-muted md:text-lg">
            The name is inspired by the idea of{" "}
            <span className="text-gradient font-semibold">vision and perception</span>. DRISYON is a modern technology
            company focused on seeing beyond traditional processes and building intelligent systems that create real
            leverage.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:mt-16 lg:grid-cols-4 lg:gap-5">
          {pillars.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.06}>
                <div className="group flex flex-col items-center justify-center gap-5 rounded-[20px] bg-surface/60 px-4 py-10 ring-1 ring-inset ring-line transition-[background-color,box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgb(74_58_240/0.35)]">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-indigo ring-1 ring-inset ring-line transition-colors duration-500 group-hover:text-violet">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {icons[p.icon]}
                    </svg>
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text">{p.title}</h3>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
