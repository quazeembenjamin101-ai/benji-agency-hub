import type { ReactNode } from "react";

export function FaqList({ items }: { items: [string, string][] | { q: string; a: string }[] }) {
  return (
    <div className="fq">
      {items.map((item) => {
        const q = Array.isArray(item) ? item[0] : item.q;
        const a = Array.isArray(item) ? item[1] : item.a;
        return (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        );
      })}
    </div>
  );
}

export function PageIntro({
  title,
  desc,
  kicker = "Benji Agency",
  actions,
}: {
  title: ReactNode;
  desc?: string;
  kicker?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="pgh">
      <div className="c" style={{ position: "relative" }}>
        <span className="k">{kicker}</span>
        <h1>{title}</h1>
        {desc && <p className="l">{desc}</p>}
        {actions && <div className="ctas" style={{ justifyContent: "flex-start" }}>{actions}</div>}
      </div>
    </section>
  );
}
