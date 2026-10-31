import { Link } from "@tanstack/react-router";
import { caseStudies } from "@/data/content";
import { caseStudySlugs } from "@/data/pages";
import { PageIntro } from "./faq-list";
import { useJoinModal } from "@/components/site/join-modal";

export function CaseStudyPage({ slug }: { slug: string }) {
  const c = caseStudies[slug];
  const join = useJoinModal();
  if (!c) return <p>Case study not found.</p>;
  const more = caseStudySlugs.filter((q) => q !== slug);
  const facts: [string, string][] = [
    ["Industry", c.cat],
    ["Services", c.svc],
    ["Platform", c.plat],
    ["Client", c.client],
  ];

  return (
    <>
      <PageIntro title={c.t} desc={c.d} kicker={c.cat} />
      <section>
        <div className="c">
          <div className="cs2">
            <div>
              <div className="grid3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {facts.map(([a, b]) => (
                  <div key={a} className="card glass rv">
                    <small style={{ color: "var(--mute)", textTransform: "uppercase", letterSpacing: ".1em", fontSize: ".7rem", fontWeight: 700 }}>{a}</small>
                    <p style={{ color: "var(--ink)", margin: "6px 0 0" }}>{b}</p>
                  </div>
                ))}
              </div>
              <h2 style={{ margin: "40px 0 14px" }}>The challenge</h2>
              <p style={{ color: "var(--mute)" }}>{c.ch}</p>
              <h2 style={{ margin: "40px 0 14px" }}>What we built</h2>
              <p style={{ color: "var(--mute)" }}>{c.bu}</p>
              <h2 style={{ margin: "40px 0 14px" }}>The result</h2>
              <p style={{ color: "var(--mute)" }}>{c.re}</p>
              {c.url && (
                <p style={{ marginTop: 20 }}>
                  <a className="btn s" href={c.url} target="_blank" rel="noopener noreferrer">
                    View the live site →
                  </a>
                </p>
              )}
            </div>
            <div className="rv2">
              <div className="card glass rv">
                <h3>Goals</h3>
                {c.goals.map((g) => (
                  <p key={g}>✓ {g}</p>
                ))}
              </div>
              <div className="card glass rv">
                <h3>Deliverables</h3>
                {c.deliver.map((g) => (
                  <p key={g}>▸ {g}</p>
                ))}
              </div>
              <div className="card glass rv">
                <h3>Outcomes</h3>
                {c.outcomes.map((g) => (
                  <p key={g}>★ {g}</p>
                ))}
              </div>
            </div>
          </div>

          <h2 style={{ margin: "50px 0 20px", textAlign: "center" }}>How we got there</h2>
          <div className="tl" id="tl">
            {c.steps.map((s, i) => (
              <div className="ti rv" key={i}>
                <small>STEP {String(i + 1).padStart(2, "0")}</small>
                <p style={{ color: "var(--ink)" }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="csx">
        <div className="c">
          <h2 style={{ textAlign: "center", marginBottom: 26 }}>What made it work</h2>
          <div className="grid3">
            {c.tech.map((x) => (
              <div className="card glass rv" key={x}>
                <h3>{x}</h3>
                <p>A deliberate part of the stack, chosen for speed, clarity and easy handover.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="csx">
        <div className="c">
          <div className="cta glass rv">
            <span className="k">Get started today</span>
            <h2>Want results like this?</h2>
            <p>Book a free 30-minute strategy call and get a clear plan for your project.</p>
            <div className="ctas" style={{ gap: 16 }}>
              <button className="btn p" onClick={() => join.open("Get in touch", "contact")}>
                Get in touch →
              </button>
              <button className="btn s" onClick={() => join.open("Book a free strategy call", "call")}>
                Book a call
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="csx">
        <div className="c">
          <h2 style={{ textAlign: "center", marginBottom: 26 }}>More case studies</h2>
          <div className="grid3">
            {more.map((q) => (
              <Link to={`/portfolio/${q}`} className="card glass" key={q}>
                <span className="n">→</span>
                <h3>{caseStudies[q].t}</h3>
                <p>{caseStudies[q].d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
