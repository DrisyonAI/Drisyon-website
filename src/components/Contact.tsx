import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { FounderCards } from "./FounderCards";
import { Eyebrow, Reveal, RevealLines } from "./ui";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark relative isolate overflow-hidden bg-ink text-white section-y">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 -z-10 h-[520px] w-[520px] rounded-full opacity-25 blur-[140px]"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div aria-hidden="true" className="grid-lines-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />

      <div className="container-x">
        <Reveal>
          <Eyebrow dark>Talk to Us</Eyebrow>
        </Reveal>
        <RevealLines
          id="contact-title"
          lines={["Have a process", <span key="w" className="text-gradient-dark">worth automating?</span>]}
          className="display mt-6 text-h2"
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-[1.0625rem] text-muted-dark">Let&apos;s turn repetitive work into an intelligent system.</p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-white/45">Write to us</p>
              <a
                href={`mailto:${site.email}`}
                className="group mt-3 inline-flex items-center gap-3 font-display text-xl md:text-2xl font-medium tracking-[-0.02em]"
              >
                <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {site.email}
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <p className="eyebrow mb-1.5 text-white/45">Talk to a founder</p>
              <p className="mb-5 text-sm text-white/55">Choose a profile to pick a time slot.</p>
              <FounderCards />
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="relative rounded-[28px] bg-paper p-6 text-text shadow-[0_40px_120px_-40px_rgb(74_58_240/0.5)] sm:p-8 md:p-10">
              <h3 id="contact-form-title" className="font-display text-2xl font-semibold tracking-[-0.02em]">
                Tell us about your process
              </h3>
              <p className="mb-8 mt-2 text-sm text-muted">A short description is enough — we&apos;ll take it from there.</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
