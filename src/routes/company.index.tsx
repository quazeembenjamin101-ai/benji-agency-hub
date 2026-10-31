import { createFileRoute } from "@tanstack/react-router";
import { SectionIndex } from "@/components/pages/section-index";

export const Route = createFileRoute("/company/")({
  component: () => <SectionIndex section="company" />,
  head: () => ({
    meta: [
      { title: "Company | Benji Agency" },
      { name: "description", content: "About Benji Agency: our story, our team, reviews and how to work with us." },
      { property: "og:title", content: "Company | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
