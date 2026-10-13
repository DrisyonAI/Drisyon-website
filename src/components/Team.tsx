import Image from "next/image";
import { founders, team, type TeamMember } from "@/lib/content";
import { Eyebrow, PlaceholderTag, Reveal } from "./ui";

/** The people behind DRISYON: co-founders first, then the team. */
export function Team() {
  const people: TeamMember[] = [...founders.map(({ name, role, initials, photo }) => ({ name, role, initials, photo })), ...team];

  return (
    <section id="team" aria-labelledby="team-title" className="relative bg-surface py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Our team</Eyebrow>
            <h2 id="team-title" className="display mt-5 text-h2">
              The people behind <span className="text-gradient">DRISYON.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted">
              Builders, storytellers and community makers turning intelligent systems into real outcomes.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 lg:grid-cols-5 lg:gap-5">
          {people.map((p, i) => (
            <li key={p.name}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className="group h-full overflow-hidden rounded-[22px] bg-white p-2.5 ring-1 ring-inset ring-line transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(74_58_240/0.45)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-navy-2">
                    {p.photo ? (
                      <Image
                        src={p.photo}
                        alt={`Portrait of ${p.name}, ${p.role} at DRISYON`}
                        fill
                        sizes="(min-width: 1024px) 230px, (min-width: 640px) 31vw, 46vw"
                        className="object-cover object-[50%_20%] transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`Photo placeholder for ${p.name}`}
                        className="absolute inset-0 grid place-items-center"
                        style={{
                          background:
                            "radial-gradient(120% 80% at 30% 0%, rgb(11 99 255 / 0.35), transparent 60%), radial-gradient(100% 80% at 100% 100%, rgb(161 43 226 / 0.35), transparent 60%), #10184a",
                        }}
                      >
                        <span className="font-display text-4xl font-semibold tracking-[-0.04em] text-white/85">{p.initials}</span>
                        <span className="absolute left-2.5 top-2.5">
                          <PlaceholderTag dark>Photo soon</PlaceholderTag>
                        </span>
                      </div>
                    )}
                    {/* brand-tinted edge that reveals on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-700 ease-out-soft group-hover:scale-x-100"
                      style={{ background: "var(--gradient-brand)" }}
                    />
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <h3 className="font-display text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-text">{p.name}</h3>
                    <p className="mt-1 text-sm leading-snug text-muted">{p.role}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
