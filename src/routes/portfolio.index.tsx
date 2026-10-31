import { createFileRoute } from "@tanstack/react-router";
import { SectionIndex } from "@/components/pages/section-index";

export const Route = createFileRoute("/portfolio/")({
  component: () => <SectionIndex section="portfolio" />,
  head: () => ({
    meta: [
      { title: "Portfolio & Case Studies | Benji Agency" },
      {
        name: "description",
        content: "Case studies with measurable results: communities, SaaS products and email campaigns we built.",
      },
      { property: "og:title", content: "Portfolio & Case Studies | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
