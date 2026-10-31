import { createFileRoute, Link } from "@tanstack/react-router";
import {
  blogPosts,
  caseStudies,
  faqs,
  growthArc,
  heroVideo,
  marqueeBrands,
  services,
  timeline,
} from "@/data/content";
import { slugify, deepHref } from "@/data/pages";
import { ArcCard, Counter, DynamicLink, SectionHead, useReveal } from "@/components/site/bits";
import { useJoinModal } from "@/components/site/join-modal";
import { TestimonialsBlock } from "@/components/pages/testimonials";
import { FaqList } from "@/components/pages/faq-list";
import { LeadEmailForm } from "@/components/site/lead-form";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Benji Agency | Websites, AI Agents, Automation & Growth Systems" },
      {
        name: "description",
        content:
          "Benji Agency designs and builds high-converting websites, business apps, AI agents and automation that turn visitors into customers.",
      },
      { property: "og:title", content: "Benji Agency | Websites, AI Agents, Automation & Growth Systems" },
      {
        property: "og:description",
        content:
          "High-converting websites, business apps, AI agents and automation that turn visitors into customers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Home() {
  const ref = useReveal<HTMLDivElement>();
  const join = useJoinModal();

  return (
    <div ref={ref}>
      <section className="hero">
        <video className="hv" autoPlay muted loop playsInline preload="auto" aria-hidden src={heroVideo} />
        <div className="hdk" />
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="ring" />
        <div className="ring r2" />
        <div className="hg" />
        <div className="c">
          <div className="pill glass">
            <b />
            Now booking projects for Q1 2027
          </div>
          <h1>
            We don’t just build websites.
            <br />
            We build <em>growth systems.</em>
          </h1>
          <p className="l">
            Benji Agency designs and develops high-converting websites, AI agents and automation that turn
            visitors into customers and manual work into software.
          </p>
          <div className="ctas">
            <button className="btn p" onClick={() => join.open("Start your project", "contact")}>
              Start your project →
            </button>
            <Link to="/portfolio" className="btn s">
              See our work
            </Link>
          </div>
          <div className="stats">
            <div>
              <strong>
                <Counter n={120} />
              </strong>
              <small>Projects shipped</small>
            </div>
            <div>
              <strong>
                <Counter n={98} />
              </strong>
              <small>Avg. Lighthouse score</small>
            </div>
            <div>
              <strong>
                <Counter n={24} />
              </strong>
              <small>Hour support response</small>
            </div>
          </div>
        </div>
      </section>

      <div className="mq">
        <div>
          {[...marqueeBrands, ...marqueeBrands].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section id="process">
        <div className="c">
          <SectionHead
            kicker="Our web design and development process"
            title={
              <>
                A proven process from <em>strategy to launch</em>
              </>
            }
            sub="Strategy, UX design, development and launch in clear steps, with SEO and analytics set up from day one."
          />
          <div className="grid3">
            {[
              ["Strategy & kickoff", "We map your goals, audience and funnel, then agree on scope, structure and a fixed timeline in one working session."],
              ["Design & build", "You review live designs and working builds each week. Responsive layouts, motion and clean code, built to rank."],
              ["Launch & grow", "QA, SEO setup, analytics and handoff training. Then we keep improving what converts."],
            ].map(([t, d], i) => (
              <div className="card glass rv" key={t}>
                <span className="n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="c">
          <SectionHead
            kicker="Web design, development, SEO and automation"
            title={
              <>
                Websites, apps and growth services <em>built to rank and convert</em>
              </>
            }
            sub="We plan, design, build and grow your website, online store or app, then connect it to search, email and AI automation so it keeps bringing you customers long after launch."
          />
          <div className="grid3 sv">
            {services.map(([a, b], i) => (
              <DynamicLink key={a} to={`/services/${slugify(a)}`} className="card glass rv">
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a}</h3>
                <p>{b}</p>
              </DynamicLink>
            ))}
          </div>
        </div>
      </section>

      <section id="work">
        <div className="c">
          <SectionHead
            kicker="Website and app portfolio"
            title={
              <>
                Case studies with <em>measurable results</em>
              </>
            }
            sub="See the brief, the build and the outcome of each project, with a link to the live site."
          />
          <div className="wk">
            <Link to="/portfolio/bake-her-rich" className="w rv" style={{ ["--art" as string]: "radial-gradient(circle at 70% 20%,#f59e0b66,transparent 45%),linear-gradient(135deg,#7c2d12,#1c0a05)" }}>
              <div>
                <small>Community · Skool</small>
                <h3>Bake Her Rich</h3>
                <p>A members-only community platform for a home-bakery brand, with onboarding, course hub and retention flows.</p>
              </div>
            </Link>
            <Link to="/portfolio/ai-crm-for-b2b-startups" className="w rv" style={{ ["--art" as string]: "radial-gradient(circle at 30% 20%,#22c55e88,transparent 50%),linear-gradient(135deg,#052e16,#020a05)" }}>
              <div>
                <small>SaaS · AI</small>
                <h3>AI CRM for B2B startups</h3>
                <p>Pipelines, dashboards and revenue analytics in one workspace.</p>
              </div>
            </Link>
            <Link to="/portfolio/birthday-sale-campaign" className="w rv" style={{ ["--art" as string]: "radial-gradient(circle at 70% 70%,#38bdf866,transparent 50%),linear-gradient(135deg,#0c4a6e,#030a10)" }}>
              <div>
                <small>Email marketing</small>
                <h3>Birthday Sale campaign</h3>
                <p>A Klaviyo campaign built for an e-commerce brand.</p>
              </div>
            </Link>
          </div>
          <p style={{ textAlign: "center", marginTop: 34 }}>
            <Link to="/portfolio" className="btn s">
              View all case studies →
            </Link>
          </p>
        </div>
      </section>

      <section id="grow">
        <div className="c">
          <SectionHead
            kicker="How we grow businesses"
            title={
              <>
                Discovered, nurtured and <em>running on autopilot.</em>
              </>
            }
            sub="Four connected stages that turn people searching online into paying, returning customers."
          />
          <div className="stk">
            {growthArc.map(([label, title, body, chips, href], i) => (
              <ArcCard key={label} index={i} letter={label[0]} label={label} title={title} body={body} chips={chips} href={deepHref(href)} />
            ))}
          </div>
        </div>
      </section>

      <section id="blog">
        <div className="c">
          <SectionHead
            kicker="Resources"
            title={
              <>
                Growth <em>insights</em>
              </>
            }
            sub="Practical articles on websites, SEO, automation and AI, published regularly."
          />
          <div className="bl" style={{ display: "grid", gap: 14, maxWidth: 820, margin: "auto" }}>
            {blogPosts.slice(0, 3).map((b) => (
              <DynamicLink key={b.slug} to={`/blog/${b.slug}`} className="glass rv">
                <small>
                  {b.cat.toUpperCase()} · {b.emoji}
                </small>
                <b>{b.title}</b>
              </DynamicLink>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline">
        <div className="c">
          <SectionHead
            kicker="Our journey"
            title={
              <>
                From idea to <em>launch</em>
              </>
            }
            sub="Every project follows the same transparent path. Timelines depend on scope, so we agree the steps and milestones with you before work begins."
          />
          <div className="tl" id="tl">
            {timeline.map(([step, title, body], i) => (
              <div className="ti rv" key={i}>
                <small>{step}</small>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="c">
          <SectionHead
            kicker="About us"
            title={
              <>
                A studio built for <em>growth</em>
              </>
            }
          />
          <div className="grid3">
            {[
              ["Our mission", "Help ambitious businesses win online with fast websites, smart automation and AI that works."],
              ["Our approach", "Strategy first, design second, code third, and results measured after launch. No vanity projects."],
              ["Why Benji", "One team for design, development, SEO and automation, so nothing gets lost between agencies."],
            ].map(([t, d]) => (
              <div className="card glass rv" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="c">
          <SectionHead
            kicker="Testimonials"
            title={
              <>
                What clients <em>say</em>
              </>
            }
          />
          <TestimonialsBlock compact />
        </div>
      </section>

      <section id="newsletter">
        <div className="c">
          <SectionHead
            kicker="Newsletter"
            title={
              <>
                Weekly growth <em>tips</em>
              </>
            }
          />
          <div className="card glass rv" style={{ maxWidth: 720, margin: "auto", textAlign: "center" }}>
            <p style={{ color: "var(--mute)" }}>
              Join the Benji newsletter for practical tips on websites, SEO, automation and AI. No spam.
            </p>
            <LeadEmailForm source="newsletter" button="Subscribe" />
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="c">
          <SectionHead
            kicker="FAQ"
            title={
              <>
                Questions, <em>answered</em>
              </>
            }
          />
          <div style={{ maxWidth: 820, margin: "auto" }}>
            <FaqList items={faqs.slice(0, 8)} />
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="c">
          <div className="cta glass rv">
            <span className="k">Let’s talk</span>
            <h2>
              Ready to build something
              <br />
              that <em>performs?</em>
            </h2>
            <p>
              Book a free 30-minute strategy call, or send a quick WhatsApp message. We reply within one
              business day.
            </p>
            <div className="ctas">
              <button className="btn p" onClick={() => join.open("Book a free strategy call", "call")}>
                Book a call →
              </button>
              <a className="btn s" href="https://wa.me/2347044442434" target="_blank" rel="noopener noreferrer">
                Start on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
