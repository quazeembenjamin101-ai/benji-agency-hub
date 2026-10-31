import { createFileRoute } from "@tanstack/react-router";
import { SectionIndex } from "@/components/pages/section-index";

export const Route = createFileRoute("/solutions/")({
  component: () => <SectionIndex section="solutions" />,
  head: () => ({
    meta: [
      { title: "Solutions | Benji Agency" },
      {
        name: "description",
        content: "Growth and marketing systems, CRM and automation, strategy — solutions built to compound.",
      },
      { property: "og:title", content: "Solutions | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
