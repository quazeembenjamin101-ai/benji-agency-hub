import { useState } from "react";
import { freeTools } from "@/data/content";
import { runWebsiteAudit, runProposal, runPrototype } from "@/lib/tools.functions";

export function ToolsIndex() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = ["All", "Try it now", "Ecommerce", "Build", "Grow"];
  const list = freeTools.filter(
    ([name, tag, desc]) =>
      (cat === "All" || tag === cat) && `${name}${desc}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="tc">
        {cats.map((c) => (
          <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <input
        className="tq"
        placeholder="Find a tool…"
        aria-label="Find a tool"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="tg3">
        {list.map(([name, tag, desc, detail, cta]) => (
          <a className="tl2 glass rv in" key={name} href={`/resources/${slug(name)}`}>
            <small>{tag}</small>
            <h3>{name}</h3>
            <p>
              <b>What it does:</b> {desc}
            </p>
            <p>
              <b>You get:</b> {detail}
            </p>
            <span className="go">
              {cta} →
            </span>
          </a>
        ))}
        {!list.length && <p style={{ color: "var(--mute)" }}>No tools match your search.</p>}
      </div>
    </>
  );
}

const slug = (t: string) =>
  t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ToolShell({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="c" style={{ maxWidth: 720, margin: "auto" }}>
        <h1 style={{ fontSize: "clamp(1.9rem,4.6vw,3.2rem)" }}>{title}</h1>
        <p className="l" style={{ color: "var(--mute)", margin: "16px 0 30px" }}>
          {desc}
        </p>
        {children}
      </div>
    </section>
  );
}

export function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");

  return (
    <ToolShell
      title="Website Audit"
      desc="Enter your website address for a speed, SEO and conversion check with prioritised fixes."
    >
      <div className="rf card glass">
        <input
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={200}
        />
        <button
          className="btn p"
          style={{ justifyContent: "center" }}
          disabled={busy || url.trim().length < 4}
          onClick={async () => {
            setBusy(true);
            setErr("");
            setResult("");
            try {
              const r = await runWebsiteAudit({ data: { url: url.trim() } });
              setResult(r.text);
            } catch {
              setErr("The audit could not run right now. Please try again later.");
            }
            setBusy(false);
          }}
        >
          {busy ? "Auditing…" : "Audit my website"}
        </button>
      </div>
      {err && <p style={{ color: "var(--mute)", marginTop: 16 }}>{err}</p>}
      {busy && <p style={{ color: "var(--mute)", marginTop: 16 }}>Checking your site…</p>}
      {result && (
        <div className="card glass" style={{ marginTop: 24, whiteSpace: "pre-wrap", fontSize: ".92rem" }}>
          {result}
        </div>
      )}
    </ToolShell>
  );
}

export function ProposalTool() {
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");
  return (
    <ToolShell
      title="Instant Proposal"
      desc="Answer a few questions about your business and goals — get a scoped plan you can react to in seconds."
    >
      <div className="rf card glass">
        <textarea
          rows={5}
          maxLength={800}
          placeholder="e.g. A booking website for my salon in Lagos with a price list, gallery and WhatsApp booking. I want it live in a month."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <button
          className="btn p"
          style={{ justifyContent: "center" }}
          disabled={busy || idea.trim().length < 12}
          onClick={async () => {
            setBusy(true);
            setErr("");
            setResult("");
            try {
              const r = await runProposal({ data: { idea: idea.trim() } });
              setResult(r.text);
            } catch {
              setErr("The proposal could not be generated right now. Please try again later.");
            }
            setBusy(false);
          }}
        >
          {busy ? "Building…" : "Build my proposal"}
        </button>
      </div>
      {err && <p style={{ color: "var(--mute)", marginTop: 16 }}>{err}</p>}
      {result && (
        <div className="card glass" style={{ marginTop: 24, whiteSpace: "pre-wrap", fontSize: ".92rem" }}>
          {result}
        </div>
      )}
    </ToolShell>
  );
}

const DEVICE_W: Record<string, string> = { Mobile: "390px", Tablet: "820px", Desktop: "100%" };

export function PrototypeTool() {
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [html, setHtml] = useState("");
  const [err, setErr] = useState("");
  const [device, setDevice] = useState("Desktop");
  const recent: number[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("pth") || "[]").filter((x: number) => Date.now() - x < 36e5);
    } catch {
      return [];
    }
  })();

  return (
    <ToolShell
      title="AI Prototype Builder"
      desc="Describe your business and the pages you need. Benji AI builds a working prototype in under a minute."
    >
      <div className="pb">
        <div>
          <textarea
            className="pt"
            maxLength={500}
            placeholder="e.g. A booking site for my salon in Lagos with prices, a gallery and WhatsApp booking"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            style={{
              width: "100%",
              minHeight: 120,
              background: "var(--glass)",
              border: "1px solid var(--line)",
              borderRadius: 22,
              padding: 18,
              color: "inherit",
              font: "inherit",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <small style={{ color: "var(--mute)" }}>{idea.length}/500</small>
            <button
              className="btn p"
              disabled={busy || idea.trim().length < 8 || recent.length >= 3}
              onClick={async () => {
                setBusy(true);
                setErr("");
                try {
                  const r = await runPrototype({ data: { idea: idea.trim() } });
                  setHtml(r.html);
                  try {
                    localStorage.setItem("pth", JSON.stringify([...recent, Date.now()]));
                  } catch {
                    /* ignore */
                  }
                } catch {
                  setErr("Prototype generation failed. Please try again later.");
                }
                setBusy(false);
              }}
            >
              {busy ? "Creating…" : "Create prototype"}
            </button>
          </div>
          <div className="pbc">
            {["A landing page for my crypto consultancy", "A portfolio site for my photography", "A booking site for my barber shop"].map(
              (s) => (
                <button key={s} onClick={() => setIdea(s)}>
                  {s}
                </button>
              ),
            )}
          </div>
          {recent.length >= 3 && (
            <small style={{ color: "var(--mute)" }}>
              You reached 3 prototypes this hour. Try again later or book a call.
            </small>
          )}
        </div>
        <div className="fr">
          <div className="tb">
            <i />
            <i />
            <i />
            <span>preview</span>
            {Object.keys(DEVICE_W).map((d) => (
              <button key={d} data-w={DEVICE_W[d]} onClick={() => setDevice(d)} style={{ fontWeight: device === d ? 700 : 400 }}>
                {d}
              </button>
            ))}
          </div>
          <div className="vw">
            {busy ? (
              <p>Building your prototype…</p>
            ) : err ? (
              <p>{err}</p>
            ) : html ? (
              <iframe title="Prototype preview" srcDoc={html} style={{ width: DEVICE_W[device], border: 0, minHeight: 480 }} sandbox="allow-scripts" />
            ) : (
              <p>Your prototype appears here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export function RoiCalculator() {
  const [visitors, setVisitors] = useState(1000);
  const [conv, setConv] = useState(1.5);
  const [value, setValue] = useState(50000);
  const [improve, setImprove] = useState(40);
  const cur = (visitors * conv) / 100;
  const after = (visitors * conv * (1 + improve / 100)) / 100;
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString();
  return (
    <ToolShell
      title="ROI Calculator"
      desc="Estimate the return from lifting your website conversion rate. Move the sliders to match your numbers."
    >
      <div className="rf card glass">
        <label>
          Monthly visitors: <b>{visitors.toLocaleString()}</b>
          <input type="range" min={100} max={50000} step={100} value={visitors} onChange={(e) => setVisitors(+e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Current conversion rate: <b>{conv}%</b>
          <input type="range" min={0.1} max={10} step={0.1} value={conv} onChange={(e) => setConv(+e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Average order or deal value: <b>{fmt(value)}</b>
          <input type="range" min={5000} max={2000000} step={5000} value={value} onChange={(e) => setValue(+e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Expected conversion lift: <b>{improve}%</b>
          <input type="range" min={5} max={100} step={5} value={improve} onChange={(e) => setImprove(+e.target.value)} style={{ width: "100%" }} />
        </label>
        <div className="sts">
          <div>
            <b>{fmt(cur * value)}</b>
            <small>Monthly revenue now</small>
          </div>
          <div>
            <b>{fmt(after * value)}</b>
            <small>After the lift</small>
          </div>
          <div>
            <b style={{ color: "var(--g)" }}>{fmt((after - cur) * value)}</b>
            <small>Extra per month</small>
          </div>
        </div>
        <p style={{ color: "var(--mute)", fontSize: ".85rem" }}>
          Estimate only, based on the numbers you entered. Book a free call for a projection based on your real
          analytics.
        </p>
      </div>
    </ToolShell>
  );
}

const QUIZ: [string, string[]][] = [
  ["Do you have a website today?", ["No website yet", "A site that needs work", "A site I am happy with"]],
  ["What matters most right now?", ["Getting found on Google", "Turning visitors into enquiries", "Automating manual work"]],
  ["How do you currently get customers?", ["Referrals only", "Social media", "Search + ads"]],
  ["Who updates your website?", ["Me, with difficulty", "A developer each time", "Nobody"]],
];

export function GrowthQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const stepData = QUIZ[Math.min(step, QUIZ.length - 1)];
  const done = step >= QUIZ.length;
  const plan = done
    ? answers.includes("No website yet")
      ? "Start with a conversion-focused website: 5–7 pages built to rank, with analytics from day one. Then add an AI receptionist so no enquiry goes unanswered."
      : answers[1] === "Getting found on Google"
        ? "Focus on SEO: fix technical foundations, build out service pages for the keywords your buyers search, and set up your Google Business Profile."
        : answers[1] === "Automating manual work"
          ? "Automate the task that costs you the most time first — usually enquiries, follow-ups or bookings — with an AI agent and workflow integrations."
          : "Focus on conversion: clarify your offer above the fold, add proof and a single call-to-action on every page, then test improvements monthly."
    : "";
  return (
    <ToolShell title="Growth Quiz" desc="Four questions. Find your next step.">
      <div className="rf card glass">
        {!done ? (
          <>
            <h3>
              Question {step + 1} of {QUIZ.length}
            </h3>
            <p>{stepData[0]}</p>
            {stepData[1].map((a) => (
              <button
                key={a}
                className="btn s"
                style={{ justifyContent: "flex-start", minWidth: 0, width: "100%" }}
                onClick={() => {
                  setAnswers((x) => [...x, a]);
                  setStep((s) => s + 1);
                }}
              >
                {a}
              </button>
            ))}
          </>
        ) : (
          <>
            <h3>Your next step</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{plan}</p>
            <button className="btn p" style={{ justifyContent: "center" }} onClick={() => { setStep(0); setAnswers([]); }}>
              Retake
            </button>
          </>
        )}
      </div>
    </ToolShell>
  );
}
