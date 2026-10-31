import { createFileRoute, notFound } from "@tanstack/react-router";
import { RichPage } from "@/components/pages/rich";
import { findPage } from "@/data/pages";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const page = findPage("services", params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.page.title} | Benji Agency` : "Service | Benji Agency" },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.page.desc} Benji Agency: websites, apps, AI and growth systems.`
          : "Benji Agency services.",
      },
      { property: "og:title", content: loaderData?.page.title ?? "Service | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicePage,
});

function ServicePage() {
  const { page } = Route.useLoaderData();
  return <RichPage page={page} />;
}
