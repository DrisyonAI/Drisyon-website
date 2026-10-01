export const site = {
  name: "DRISYON",
  tagline: "SEE BEYOND. AUTOMATE EVERYTHING.",
  category: "Super Intelligence Automation & Intelligent Systems",
  title: "DRISYON | AI Automation & Intelligent Systems",
  description:
    "DRISYON builds AI-powered automations, intelligent systems and practical AI solutions for businesses and organizations.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://drisyon.com").replace(/\/$/, ""),
  email: "reachus@drisyon.com",
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Work", href: "/work" },
  { label: "Future-Ready Learners", href: "/#learners" },
  { label: "Corporate", href: "/#corporate" },
  { label: "About", href: "/#about" },
  { label: "Community", href: "/#community" },
];

export const footerNav: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Work", href: "/work" },
  { label: "Community", href: "/#community" },
  { label: "Future-Ready Learners", href: "/#learners" },
  { label: "Corporate", href: "/#corporate" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Social / community links. Only real URLs are used — set them via env vars.
 * When a URL is missing the UI renders a clearly marked "coming soon" placeholder.
 */
export const socials: { label: string; href: string | null }[] = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL || null },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL || null },
  { label: "Meetup", href: process.env.NEXT_PUBLIC_MEETUP_URL || null },
];

export const communityUrl: string | null = process.env.NEXT_PUBLIC_COMMUNITY_URL || null;
