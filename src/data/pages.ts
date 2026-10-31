// Page registry: maps every inner page of the source site to a real crawlable route.
import { menu, services, type MenuItem } from "./content";

export const slugify = (t: string) =>
  t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type Section = "services" | "solutions" | "resources" | "company" | "community" | "portfolio" | "blog";

export type PageEntry = {
  slug: string;
  title: string;
  desc: string;
  section: Section;
  group?: string;
  special?: string;
};

const sectionOf: Record<string, Section> = {
  Services: "services",
  Solutions: "solutions",
  Resources: "resources",
  Company: "company",
  Community: "community",
  Portfolio: "portfolio",
  Blog: "blog",
};

const entries: PageEntry[] = [];
const seen = new Set<string>();
const push = (e: PageEntry) => {
  const key = `${e.section}/${e.slug}`;
  if (seen.has(key)) return;
  seen.add(key);
  entries.push(e);
};

for (const m of menu) {
  if (!m.c) continue;
  const section = sectionOf[m.t];
  if (!section) continue;
  for (const [group, links] of m.c) {
    for (const [title, desc] of links) {
      if (section === "community") continue; // all community links live at /community
      if (section === "blog") continue; // blog has its own index
      if (section === "portfolio") continue; // portfolio renders case studies
      push({ slug: slugify(title), title, desc, section, group });
    }
  }
}
// The home services grid links to more service pages than the menu shows.
for (const [title, desc] of services) push({ slug: slugify(title), title, desc, section: "services" });

// Case studies get portfolio routes.
export const caseStudySlugs = [
  "bake-her-rich",
  "ai-crm-for-b2b-startups",
  "birthday-sale-campaign",
  "billionaire-mind-team-platform",
];

export function findPage(section: Section, slug: string): PageEntry | undefined {
  return entries.find((e) => e.section === section && e.slug === slug);
}

export function pagesOfSection(section: Section): PageEntry[] {
  return entries.filter((e) => e.section === section);
}

export function hrefFor(e: { section: Section; slug: string }): string {
  return `/${e.section}/${e.slug}`;
}

export const megaFeatHref = (m: MenuItem): string => {
  if (!m.f) return "/";
  const first = m.f[0];
  const section = sectionOf[m.t] ?? "services";
  if (section === "community") return "/community";
  return `/${section}/${slugify(first)}`;
};

export const allPages = entries;

/** Resolves a legacy "#p-slug" hash to the real route for that page. */
export function deepHref(hash: string): string {
  const slug = hash.replace(/^#p-/, "");
  const hit = entries.find((e) => e.slug === slug);
  if (hit) return hrefFor(hit);
  if (caseStudySlugs.includes(slug)) return `/portfolio/${slug}`;
  if (slug === "blog") return "/blog";
  if (slug === "community" || slug === "community-home") return "/community";
  if (slug === "free-tools-and-features") return "/resources/free-tools";
  if (slug === "ai-prototype-builder") return "/resources/ai-prototype-builder";
  return "/";
}
