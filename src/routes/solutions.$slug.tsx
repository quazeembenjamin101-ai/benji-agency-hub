import { createFileRoute, notFound } from "@tanstack/react-router";
import { RichPage } from "@/components/pages/rich";
import { findPage } from "@/data/pages";

export const Route = createFileRoute("/solutions/$slug")({
  loader: async ({ params }) => {
    const page = findPage("solutions", params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.page.title} | Benji Agency` : "Solution | Benji Agency" },
      {
        name: "description",
        content: loaderData ? `${loaderData.page.desc} Benji Agency growth systems.` : "Benji Agency solutions.",
      },
      { property: "og:title", content: loaderData?.page.title ?? "Solution | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SolutionPage,
});

function SolutionPage() {
  const { page } = Route.useLoaderData();
  return <RichPage page={page} />;
}
