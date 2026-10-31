import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { menu } from "@/data/content";
import { slugify } from "@/data/pages";
import { useJoinModal } from "@/components/site/join-modal";

export function SiteFooter() {
  const fwtRef = useRef<HTMLDivElement>(null);
  const join = useJoinModal();

  useEffect(() => {
    const el = fwtRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && el.classList.add("in")),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const flipTheme = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("bt", next);
    } catch {
      /* ignore */
    }
  };

  const sectionFor = (t: string) => t.toLowerCase();

  return (
    <footer>
      <div className="c">
        <div className="fg">
          <div>
            <Link to="/" className="logo" style={{ color: "#fff" }}>
              BEN<i>JI</i>
            </Link>
            <p style={{ marginTop: 14, maxWidth: 280 }}>
              Websites, AI agents and automation for businesses that want to grow.
            </p>
          </div>
          {menu
            .filter((m) => m.c)
            .map((m) => (
              <div key={m.t}>
                <h4>{m.t}</h4>
                {m.t === "Portfolio" ? (
                  <Link to="/portfolio">Portfolio</Link>
                ) : m.t === "Blog" ? (
                  <Link to="/blog">Blog</Link>
                ) : (
                  (m.c ?? [])[0][1].slice(0, 4).map(([title]) => (
                    <Link key={title} to={`/${sectionFor(m.t)}/${slugify(title)}`}>
                      {title}
                    </Link>
                  ))
                )}
              </div>
            ))}
        </div>
        <div className="fwr">
          <div className="fwt" id="fwt" ref={fwtRef}>
            <div className="fwm">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i}>BENJI AGENCY</span>
              ))}
            </div>
          </div>
        </div>
        <div className="cp2">
          <span>© 2026 Benji Agency. All rights reserved.</span>
          <span className="fx">
            <button className="btn s" onClick={flipTheme}>
              ◐ Theme
            </button>
            <span>Privacy · Terms</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
