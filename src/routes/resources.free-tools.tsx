import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/pages/faq-list";
import { ToolsIndex } from "@/components/pages/tools";

export const Route = createFileRoute("/resources/free-tools")({
  component: FreeTools,
  head: () => ({
    meta: [
      { title: "Free Tools & Features | Benji Agency" },
      {
        name: "description",
        content: "Free tools to understand, plan and grow your business: website audit, AI receptionist, ROI calculator and more.",
      },
      { property: "og:title", content: "Free Tools & Features | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function FreeTools() {
  return (
    <>
      <PageIntro
        title="Free tools & features"
        desc="Free tools to understand, plan and grow your business. Each tool tells you what it does and what you get."
        kicker="Try before you hire"
      />
      <section>
        <div className="c">
          <ToolsIndex />
        </div>
      </section>
    </>
  );
}
