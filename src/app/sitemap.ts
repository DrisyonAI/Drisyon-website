import type { MetadataRoute } from "next";
import { legalDetailsComplete } from "@/lib/company";
import { solutions } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Policy pages are listed once the registered office and grievance officer are filled in (src/lib/company.ts).
  const legal = legalDetailsComplete() ? ["/terms", "/refund-policy", "/privacy", "/contact"] : [];
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/cloud-security`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...solutions.map((s) => ({
      url: `${site.url}/solutions/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...legal.map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
