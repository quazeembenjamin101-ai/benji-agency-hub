import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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
  msgs: { t: string; who: string; ts?: string }[] | null;
  ts: string;
};
type Member = { user_id: string; name: string; joined_at: string };
type Post = { id: string; author_name: string; category: string; content: string; created_at: string };
type Review = { id: string; name: string; company: string | null; rating: number; text: string; created_at: string };
type Keyword = { id: number; keyword: string; category: string; custom: boolean };
type EventRow = { id: string; title: string; event_at: string; kind: string };

const fmt = (ts: string) => new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const money = (n: number) => (n ? `$${n.toLocaleString()}` : "—");

export const Route = createFileRoute("/_authenticated/_admin/dashboard")({
  component: AdminCrm,
  head: () => ({
    meta: [
      { title: "Owner Dashboard | Benji Agency" },
      { property: "og:title", content: "Owner Dashboard | Benji Agency" },
      { property: "og:type", content: "website" },
    ],
  }),
});

const VIEWS = ["Inbox", "Pipeline", "Bookings", "Keywords", "Reviews", "Analytics"] as const;

function AdminCrm() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Inbox");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sel, setSel] = useState(0);
  const [msg, setMsg] = useState("");
  const [newKw, setNewKw] = useState("");

  const load = useCallback(async () => {
    const [l, m, p, r, k, e] = await Promise.all([
      supabase.from("leads").select("*").order("ts", { ascending: false }).limit(500),
      supabase.from("members").select("user_id,name,joined_at").order("joined_at", { ascending: false }).limit(500),
      supabase.from("posts").select("id,author_name,category,content,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("keywords").select("*").order("id").limit(1000),
      supabase.from("events").select("*").order("event_at", { ascending: true }).limit(100),
    ]);
    if (l.data) setLeads(l.data as unknown as Lead[]);
    if (m.data) setMembers(m.data);
    if (p.data) setPosts(p.data);
    if (r.data) setReviews(r.data);
    if (k.data) setKeywords(k.data);
    if (e.data) setEvents(e.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  };

  const sendMessage = async (lead: Lead) => {
    if (!msg.trim()) return;
    const msgs = [...(lead.msgs ?? []), { t: msg.trim(), who: "owner", ts: new Date().toISOString() }];
    await supabase.from("leads").update({ msgs }).eq("id", lead.id);
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, msgs } : l)));
    setMsg("");
  };

  const addKeyword = async () => {
    const kw = newKw.trim();
    if (!kw) return;
    const { data } = await supabase.from("keywords").insert({ keyword: kw, category: "Custom", custom: true }).select().single();
    if (data) setKeywords((ks) => [...ks, data as Keyword]);
    setNewKw("");
  };

  const filtered = leads;
  const current = filtered[sel];

  const pipelineValue = funnelStages.reduce((sum, s) => sum + leads.filter((l) => l.status === s).reduce((a, l) => a + (l.amount || 0), 0), 0);
  const won = leads.filter((l) => l.status === "Won");

  return (
    <div className="crm">
      <aside className="pn glass">
        <h2 className="logo" style={{ color: "#fff" }}>
          BEN<i>JI</i> <small style={{ fontSize: ".7rem", opacity: 0.7 }}>Owner</small>
        </h2>
        <nav>
          {VIEWS.map((v) => (
            <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
              {v}
              {v === "Inbox" && leads.length ? ` (${leads.length})` : ""}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: "auto", fontSize: ".8rem", color: "var(--mute)" }}>
          <div>Leads: {leads.length}</div>
          <div>Members: {members.length}</div>
          <div>Posts: {posts.length}</div>
        </div>
        <a href="/account" className="btn s" style={{ marginTop: 10, justifyContent: "center" }}>
          My account
        </a>
      </aside>
      <main className="cm">
        {view === "Inbox" && (
          <div className="cv3 wc" style={{ padding: 0 }}>
            <div className="cl3">
              {filtered.slice(0, 40).map((l, i) => (
                <button key={l.id} className={i === sel ? "on" : ""} onClick={() => setSel(i)}>
                  <span className="av3">{(l.name || l.email || "?").slice(0, 1).toUpperCase()}</span>
                  <span>
                    <b>{l.name || l.email}</b>
                    <span style={{ fontSize: ".74rem", color: "var(--mute)", display: "block" }}>
                      {l.msgs?.[l.msgs.length - 1]?.t || "No message yet"}
                    </span>
                  </span>
                  <small>{fmt(l.ts)}</small>
                </button>
              ))}
              {!filtered.length && <p style={{ padding: 16 }}>No leads yet — they arrive the moment someone submits a form.</p>}
            </div>
            <div className="cd3">
              {current && (
                <>
                  <div className="cv3b" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
                    <span className="av3">{(current.name || current.email || "?").slice(0, 1).toUpperCase()}</span>
                    <div style={{ flex: 1 }}>
                      <b>{current.name || current.email}</b>
                      <div style={{ fontSize: ".78rem", color: "var(--mute)" }}>
                        {current.email} · {current.source} · {money(current.amount)}
                      </div>
                    </div>
                    <select value={current.status} onChange={(e) => setStatus(current.id, e.target.value)} className="inp">
                      {salesStages.map((s) => (
                        <option key={s} value={s}>
                          {stageLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ padding: 18, display: "grid", gap: 10, overflow: "auto" }}>
                    <p style={{ fontSize: ".9rem" }}>
                      <b>Project:</b> {current.build || "—"}
                    </p>
                    {current.call_when && (
                      <p style={{ fontSize: ".9rem" }}>
                        <b>Call:</b> {new Date(current.call_when).toLocaleString()}
                      </p>
                    )}
                    {(current.msgs ?? []).map((m, i) => (
                      <div key={i} className={m.who === "owner" ? "bub me" : "bub"}>
                        {m.t}
                      </div>
                    ))}
                    {!(current.msgs ?? []).length && <p style={{ color: "var(--mute)" }}>No messages yet.</p>}
                  </div>
                  <div style={{ display: "flex", gap: 8, padding: "12px 18px", borderTop: "1px solid var(--line)" }}>
                    <input
                      className="inp"
                      style={{ flex: 1 }}
                      placeholder="Type a reply…"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(current)}
                    />
                    <button className="btn p" onClick={() => sendMessage(current)}>
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {view === "Pipeline" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div className="grid4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
              {funnelStages.map((s) => (
                <div className="card glass" key={s}>
                  <small>{stageLabels[s]}</small>
                  <h2 style={{ margin: "6px 0 0" }}>{leads.filter((l) => l.status === s).length}</h2>
                  <div style={{ fontSize: ".8rem", color: "var(--mute)" }}>{money(leads.filter((l) => l.status === s).reduce((a, l) => a + (l.amount || 0), 0))}</div>
                </div>
              ))}
            </div>
            <div className="card glass" style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".88rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--mute)" }}>
                    <th style={{ padding: 10 }}>Lead</th>
                    <th>Source</th>
                    <th>Value</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ padding: 10 }}>{l.name || l.email}</td>
                      <td>{l.source}</td>
                      <td>{money(l.amount)}</td>
                      <td>
                        <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="inp" style={{ padding: "4px 8px" }}>
                          {salesStages.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === "Bookings" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h3>Strategy calls</h3>
            {leads.filter((l) => l.call_when).length ? (
              leads
                .filter((l) => l.call_when)
                .map((l) => (
                  <div className="card glass" key={l.id}>
                    <b>{l.name || l.email}</b> — {new Date(l.call_when!).toLocaleString()}
                    <span style={{ color: "var(--mute)" }}> · {stageLabels[l.status] ?? l.status}</span>
                  </div>
                ))
            ) : (
              <p style={{ color: "var(--mute)" }}>No calls booked yet.</p>
            )}
            <h3>Upcoming events</h3>
            {events.length ? (
              events.map((e) => (
                <div className="card glass" key={e.id}>
                  <b>{e.title}</b> · {fmt(e.event_at)} · {e.kind}
                </div>
              ))
            ) : (
              <p style={{ color: "var(--mute)" }}>No events scheduled.</p>
            )}
          </div>
        )}

        {view === "Keywords" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="inp" style={{ flex: 1 }} placeholder="Add a keyword to track…" value={newKw} onChange={(e) => setNewKw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()} />
              <button className="btn p" onClick={addKeyword}>
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {keywords.map((k) => (
                <span key={k.id} className="chip" style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "4px 12px", fontSize: ".8rem" }}>
                  {k.keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {view === "Reviews" && (
          <div style={{ display: "grid", gap: 12 }}>
            {reviews.map((r) => (
              <div className="card glass" key={r.id}>
                <b>{r.name}</b> {r.company ? `· ${r.company}` : ""} · {"★".repeat(r.rating)}
                <p>{r.text}</p>
              </div>
            ))}
            {!reviews.length && <p style={{ color: "var(--mute)" }}>No reviews yet.</p>}
          </div>
        )}

        {view === "Analytics" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
              <div className="card glass">
                <small>Total pipeline</small>
                <h2 style={{ margin: "6px 0 0" }}>{money(pipelineValue)}</h2>
              </div>
              <div className="card glass">
                <small>Won</small>
                <h2 style={{ margin: "6px 0 0" }}>{won.length}</h2>
                <div style={{ fontSize: ".8rem", color: "var(--mute)" }}>{money(won.reduce((a, l) => a + (l.amount || 0), 0))}</div>
              </div>
              <div className="card glass">
                <small>Community members</small>
                <h2 style={{ margin: "6px 0 0" }}>{members.length}</h2>
              </div>
              <div className="card glass">
                <small>Community posts</small>
                <h2 style={{ margin: "6px 0 0" }}>{posts.length}</h2>
              </div>
            </div>
            <div className="card glass">
              <h3>Recent posts</h3>
              {posts.slice(0, 8).map((p) => (
                <p key={p.id} style={{ borderBottom: "1px solid var(--line)", padding: "8px 0" }}>
                  <b>{p.author_name}</b> · {p.category} · {fmt(p.created_at)}
                  <br />
                  <span style={{ color: "var(--mute)" }}>{p.content.slice(0, 120)}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
