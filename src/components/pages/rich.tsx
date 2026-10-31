import { Link } from "@tanstack/react-router";
import type { PageEntry } from "@/data/pages";
import { FaqList, PageIntro } from "./faq-list";
import { LeadEmailForm } from "@/components/site/lead-form";
import { faqs, whatsappNumber } from "@/data/content";
import { useJoinModal } from "@/components/site/join-modal";

type Bucket = "design" | "build" | "grow" | "gen";

const BUCKETS: Record<Bucket, string[]> = {
  design: [
    "Brand-aware concepts and clear direction",
    "Layouts and assets for web, mobile and print",
    "Source files and usage guidelines",
    "Revisions until you are happy",
  ],
  build: [
    "Clean, fast and responsive code",
    "Integrations with the tools you already use",
    "Testing on phones, tablets and desktops",
    "Handover, training and documentation",
  ],
  grow: [
    "Research into your market and competitors",
    "A prioritised plan with clear targets",
    "Execution, tracking and monthly reporting",
    "Regular reviews so results keep compounding",
  ],
  gen: [
    "A clear scope and fixed timeline in writing",
    "Weekly progress you can review live",
    "SEO and analytics set up from day one",
    "Handover, training and documentation",
  ],
};

function bucketOf(p: PageEntry): Bucket {
  const g = `${p.group ?? ""} ${p.title}`.toLowerCase();
  if (/design|brand|media|animation|video|logo|graphic/.test(g)) return "design";
  if (/build|app|develop|system|crm|wordpress|web3|contract/.test(g)) return "build";
  if (/growth|market|strategy|seo|email|lead|funnel|social|ads/.test(g)) return "grow";
  return "gen";
}

/** The generic inner-page template the source generated for every service/solution/company page. */
export function RichPage({ page }: { page: PageEntry }) {
  const join = useJoinModal();
  const t = page.title;
  const lc = t.toLowerCase();
  const key = bucketOf(page);
  const specific: [string, string][] = [
    [`How long does ${lc} take?`, `Most ${lc} projects take between one and six weeks depending on scope and how quickly feedback comes in. We confirm a timeline in writing after a free call.`],
    [`How much does ${lc} cost?`, `It depends on scope, complexity and the number of deliverables. Book a free 30-minute call and we will give you a clear written quote with no obligation.`],
    [`Do you work with clients outside Nigeria?`, `Yes — worldwide. Calls run over Google Meet or WhatsApp, work is tracked in a shared board and we adapt to your time zone.`],
  ];

  return (
    <>
      <PageIntro
        title={t}
        desc={page.desc}
        actions={
          <>
            <button className="btn p" onClick={() => join.open(`Start a ${lc} project`, "contact")}>
              Start a project →
            </button>
            <button className="btn s" onClick={() => join.open("Book a free strategy call", "call")}>
              Book a call
            </button>
          </>
        }
      />
      <section>
        <div className="c">
          <div className="grid3">
            <div className="card glass rv">
              <h3>What is {t}?</h3>
              <p>
                {t} covers {page.desc.toLowerCase().replace(/\.$/, "")}. At Benji Agency we treat it as a
                business tool, not a deliverable: every decision is tied to getting you more enquiries, sales
                or saved time.
              </p>
            </div>
            <div className="card glass rv">
              <h3>Who it is for</h3>
              <p>
                Businesses that want {lc} done properly the first time: clear scope, honest timelines and
                measurable results instead of vague promises.
              </p>
            </div>
            <div className="card glass rv">
              <h3>What you get</h3>
              <p>
                A dedicated team, weekly reviews, clean handover documentation and support after launch. Call
                or WhatsApp {whatsappNumber} to start.
              </p>
            </div>
          </div>

          <h2 style={{ margin: "50px 0 20px" }}>What is included</h2>
          <div className="grid3">
            {BUCKETS[key].map((x, i) => (
              <div className="card glass rv" key={x}>
                <span className="n">0{i + 1}</span>
                <p style={{ color: "var(--ink)", margin: 0 }}>{x}</p>
              </div>
            ))}
          </div>

          <h2 style={{ margin: "50px 0 20px" }}>How we work</h2>
          <div className="grid3">
            {[
              ["Discover", "We learn your goals, audience, competitors and constraints, then agree on scope and success measures."],
              ["Create", "We design and build in short cycles with live previews, so you can review real progress every week."],
              ["Launch and grow", "We test, launch, train your team and keep improving what converts month after month."],
            ].map(([h, d], i) => (
              <div className="card glass rv" key={h}>
                <span className="n">0{i + 1}</span>
                <h3>{h}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>

          <h2 style={{ margin: "50px 0 20px" }}>{t}: common questions</h2>
          <FaqList items={specific} />

          <div className="cta glass rv" style={{ marginTop: 60 }}>
            <span className="k">Next step</span>
            <h2>
              Want {lc} that <em>performs?</em>
            </h2>
            <p>Tell us about your project and get a clear plan, timeline and quote.</p>
            <LeadEmailForm source={`page:${page.slug}`} button="Send my email" />
            <div className="ctas" style={{ marginTop: 24 }}>
              <button className="btn p" onClick={() => join.open("Book a free strategy call", "call")}>
                Book a call →
              </button>
              <Link to="/portfolio" className="btn s">
                See our work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
