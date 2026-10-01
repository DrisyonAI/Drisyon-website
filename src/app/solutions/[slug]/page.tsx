import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SolutionFlow } from "@/components/SolutionFlow";
import { Arrow, Button, Eyebrow, Reveal } from "@/components/ui";
import { solutions } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: `${s.title} | DRISYON`, description: s.description, url: `/solutions/${s.slug}` },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const idx = solutions.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const s = solutions[idx];
  const next = solutions[(idx + 1) % solutions.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    serviceType: s.title,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    url: `${site.url}/solutions/${s.slug}`,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-[140px] md:pb-28 md:pt-[180px]">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-text">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#solutions" className="hover:text-text">
                  Solutions
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text">
                {s.title}
              </li>
            </ol>
          </nav>
          <Reveal>
            <Eyebrow>Solution {s.index}</Eyebrow>
            <h1 className="display mt-6 max-w-5xl text-hero">{s.title}</h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{s.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/#contact" arrow>
                Talk to Us
              </Button>
              <Button href="/#solutions" variant="secondary">
                All solutions
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="on-dark bg-ink py-20 text-white md:py-28">
        <div className="container-x">
          <p className="eyebrow text-sky">How it flows</p>
          <div className="mx-auto mt-10 max-w-4xl">
            <SolutionFlow id={s.slug} flow={s.flow} />
          </div>
        </div>
      </section>

      <section className="bg-paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">Where it fits</h2>
            <ul className="mt-8 border-t border-line">
              {s.useCases.map((u, i) => (
                <li key={u} className="flex items-center gap-5 border-b border-line py-5 text-[1.0625rem]">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  {u}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">What we build in</h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {s.capabilities.map((c) => (
                <li key={c} className="rounded-full bg-surface px-4 py-2 text-text/85 ring-1 ring-inset ring-line">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-md leading-relaxed text-muted">
              Every system starts with understanding your process. Tell us what your team repeats, and we&apos;ll show you
              what an intelligent version could look like.
            </p>
          </Reveal>
        </div>

        <div className="container-x mt-24">
          <Link
            href={`/solutions/${next.slug}`}
            className="group flex items-center justify-between gap-6 border-t border-line pt-10"
          >
            <span>
              <span className="eyebrow text-muted">Next solution</span>
              <span className="mt-3 block font-display text-h3 font-semibold tracking-[-0.03em] transition-colors group-hover:text-indigo">
                {next.title}
              </span>
            </span>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors group-hover:bg-ink group-hover:text-white">
              <Arrow />
            </span>
          </Link>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
