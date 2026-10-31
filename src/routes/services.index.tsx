import { createFileRoute } from "@tanstack/react-router";
import { SectionIndex } from "@/components/pages/section-index";

export const Route = createFileRoute("/services/")({
  component: () => <SectionIndex section="services" />,
  head: () => ({
    meta: [
      { title: "Services | Benji Agency" },
      {
        name: "description",
        content:
          "Web development, business applications, design, SEO, AI agents and automation — every Benji Agency service in one place.",
      },
      { property: "og:title", content: "Services | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
