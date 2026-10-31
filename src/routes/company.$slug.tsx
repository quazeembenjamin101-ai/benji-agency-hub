import { createFileRoute, notFound } from "@tanstack/react-router";
import { RichPage } from "@/components/pages/rich";
import { SectionIndex } from "@/components/pages/section-index";
import {
  AboutPage,
  AffiliatePage,
  ContactPage,
  TeamPage,
  TestimonialsPage,
} from "@/components/pages/company-pages";
import { findPage } from "@/data/pages";

export const Route = createFileRoute("/company/$slug")({
  loader: async ({ params }) => {
    const page = findPage("company", params.slug);
    if (!page) throw notFound();
    return { slug: params.slug, page };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.page.title} | Benji Agency` : "Company | Benji Agency" },
      {
        name: "description",
        content: loaderData ? `${loaderData.page.desc} Benji Agency.` : "Benji Agency.",
      },
      { property: "og:title", content: loaderData?.page.title ?? "Company | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  const { slug, page } = Route.useLoaderData();
  switch (slug) {
    case "about-us":
      return <AboutPage />;
    case "meet-the-team":
      return <TeamPage />;
    case "testimonials":
      return <TestimonialsPage />;
    case "affiliate-program":
      return <AffiliatePage />;
    case "contact":
      return <ContactPage variant="contact" />;
    case "book-a-call":
      return <ContactPage variant="book-a-call" />;
    case "get-started":
      return <ContactPage variant="get-started" />;
    case "case-studies":
      return <SectionIndex section="portfolio" />;
    default:
      return <RichPage page={page} />;
  }
}
