import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { blogPosts } from "@/data/content";
import { PageIntro } from "@/components/pages/faq-list";
import { DynamicLink } from "@/components/site/bits";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog | Benji Agency" },
      {
        name: "description",
        content: "Practical articles on websites, SEO, automation and AI from the Benji Agency team.",
      },
      { property: "og:title", content: "Blog | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function BlogIndex() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = ["All", ...Array.from(new Set(blogPosts.map((b) => b.cat)))];
  const featured = blogPosts.slice(0, 3);
  const rest = blogPosts.filter(
    (b) => (cat === "All" || b.cat === cat) && `${b.title}${b.excerpt}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageIntro title="Growth insights" kicker="Blog" desc="Practical articles on websites, SEO, automation and AI." />
      <section>
        <div className="c">
          <div className="bgrid">
            {featured.map((b) => (
              <DynamicLink key={b.slug} to={`/blog/${b.slug}`} className="bf" style={{ ["--art" as string]: b.art, background: b.art }}>
                <div>
                  <span className="tag">{b.cat}</span>
                  <h3>{b.title}</h3>
                </div>
              </DynamicLink>
            ))}
          </div>
          <h2 style={{ margin: "50px 0 20px" }}>All articles</h2>
          <div className="bc" id="bc">
            {cats.map((c) => (
              <button key={c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
            <input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="bg3" id="bl">
            {rest.map((b) => (
              <DynamicLink key={b.slug} to={`/blog/${b.slug}`} className="bp rv in">
                <div className="im" style={{ background: b.art }}>
                  <span className="tag">{b.cat}</span>
                  {b.emoji}
                </div>
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
                <div className="au">
                  <i>B</i> Benji Agency
                </div>
              </DynamicLink>
            ))}
            {!rest.length && <p style={{ color: "var(--mute)" }}>No articles match your search.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
