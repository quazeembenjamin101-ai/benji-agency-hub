import { useEffect, useRef, useState } from "react";

/** Reveal-on-scroll: observes `.rv` elements inside the returned ref. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".rv"));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

export function Counter({ n, suffix = "" }: { n: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const start = performance.now();
          const f = (t: number) => {
            const p = Math.min((t - start) / 1800, 1);
            setV(Math.round(n * (1 - Math.pow(1 - p, 4))));
            if (p < 1) requestAnimationFrame(f);
          };
          requestAnimationFrame(f);
        }),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  const tail = n === 120 ? "+" : n === 24 ? "h" : suffix;
  return (
    <span ref={ref}>
      {v}
      {tail}
    </span>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="k">{children}</span>;
}

export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="hd rv">
      <Kicker>{kicker}</Kicker>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/** Sticky-stack growth arc card (source: .sk with --i). */
export function ArcCard({
  index,
  letter,
  label,
  title,
  body,
  chips,
  href,
}: {
  index: number;
  letter: string;
  label: string;
  title: string;
  body: string;
  chips: string[];
  href: string;
}) {
  return (
    <div className="sk" style={{ ["--i" as string]: index }}>
      <i className="ic">{letter}</i>
      <small>
        0{index + 1} · {label.toUpperCase()}
      </small>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="chips">
        {chips.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <a className="fb" style={{ display: "inline-block" }} href={href}>
        Explore how →
      </a>
    </div>
  );
}
