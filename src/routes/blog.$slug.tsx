import { createFileRoute, notFound } from "@tanstack/react-router";
import { DynamicLink } from "@/components/site/bits";
import { blogPosts } from "@/data/content";
import { LeadEmailForm } from "@/components/site/lead-form";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = blogPosts.find((b) => b.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.post.title} | Benji Agency` : "Article | Benji Agency" },
      { name: "description", content: loaderData?.post.excerpt ?? "Benji Agency article." },
      { property: "og:title", content: loaderData?.post.title ?? "Article" },
      { property: "og:description", content: loaderData?.post.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const more = blogPosts.filter((b) => b.slug !== post.slug).slice(0, 3);
  return (
    <>
      <section className="pgh">
        <div className="c art">
          <DynamicLink to="/blog" style={{ color: "var(--g2)" }}>
            ← All articles
          </DynamicLink>
          <div className="cv" style={{ background: post.art, marginTop: 20, aspectRatio: "16/8" }}>
            <span className="tag">{post.cat}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>
      <section>
        <div className="c art">
          <p>
            This is the start of the article. The full playbook covers the strategy, the exact steps we follow
            for clients and the tools we use, written so you can execute it yourself or hand it to your team.
          </p>
          <p>
            Want the complete version? Subscribe below and we will send it over, along with a monthly email of
            practical growth tips on websites, SEO, automation and AI.
          </p>
          <LeadEmailForm source={`blog:${post.slug}`} button="Send me the article" />
          <h2 style={{ margin: "50px 0 20px" }}>Keep reading</h2>
          <div className="grid3">
            {more.map((b) => (
              <DynamicLink key={b.slug} to={`/blog/${b.slug}`} className="card glass">
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
              </DynamicLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
