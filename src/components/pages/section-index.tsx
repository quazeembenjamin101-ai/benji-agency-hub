import { caseStudies } from "@/data/content";
import { caseStudySlugs, pagesOfSection, type Section } from "@/data/pages";
import { PageIntro } from "./faq-list";
import { useJoinModal } from "@/components/site/join-modal";
import { DynamicLink } from "@/components/site/bits";

export function SectionIndex({ section }: { section: Section }) {
  const join = useJoinModal();
  if (section === "portfolio") {
    return (
      <>
        <PageIntro
          title="Portfolio"
          desc="Case studies with measurable results — the brief, the build and the outcome of each project."
          kicker="Website and app portfolio"
        />
        <section>
          <div className="c">
            <div className="wk" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr" }}>
              {caseStudySlugs.map((slug) => {
                const c = caseStudies[slug];
                if (!c) return null;
                return (
                  <DynamicLink key={slug} to={`/portfolio/${slug}`} className="w rv" style={{ minHeight: 260, ["--art" as string]: c.art ?? "radial-gradient(circle at 70% 25%,#22c55e88,transparent 55%),linear-gradient(135deg,#052e16,#030a06)" }}>
                    <div>
                      <small>{c.cat}</small>
                      <h3>{c.t}</h3>
                      <p>{c.d}</p>
                    </div>
                  </DynamicLink>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }
  const pages = pagesOfSection(section);
  const heading: Record<string, string> = {
    services: "Services",
    solutions: "Solutions",
    resources: "Resources",
    company: "Company",
  };
  return (
    <>
      <PageIntro
        title={heading[section]}
        desc={`Everything under ${heading[section].toLowerCase()} — pick a topic to see how we work and what you get.`}
      />
      <section>
        <div className="c">
          <div className="grid3">
            {pages.map((p) => (
              <DynamicLink key={p.slug} to={`/${section}/${p.slug}`} className="card glass rv">
                <span className="n">→</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </DynamicLink>
            ))}
          </div>
          <div className="cta glass rv" style={{ marginTop: 50 }}>
            <span className="k">Not sure where to start?</span>
            <h2>Talk to us</h2>
            <p>A free 30-minute strategy call and we will point you to the right service.</p>
            <div className="ctas">
              <button className="btn p" onClick={() => join.open("Book a free strategy call", "call")}>
                Book a call →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
