import { createFileRoute } from "@tanstack/react-router";
import { SectionIndex } from "@/components/pages/section-index";

export const Route = createFileRoute("/resources/")({
  component: () => <SectionIndex section="resources" />,
  head: () => ({
    meta: [
      { title: "Resources | Benji Agency" },
      {
        name: "description",
        content: "Blog, newsletter, FAQ, playbooks and free tools: website audit, AI receptionist, ROI calculator and more.",
      },
      { property: "og:title", content: "Resources | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
