import { createFileRoute, notFound } from "@tanstack/react-router";
import { RichPage } from "@/components/pages/rich";
import { FaqList, PageIntro } from "@/components/pages/faq-list";
import { LeadEmailForm } from "@/components/site/lead-form";
import { TeamGrid } from "@/components/pages/company-pages";
import {
  WebsiteAuditTool,
  ProposalTool,
  PrototypeTool,
  RoiCalculator,
  GrowthQuiz,
} from "@/components/pages/tools";
import { faqs, freeTools } from "@/data/content";
import { findPage, slugify, type Section } from "@/data/pages";

const toolBySlug = new Map(freeTools.map(([name, tag, desc, detail]) => [slugify(name), { name, tag, desc, detail }]));

export const Route = createFileRoute("/resources/$slug")({
  loader: async ({ params }) => {
    const page = findPage("resources", params.slug);
    const tool = toolBySlug.get(params.slug);
    if (!page && !tool) throw notFound();
    return {
      slug: params.slug,
      page: page ?? { slug: params.slug, title: tool!.name, desc: tool!.detail, section: "resources" as Section },
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.page.title} | Benji Agency` : "Resource | Benji Agency" },
      {
        name: "description",
        content: loaderData ? `${loaderData.page.desc} Benji Agency resources and free tools.` : "Benji Agency resources.",
      },
      { property: "og:title", content: loaderData?.page.title ?? "Resource | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcePage,
});

function ResourcePage() {
  const { slug, page } = Route.useLoaderData();
  switch (slug) {
    case "newsletter":
      return (
        <>
          <PageIntro title="Newsletter" desc="Weekly growth tips on websites, SEO, automation and AI. No spam." kicker="Learn" />
          <section>
            <div className="c" style={{ maxWidth: 640, margin: "auto" }}>
              <div className="card glass" style={{ textAlign: "center" }}>
                <LeadEmailForm source="newsletter" button="Subscribe" />
              </div>
            </div>
          </section>
        </>
      );
    case "faq":
      return (
        <>
          <PageIntro title="FAQ" desc="Common questions about working with Benji Agency, answered." kicker="Learn" />
          <section>
            <div className="c" style={{ maxWidth: 820, margin: "auto" }}>
              <FaqList items={faqs} />
            </div>
          </section>
        </>
      );
    case "knowledge-base":
      return (
        <>
          <PageIntro title="Knowledge Base" desc="In-depth playbooks for websites, SEO, automation and growth." kicker="Learn" />
          <section>
            <div className="c">
              <div className="grid3">
                {[
                  ["Website launch playbook", "Everything to check before a site goes live: performance, SEO, analytics and tracking."],
                  ["SEO starter playbook", "Keyword research, page structure, internal links and content that ranks."],
                  ["Automation playbook", "How to connect forms, email, CRM and AI so work runs without you."],
                  ["Conversion playbook", "Offer clarity, proof, page structure and tests that lift enquiry rates."],
                  ["AI agents playbook", "Where assistants help, what to automate first and how to keep quality high."],
                  ["E-commerce playbook", "Store setup, product pages, abandoned-cart flows and retention."],
                ].map(([t, d]) => (
                  <div className="card glass rv" key={t}>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    case "free-checklists":
      return (
        <>
          <PageIntro title="Free Checklists" desc="Website, CRO and launch checklists you can use today." kicker="Learn" />
          <section>
            <div className="c" style={{ maxWidth: 720, margin: "auto" }}>
              <div className="grid3">
                {[
                  ["Website checklist", "Speed, mobile, SEO basics, analytics, accessibility and security."],
                  ["CRO checklist", "Above-the-fold clarity, proof, forms, CTAs and follow-up speed."],
                  ["Launch checklist", "DNS, SSL, redirects, backups, tracking and handover docs."],
                ].map(([t, d]) => (
                  <div className="card glass rv" key={t}>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
              <div className="card glass" style={{ marginTop: 30, textAlign: "center" }}>
                <p style={{ color: "var(--mute)" }}>Enter your email and we will send all three checklists.</p>
                <LeadEmailForm source="checklists" button="Send the checklists" />
              </div>
            </div>
          </section>
        </>
      );
    case "website-audit":
      return <WebsiteAuditTool />;
    case "instant-proposal":
      return <ProposalTool />;
    case "ai-prototype-builder":
      return <PrototypeTool />;
    case "roi-calculator":
      return <RoiCalculator />;
    case "growth-quiz":
      return <GrowthQuiz />;
    case "ai-receptionist":
      return (
        <>
          <PageIntro
            title="AI Receptionist"
            desc="A demo assistant that answers questions, qualifies leads and books calls — chat or talk to it in the corner widget."
            kicker="Free tools"
          />
          <section>
            <div className="c" style={{ maxWidth: 720, margin: "auto" }}>
              <div className="card glass" style={{ textAlign: "center" }}>
                <p style={{ color: "var(--mute)" }}>
                  Click the floating assistant at the bottom-right of the screen and ask it anything — pricing
                  questions, service questions, or describe your project. When it gets your name and email it
                  saves you as a lead for the team to follow up.
                </p>
                <p style={{ color: "var(--mute)", fontSize: ".85rem", marginTop: 12 }}>
                  On desktop it can also speak its answers out loud.
                </p>
              </div>
            </div>
          </section>
        </>
      );
    default:
      return <RichPage page={page} />;
  }
}
