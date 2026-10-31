import { useJoinModal } from "@/components/site/join-modal";
import { TestimonialsBlock } from "./testimonials";
import { timeline, team, whatsappNumber, whatsappLink } from "@/data/content";
import { LeadEmailForm } from "@/components/site/lead-form";
import { PageIntro } from "./faq-list";

export function TeamGrid() {
  return (
    <div className="tm">
      {team.map(([initials, role]) => {
        const [person, title] = role.split(", ");
        return (
          <div className="card glass rv" key={initials}>
            <div className="av" style={{ width: 90, height: 90, margin: "0 auto 14px" }}>
              {initials}
            </div>
            <h3>{person ?? role}</h3>
            <small style={{ color: "var(--mute)" }}>{title ?? ""}</small>
          </div>
        );
      })}
    </div>
  );
}

export function ContactPage({ variant }: { variant: "contact" | "book-a-call" | "get-started" }) {
  const join = useJoinModal();
  const titles = {
    contact: "Contact",
    "book-a-call": "Book a call",
    "get-started": "Get started",
  } as const;
  const descs = {
    contact: "WhatsApp, call or message. We reply within one business day.",
    "book-a-call": "A free 30-minute strategy call. Pick a time that suits you.",
    "get-started": "Tell us about your project and get a clear plan, timeline and quote.",
  } as const;
  return (
    <>
      <PageIntro title={titles[variant]} desc={descs[variant]} kicker="Work with us" />
      <section>
        <div className="c" style={{ maxWidth: 560, margin: "auto" }}>
          <div className="card glass">
            <p style={{ marginBottom: 14 }}>
              Share your email and project details. We reply within one business day.
            </p>
            <p style={{ marginBottom: 14 }}>
              <b>Call or WhatsApp:</b>{" "}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--g2)" }}>
                {whatsappNumber}
              </a>
            </p>
            <LeadEmailForm source={variant} button="Send" />
            <div className="ctas" style={{ marginTop: 20, justifyContent: "flex-start" }}>
              <button className="btn p" onClick={() => join.open("Book a free strategy call", "call")}>
                Book a call →
              </button>
              <a className="btn s" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageIntro
        title="About Us"
        desc="A studio built for growth: strategy first, design second, code third, results measured after launch."
        kicker="About"
      />
      <section>
        <div className="c">
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
          <h2 style={{ margin: "50px 0 20px" }}>How we got here</h2>
          <div className="tl">
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
    </>
  );
}

export function TeamPage() {
  return (
    <>
      <PageIntro title="Meet the Team" desc="The people behind Benji Agency." kicker="About" />
      <section>
        <div className="c">
          <TeamGrid />
        </div>
      </section>
    </>
  );
}

export function TestimonialsPage() {
  return (
    <>
      <PageIntro title="Testimonials" desc="What clients say about working with Benji Agency." kicker="About" />
      <section>
        <div className="c">
          <TestimonialsBlock />
        </div>
      </section>
    </>
  );
}

export function AffiliatePage() {
  return (
    <>
      <PageIntro
        title="Affiliate Program"
        desc="Earn with us by referring clients who need websites, apps, AI agents or automation."
        kicker="Work with us"
      />
      <section>
        <div className="c" style={{ maxWidth: 640, margin: "auto" }}>
          <div className="grid3">
            {[
              ["1. Refer", "Share a client's project with us through a simple form or introduction."],
              ["2. We deliver", "We scope, build and deliver under your brand or ours, as you prefer."],
              ["3. You earn", "You receive an agreed share of every project that closes."],
            ].map(([t, d]) => (
              <div className="card glass rv" key={t}>
                <span className="n">{t.split(".")[0]}</span>
                <h3>{t.slice(3)}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="card glass" style={{ marginTop: 30, textAlign: "center" }}>
            <p style={{ color: "var(--mute)" }}>
              Tell us who you are and we will send the partnership terms. NDAs welcome.
            </p>
            <LeadEmailForm source="affiliate" button="Request terms" />
          </div>
        </div>
      </section>
    </>
  );
}
