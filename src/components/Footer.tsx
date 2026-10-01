import Image from "next/image";
import Link from "next/link";
import { footerNav, site, socials } from "@/lib/site";
import { Button } from "./ui";

export function Footer() {
  return (
    <footer className="on-dark relative isolate overflow-hidden bg-ink text-white">
      {/* Closing brand statement */}
      <div className="container-x border-t border-white/10 pb-16 pt-20 md:pt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="display text-h1">
              See beyond.
              <br />
              <span className="text-gradient-dark">Automate everything.</span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end lg:text-right">
            {/* Brand lockup: logo, tagline, "powered by" and the Brain O Vision badge share one centre axis */}
            <div className="flex w-[220px] flex-col items-center text-center">
              <div className="flex items-end gap-3">
                <Image src="/logo-mark.png" alt="" width={38} height={52} className="h-[52px] w-auto" />
                <Image src="/logo-word-light.png" alt="DRISYON" width={92} height={26} className="mb-0.5 h-[26px] w-auto" />
              </div>
              <p className="mt-3 text-[0.8rem] font-medium tracking-[0.06em] text-white/75">
                Innovate<span className="text-sky">.</span> Integrate<span className="text-sky">.</span> Automate
                <span className="text-sky">.</span>
              </p>
              <p className="mt-5 flex w-full items-center gap-3 text-xs text-white/50">
                <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
                powered by
                <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
              </p>
              <Image
                src="/brainovision.png"
                alt="Brain O Vision Solutions India Pvt. Ltd."
                width={369}
                height={167}
                className="mt-3 h-auto w-[150px] rounded-md"
              />
            </div>
            <p className="eyebrow text-white/50">Super Intelligence Automation &amp; Intelligent Systems</p>
            <a href={`mailto:${site.email}`} className="text-white/80 hover:text-white">
              {site.email}
            </a>
            <Button href="/#contact" variant="light" arrow>
              Talk to Us
            </Button>
          </div>
        </div>
      </div>

      <div className="container-x border-t border-white/10 py-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-sm font-medium tracking-[0.04em] text-white/80">{site.tagline}</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-5">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {footerNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/55 transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <ul className="space-y-3 text-sm" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/55 transition-colors hover:text-white">
                      {s.label}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-white/35" title={`${s.label} link coming soon`}>
                      {s.label}
                      <span className="rounded-full border border-dashed border-white/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] text-white/35">
                        Soon
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-white/40">© 2026 DRISYON. All rights reserved.</p>
      </div>
    </footer>
  );
}
