"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";
import { Button } from "./ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    if (pathname !== "/") return setActive(null);
    const ids = nav.map((n) => n.href.split("#")[1]).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out-soft ${
          scrolled || open
            ? "bg-paper/80 shadow-[0_1px_0_rgb(11_16_36/0.08)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className={`container-x flex items-center justify-between transition-[height] duration-500 ease-out-soft ${
            scrolled ? "h-[64px]" : "h-[84px]"
          }`}
        >
          <Link href="/" aria-label={`${site.name}, powered by Brain O Vision — home`} className="rounded-lg" onClick={() => setOpen(false)}>
            <Logo height={scrolled ? 38 : 46} poweredBy />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const id = item.href.split("#")[1];
              const isActive = id ? active === id : pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300 ${
                      isActive ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-text/[0.05]"
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Button href="/#contact" className="!px-5 !py-2.5 max-sm:!hidden" arrow>
              Talk to Us
            </Button>
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-full ring-1 ring-inset ring-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-5 bg-text transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-5 bg-text transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`}
              />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 overflow-y-auto bg-paper lg:hidden"
            style={{ top: scrolled ? 64 : 84 }}
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex min-h-full flex-col pb-10 pt-6">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 font-display text-[1.5rem] font-medium tracking-[-0.02em]"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-base text-muted">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-auto pt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button href="/#contact" className="w-full !py-4 text-base" arrow onClick={() => setOpen(false)}>
                  Talk to Us
                </Button>
                <a href={`mailto:${site.email}`} className="mt-5 block text-center text-sm text-muted">
                  {site.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
