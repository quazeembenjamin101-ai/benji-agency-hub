import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { funnelStages, salesStages, stageLabels } from "@/data/content";

type Lead = {
  id: string;
  name: string | null;
  email: string;
  build: string | null;
  source: string | null;
  status: string;
  amount: number;
  call_when: string | null;
  msgs: { t: string; who: string; ts?: string }[];
  ts: string;
};
type Member = { user_id: string; name: string; joined_at: string };
type Post = { id: string; author_name: string; category: string; content: string; created_at: string };
type Review = { id: string; name: string; company: string | null; rating: number; text: string; created_at: string };
type Keyword = { id: number; keyword: string; category: string; custom: boolean };
type EventRow = { id: string; title: string; event_at: string; kind: string };

export const Route = createFileRoute("/_authenticated/_admin/")({
  component: AdminCrm,
  head: () => ({
    meta: [
      { title: "Owner Dashboard | Benji Agency" },
      { property: "og:title", content: "Owner Dashboard | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const NAV: [string, string][] = [
  ["Dashboard", "⌂"],
  ["Pipeline", "⑂"],
  ["Contacts", "☺"],
  ["Inbox", "✉"],
  ["Calendar", "▤"],
  ["Keywords", "⚗"],
  ["Community", "◐"],
  ["Reviews", "★"],
  ["Analytics", "↗"],
];

function AdminCrm() {
  const [view, setView] = useState("Dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [q, setQ] = useState("");
  const [newKw, setNewKw] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [l, m, p, r, k, e] = await Promise.all([
      supabase.from("leads").select("*").order("ts", { ascending: false }).limit(500),
      supabase.from("members").select("user_id,name,joined_at").order("joined_at", { ascending: false }).limit(500),
      supabase.from("posts").select("id,author_name,category,content,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("keywords").select("*").order("id").limit(1000),
      supabase.from("events").select("*").order("event_at", { ascending: true }).limit(100),
    ]);
    if (l.data) setLeads(l.data);
    if (m.data) setMembers(m.data);
    if (p.data) setPosts(p.data);
    if (r.data) setReviews(r.data);
    if (k.data) setKeywords(k.data);
    if (e.data) setEvents(e.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const sendMessage = async (lead: Lead) => {
    const text = msg.trim();
    if (!text) return;
    const msgs = [...(lead.msgs ?? []), { t: text, who: "owner", ts: new Date().toISOString() }];
    await supabase.from("leads").update({ msgs }).eq("id", lead.id);
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, msgs } : l)));
    setMsg("");
  };

  const addKeyword = async () => {
    const kw = newKw.trim().toLowerCase();
    if (!kw) return;
    const { data } = await supabase
      .from("keywords")
      .upsert({ keyword: kw, category: "custom", custom: true }, { onConflict: "keyword" })
      .select()
      .single();
    if (data) {
      setKeywords((ks) => [...ks, data]);
      setNewKw("");
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    const { data } = await supabase
      .from("events")
      .insert({ title: newEvent.title, event_at: new Date(newEvent.date).toISOString() })
      .select()
      .single();
    if (data) {
      setEvents((es) => [...es, data]);
      setNewEvent({ title: "", date: "" });
    }
  };

  const stats = useMemo(() => {
    const won = leads.filter((l) => l.status === "Won");
    return {
      total: leads.length,
      contacted: leads.filter((l) => l.status !== "New").length,
      proposals: leads.filter((l) => ["Proposal", "Contract", "Won"].includes(l.status)).length,
      won: won.length,
      wonAmount: won.reduce((a, l) => a + (+l.amount || 0), 0),
      members: members.length,
      posts: posts.length,
      reviews: reviews.length,
      week: leads.filter((l) => Date.now() - new Date(l.ts).getTime() < 7 * 864e5).length,
    };
  }, [leads, members, posts, reviews]);

  const filtered = leads.filter((l) =>
    `${l.name ?? ""}${l.email}${l.build ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const callDays = new Map<string, string[]>();
  for (const l of leads) if (l.call_when) {
    const k = l.call_when.slice(0, 10);
    callDays.set(k, [...(callDays.get(k) ?? []), l.name ?? l.email]);
  }
  for (const e of events) {
    const k = e.event_at.slice(0, 10);
    callDays.set(k, [...(callDays.get(k) ?? []), e.title]);
  }

  const kpi = (label: string, value: string | number, hint?: string) => (
    <div className="kc" key={label}>
      <small>{label}</small>
      <b>{value}</b>
      {hint && <i style={{ fontStyle: "normal", fontSize: ".72rem", color: "var(--g2)" }}>{hint}</i>}
    </div>
  );

  return (
    <div className="ad2">
      <div className="sd">
        <b>Benji Owner</b>
        {NAV.map(([v, icon]) => (
          <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            <span>{icon}</span> {v}
          </button>
        ))}
        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "10px 0" }} />
        <button onClick={() => setView("Dashboard")}>
          <span>⌂</span> <Link to="/">View site</Link>
        </button>
      </div>
      <div className="mn3">
        <div className="tp3" style={{ background: "var(--glass)", border: "1px solid var(--line)" }}>
          <b style={{ color: "var(--ink)" }}>{view}</b>
          <input
            placeholder="Search name, email, project…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ background: "var(--glass)", color: "var(--ink)", border: "1px solid var(--line)" }}
          />
        </div>

        {view === "Dashboard" && (
          <>
            <div className="kp">
              {kpi("Leads captured", stats.total, `+${stats.week} this week`)}
              {kpi("Contacted", stats.contacted)}
              {kpi("Proposals & contracts", stats.proposals)}
              {kpi("Closed won", stats.won, "₦" + stats.wonAmount.toLocaleString())}
            </div>
            <div className="wc">
              <h4>Latest leads</h4>
              <table className="tb2">
                <tbody>
                  {leads.slice(0, 6).map((l) => (
                    <tr key={l.id}>
                      <td>{l.name || "(no name)"}</td>
                      <td>{l.email}</td>
                      <td>{l.source}</td>
                      <td>
                        <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                          {salesStages.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ color: "var(--mute)" }}>{new Date(l.ts).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!leads.length && <tr><td>No leads yet.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="wc">
              <h4>Membership</h4>
              <p style={{ color: "var(--mute)" }}>
                {stats.members} members · {stats.posts} community posts · {stats.reviews} reviews
              </p>
            </div>
          </>
        )}

        {view === "Pipeline" && (
          <div className="kb">
            {salesStages.map((s) => (
              <div key={s}>
                <h4>
                  {stageLabels[s] ?? s} ({leads.filter((l) => l.status === s).length})
                </h4>
                {leads
                  .filter((l) => l.status === s)
                  .map((l) => (
                    <div className="lc" key={l.id}>
                      <b>{l.name || "(no name)"}</b>
                      <br />
                      {l.build || l.source} · ₦{(+l.amount || 0).toLocaleString()}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} style={{ background: "transparent", color: "var(--g2)", border: 0 }}>
                          {salesStages.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

        {view === "Contacts" && (
          <div className="wc">
            <table className="tb2">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Project</th>
                  <th>Stage</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name || "(no name)"}</td>
                    <td>{l.email}</td>
                    <td>{l.source}</td>
                    <td>{l.build}</td>
                    <td>
                      <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                        {salesStages.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(l.ts).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={6}>No contacts match.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {view === "Inbox" && (
          <div className="cv3 wc" style={{ padding: 0 }}>
            <div className="cl3">
              {filtered.slice(0, 30).map((l, i) => (
                <button key={l.id} className={i === 0 ? "on" : ""} onClick={() => setMsg("")}>
                  <span className="av3">{(l.name || l.email || "?").slice(0,1).toUpperCase()}</span>
                  <span>
                    <b>{l.name || l.email}</b>
                    <span style={{ fontSize: ".74rem", color: "var(--mute)", display: "block" }}>
                      {l.msgs?.[l.msgs.length - 1]?.t || "No message yet"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="th3">
              <div className="hh2">
                <b>{filtered[0]?.name || filtered[0]?.email || "Inbox"}</b> · {filtered[0]?.email}
              </div>
              <div className="ms3">
                {(filtered[0]?.msgs ?? []).map((m, i) => (
                  <div className="m3" key={i} style={{ alignSelf: m.who === "owner" ? "flex-end" : "flex-start" }}>
                    {m.t}
                  </div>
                ))}
                {!(filtered[0]?.msgs ?? []).length && (
                  <p style={{ color: "var(--mute)" }}>No messages yet — write the first one below.</p>
                )}
              </div>
              <div className="cp3">
                <input
                  placeholder="Write a message…"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && filtered[0] && sendMessage(filtered[0])}
                />
                <button className="bt3" onClick={() => filtered[0] && sendMessage(filtered[0])}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "Calendar" && (
          <>
            <div className="wc">
              <h4>Add event or call</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent((v) => ({ ...v, title: e.target.value }))} style={{ background: "var(--glass)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 10, padding: "8px 12px" }} />
                <input type="datetime-local" value={newEvent.date} onChange={(e) => setNewEvent((v) => ({ ...v, date: e.target.value }))} style={{ background: "var(--glass)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 10, padding: "8px 12px" }} />
                <button className="bt3" onClick={addEvent}>
                  Add
                </button>
              </div>
            </div>
            <div className="wc">
              <h4>
                {new Date(year, month).toLocaleString(undefined, { month: "long", year: "numeric" })}
              </h4>
              <div className="cal">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div className="dh" key={d}>
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const k = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                  const items = callDays.get(k) ?? [];
                  return (
                    <div key={k} className={items.length ? "td" : ""}>
                      {i + 1}
                      {items.slice(0, 2).map((t, j) => (
                        <span className="ev" key={j}>
                          {t}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {view === "Keywords" && (
          <>
            <div className="wc">
              <h4>Add a custom keyword</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  placeholder="e.g. crm for real estate lagos"
                  value={newKw}
                  onChange={(e) => setNewKw(e.target.value)}
                  style={{ background: "var(--glass)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 100, padding: "8px 16px", flex: 1, minWidth: 220 }}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                />
                <button className="bt3" onClick={addKeyword}>
                  Add
                </button>
              </div>
            </div>
            <div className="wc">
              <h4>Keyword bank ({keywords.length})</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 8 }}>
                {keywords
                  .filter((k) => k.keyword.includes(q.toLowerCase()))
                  .map((k) => (
                    <div className="lc" key={k.id}>
                      {k.keyword}
                      <div>
                        <small style={{ color: "var(--mute)" }}>{k.custom ? "custom" : k.category}</small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {view === "Community" && (
          <>
            <div className="wc">
              <h4>Members ({members.length})</h4>
              <table className="tb2">
                <tbody>
                  {members.map((m) => (
                    <tr key={m.user_id}>
                      <td>{m.name}</td>
                      <td style={{ color: "var(--mute)" }}>Joined {new Date(m.joined_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!members.length && <tr><td>No members yet.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="wc">
              <h4>Recent posts ({posts.length})</h4>
              {posts.map((p) => (
                <div key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                  <b>{p.author_name}</b> <small style={{ color: "var(--mute)" }}>{p.category} · {new Date(p.created_at).toLocaleDateString()}</small>
                  <p style={{ margin: 0, fontSize: ".86rem" }}>{p.content}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "Reviews" && (
          <div className="wc">
            <h4>Reviews ({reviews.length})</h4>
            <table className="tb2">
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}{r.company ? `, ${r.company}` : ""}</td>
                    <td>{"★".repeat(Math.max(1, Math.min(5, r.rating || 5)))}</td>
                    <td style={{ whiteSpace: "normal" }}>{r.text}</td>
                  </tr>
                ))}
                {!reviews.length && <tr><td>No reviews yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {view === "Analytics" && (
          <>
            <div className="kp">
              {kpi("Leads by source", leads.length)}
              {kpi("From AI chat", leads.filter((l) => l.source === "ai-chat").length)}
              {kpi("From community", leads.filter((l) => l.source === "community").length)}
              {kpi("From website", leads.filter((l) => !["ai-chat", "community"].includes(l.source ?? "")).length)}
            </div>
            <div className="wc">
              <h4>Leads captured (last 14 days)</h4>
              <Sparkline
                data={Array.from({ length: 14 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (13 - i));
                  const k = d.toISOString().slice(0, 10);
                  return leads.filter((l) => l.ts.slice(0, 10) === k).length;
                })}
              />
            </div>
            <div className="wc">
              <h4>Funnel</h4>
              <div className="fn" style={{ height: 180 }}>
                {funnelStages.map((s) => {
                  const n = leads.filter((l) => l.status === s).length;
                  const max = Math.max(1, ...funnelStages.map((x) => leads.filter((l) => l.status === x).length));
                  return (
                    <div key={s}>
                      <i style={{ height: `${Math.max(4, (n / max) * 140)}px` }} />
                      <span>
                        {s} ({n})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const w = 440;
  const h = 140;
  const pts = data.map((v, i) => `${20 + (i * (w - 40)) / (data.length - 1)},${h - 20 - (v / max) * (h - 40)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 160 }}>
      <polyline points={pts.join(" ")} fill="none" stroke="#22c55e" strokeWidth="2.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="2.5" fill="#22c55e" />
      ))}
    </svg>
  );
}
