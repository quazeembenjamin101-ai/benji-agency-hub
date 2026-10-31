import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { communityCategories, communityTopics } from "@/data/content";
import { useAuth } from "@/lib/auth";
import { useJoinModal } from "@/components/site/join-modal";
import { PageIntro } from "@/components/pages/faq-list";

type Post = {
  id: string;
  user_id: string | null;
  author_name: string;
  category: string;
  content: string;
  pinned: boolean;
  created_at: string;
};
type Comment = { id: string; post_id: string; author_name: string; content: string; created_at: string };
type Like = { post_id: string; user_id: string };

export const Route = createFileRoute("/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "Benji Community | Benji Agency" },
      {
        name: "description",
        content:
          "The Benji community: discussions, showcase, classroom tracks, events and the AI assistant — free for members.",
      },
      { property: "og:title", content: "Benji Community | Benji Agency" },
      {
        property: "og:description",
        content: "Discussions, showcase, classroom tracks, events and the AI assistant — free for members.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const av = (n?: string | null) => (
  <div className="av">{(n || "?").slice(0, 1).toUpperCase()}</div>
);

function CommunityPage() {
  const [tab, setTab] = useState("Community");
  const [cat, setCat] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [members, setMembers] = useState<{ user_id: string; name: string }[]>([]);
  const [events, setEvents] = useState<{ id: string; title: string; event_at: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [draftCat, setDraftCat] = useState("General");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const { user, profile } = useAuth();
  const join = useJoinModal();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const [p, m, l, c, e] = await Promise.all([
      supabase.from("posts").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(100),
      supabase.from("members").select("user_id,name").limit(500),
      supabase.from("post_likes").select("post_id,user_id").limit(5000),
      supabase.from("post_comments").select("id,post_id,author_name,content,created_at").order("created_at", { ascending: true }).limit(500),
      supabase.from("events").select("id,title,event_at").gte("event_at", new Date().toISOString()).order("event_at").limit(50),
    ]);
    if (p.data) setPosts(p.data);
    if (m.data) setMembers(m.data);
    if (l.data) setLikes(l.data);
    if (c.data) setComments(c.data);
    if (e.data) setEvents(e.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Member";
  const myLikes = new Set(likes.filter((l) => l.user_id === user?.id).map((l) => l.post_id));
  const likeCount = (id: string) => likes.filter((l) => l.post_id === id).length;

  const requireAuth = () => {
    if (user) return true;
    navigate({ to: "/auth", search: { redirect: "/community" } });
    return false;
  };

  const submitPost = async () => {
    const content = draft.trim();
    if (!content || !requireAuth()) return;
    const { data } = await supabase
      .from("posts")
      .insert({ user_id: user!.id, author_name: displayName, category: draftCat, content: content.slice(0, 1000) })
      .select()
      .single();
    if (data) {
      setPosts((ps) => [data, ...ps]);
      setDraft("");
      if (user) await supabase.from("members").upsert({ user_id: user.id, name: displayName });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!requireAuth()) return;
    if (myLikes.has(postId)) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user!.id);
      setLikes((ls) => ls.filter((l) => !(l.post_id === postId && l.user_id === user!.id)));
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user!.id });
      setLikes((ls) => [...ls, { post_id: postId, user_id: user!.id }]);
    }
  };

  const submitComment = async (postId: string) => {
    const content = commentDraft.trim();
    if (!content || !requireAuth()) return;
    const { data } = await supabase
      .from("post_comments")
      .insert({ post_id: postId, user_id: user!.id, author_name: displayName, content: content.slice(0, 500) })
      .select()
      .single();
    if (data) {
      setComments((cs) => [...cs, data]);
      setCommentDraft("");
    }
  };

  const feed = posts.filter((p) => cat === "All" || p.category === cat);
  const leaders = Object.entries(
    posts.reduce<Record<string, number>>((acc, p) => {
      acc[p.author_name] = (acc[p.author_name] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sidebar = (
    <aside className="ska">
      <div className="skc glass">
        <div className="cv2" style={{ background: "radial-gradient(circle at 70% 25%,#22c55e99,transparent 55%),linear-gradient(135deg,#052e16,#030a06)", height: 120 }} />
        <div className="bx2">
          <h3>Benji Community</h3>
          <p style={{ color: "var(--mute)", fontSize: ".86rem", marginTop: 8 }}>
            Learn, share wins and get help building websites, AI agents and automation.
          </p>
          <div className="sts">
            <div>
              <b>{members.length}</b>
              <small>Members</small>
            </div>
            <div>
              <b>{posts.length}</b>
              <small>Posts</small>
            </div>
            <div>
              <b>1</b>
              <small>Admin</small>
            </div>
          </div>
          {!user && (
            <button className="btn p" style={{ width: "100%", justifyContent: "center" }} onClick={() => join.open("Join the Benji community", "community")}>
              Join the community
            </button>
          )}
          <button className="btn s" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => document.getElementById("bot")?.click()}>
            Ask the AI assistant
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <PageIntro
        title="Benji Community"
        desc="A friendly space to learn, share wins and get help with websites, AI agents, automation and growth."
        kicker="Community"
      />
      <section>
        <div className="c" style={{ maxWidth: 1180 }}>
          <div className="skt">
            <b>Benji Community</b>
            {communityTopics.map((t) => (
              <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            {tab === "Community" && (
              <div className="skg">
                <div>
                  <div className="skc glass">
                    <textarea
                      id="pt2"
                      maxLength={1000}
                      placeholder={user ? "Write something…" : "Sign in to post…"}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <select id="pc2" value={draftCat} onChange={(e) => setDraftCat(e.target.value)}>
                        {communityCategories.slice(1).map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <button className="btn p" id="pp2" style={{ height: 40, minWidth: 110 }} onClick={submitPost}>
                        Post
                      </button>
                    </div>
                  </div>
                  <div className="bc" id="cc">
                    {communityCategories.map((c) => (
                      <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div id="fd">
                    {(cat === "All" ? feed : feed).map((p) => (
                      <div className="skc glass" key={p.id}>
                        {p.pinned && <span className="pin">📌 PINNED</span>}
                        <div className="po">
                          {av(p.author_name)}
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ margin: 0 }}>{p.author_name}</h4>
                            <small style={{ color: "var(--mute)" }}>
                              {p.category} · {new Date(p.created_at).toLocaleDateString()}
                            </small>
                            <p style={{ margin: "10px 0", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{p.content}</p>
                            <div className="act">
                              <button className={myLikes.has(p.id) ? "on" : ""} onClick={() => toggleLike(p.id)}>
                                ♥ {likeCount(p.id) || ""}
                              </button>
                              <button onClick={() => setOpenComments(openComments === p.id ? null : p.id)}>
                                💬 {comments.filter((c) => c.post_id === p.id).length || ""} Comments
                              </button>
                            </div>
                            {openComments === p.id && (
                              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                                {comments
                                  .filter((c) => c.post_id === p.id)
                                  .map((c) => (
                                    <div key={c.id} style={{ display: "flex", gap: 8 }}>
                                      {av(c.author_name)}
                                      <div>
                                        <b style={{ fontSize: ".85rem" }}>{c.author_name}</b>
                                        <p style={{ margin: 0, fontSize: ".88rem" }}>{c.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                {user ? (
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <input
                                      value={commentDraft}
                                      onChange={(e) => setCommentDraft(e.target.value)}
                                      placeholder="Write a comment…"
                                      maxLength={500}
                                      style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid var(--line)", borderRadius: 100, padding: "10px 16px", color: "#fff", outline: 0 }}
                                      onKeyDown={(e) => e.key === "Enter" && submitComment(p.id)}
                                    />
                                    <button className="btn p" style={{ minWidth: 0, padding: "0 16px", height: 40 }} onClick={() => submitComment(p.id)}>
                                      Send
                                    </button>
                                  </div>
                                ) : (
                                  <small style={{ color: "var(--mute)" }}>Sign in to comment.</small>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {!feed.length && <p style={{ color: "var(--mute)" }}>No posts in this category yet.</p>}
                  </div>
                </div>
                {sidebar}
              </div>
            )}

            {tab === "Classroom" && (
              <div className="cl">
                {[
                  ["Getting started with Benji", "Welcome, tools and how the community works"],
                  ["Build a website that converts", "Structure, copy and SEO basics"],
                  ["Automate with AI", "Agents, workflows and integrations"],
                ].map(([a, b], i) => (
                  <div className="card glass" key={a}>
                    <div className="cv2" style={{ height: 120, background: "radial-gradient(circle at 70% 25%,#22c55e88,transparent 55%),linear-gradient(135deg,#064e3b,#030a06)" }} />
                    <div className="bx2">
                      <h3>{a}</h3>
                      <p>{b}</p>
                      <small style={{ color: "var(--g2)" }}>Course content coming soon</small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "Calendar" && (
              <div className="skc glass">
                <h3>Upcoming events</h3>
                {events.length ? (
                  events.map((e) => (
                    <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                      <span>{e.title}</span>
                      <small style={{ color: "var(--g2)" }}>{new Date(e.event_at).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--mute)", marginTop: 10 }}>
                    No events scheduled yet. Weekly Q&A sessions and workshops will appear here.
                  </p>
                )}
              </div>
            )}

            {tab === "Members" && (
              <div className="mem">
                {members.length ? (
                  members.map((m) => (
                    <div className="skc glass" key={m.user_id}>
                      {av(m.name)}
                      <b>{m.name}</b>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--mute)" }}>No members yet. Be the first to join.</p>
                )}
              </div>
            )}

            {tab === "Leaderboards" && (
              <div className="skc glass lb">
                <h3>Top contributors</h3>
                {leaders.length ? (
                  leaders.map(([n, v], i) => (
                    <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0" }}>
                      {i + 1}. {av(n)}
                      <b>{n}</b>
                      <span style={{ marginLeft: "auto" }}>{v} posts</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--mute)", marginTop: 10 }}>No posts yet.</p>
                )}
              </div>
            )}

            {tab === "About" && (
              <div className="skg">
                <div className="skc glass">
                  <h3>About this community</h3>
                  <p style={{ color: "var(--mute)", marginTop: 10 }}>
                    A friendly space to learn, share wins and get help with websites, AI agents, automation and
                    growth. Join for discussions, templates, events and the AI assistant.
                  </p>
                </div>
                {sidebar}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
