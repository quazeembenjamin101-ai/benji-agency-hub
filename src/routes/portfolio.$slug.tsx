import { createFileRoute, notFound } from "@tanstack/react-router";
import { CaseStudyPage } from "@/components/pages/case-study";
import { caseStudies } from "@/data/content";
import { caseStudySlugs } from "@/data/pages";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    if (!caseStudySlugs.includes(params.slug) || !caseStudies[params.slug]) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? caseStudies[loaderData.slug] : undefined;
    return {
      meta: [
        { title: c ? `${c.t} — Case Study | Benji Agency` : "Case Study | Benji Agency" },
        { name: "description", content: c ? c.d : "Benji Agency case study." },
        { property: "og:title", content: c ? `${c.t} — Case Study | Benji Agency` : "Case Study" },
        { property: "og:description", content: c?.d ?? "Benji Agency case study." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CaseStudyRoute,
});

function CaseStudyRoute() {
  const { slug } = Route.useLoaderData();
  return <CaseStudyPage slug={slug} />;
}
