import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { menu } from "@/data/content";
import { megaFeatHref, slugify } from "@/data/pages";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useJoinModal } from "@/components/site/join-modal";
import { DynamicLink } from "@/components/site/bits";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const navigate = useNavigate();
  const join = useJoinModal();

  useEffect(() => {
    const sc = () => setScrolled(window.scrollY > 40);
    sc();
    window.addEventListener("scroll", sc, { passive: true });
    return () => window.removeEventListener("scroll", sc);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    document.getElementById("scrim")?.classList.toggle("on", mobileOpen);
  }, [mobileOpen]);

  const hoverable = () =>
    typeof window !== "undefined" && window.matchMedia("(hover:hover) and (min-width:1201px)").matches;

  const open = (t: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(t);
  };
  const close = () => setOpenMenu(null);
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, 180);
  };

  const flipTheme = () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("bt", next);
    } catch {
      /* ignore */
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAcctOpen(false);
    navigate({ to: "/" });
  };

  const navClick = () => setMobileOpen(false);

  return (
    <>
      <div id="scrim" onClick={() => setMobileOpen(false)} />
      <header id="h" className={scrolled ? "sc" : ""}>
        <div className="nb">
          <Link to="/" className="logo" onClick={navClick}>
            BEN<i>JI</i>
          </Link>
          <nav id="nav" className={mobileOpen ? "open" : ""}>
            <ul id="menu">
              {menu.map((m) => {
                const target = m.h === "#p-portfolio" ? "/portfolio" : m.h === "#p-blog" ? "/blog" : null;
                if (!m.c) {
                  return (
                    <li key={m.t}>
                      <Link to={target ?? "/"} className="t" onClick={navClick}>
                        {m.t}
                      </Link>
                    </li>
                  );
                }
                const isOpen = openMenu === m.t;
                const cols = m.c.length;
                return (
                  <li
                    key={m.t}
                    className={isOpen ? "o" : ""}
                    onMouseEnter={() => hoverable() && open(m.t)}
                    onMouseLeave={() => hoverable() && scheduleClose()}
                  >
                    <button
                      className="t d"
                      aria-expanded={isOpen}
                      onClick={() => {
                        if (m.t === "Community" && window.innerWidth > 1200) {
                          close();
                          navigate({ to: "/community" });
                          return;
                        }
                        isOpen ? close() : open(m.t);
                      }}
                    >
                      {m.t}
                    </button>
                    <div
                      className="mega glass"
                      style={{ gridTemplateColumns: `repeat(${cols},1fr) 1.1fr` }}
                    >
                      {m.c.map(([heading, links]) => (
                        <div key={heading}>
                          <h4>{heading}</h4>
                          {links.map(([title, desc]) => (
                            <DynamicLink
                              key={title}
                              className="i"
                              to={
                                m.t === "Community"
                                  ? "/community"
                                  : `/${(m.t || "services").toLowerCase()}/${slugify(title)}`
                              }
                              onClick={() => {
                                close();
                                navClick();
                              }}
                            >
                              <i className="ic">{title[0]}</i>
                              <span className="tx">
                                <b>{title}</b>
                                <span>{desc}</span>
                              </span>
                            </DynamicLink>
                          ))}
                        </div>
                      ))}
                      {m.f && (
                        <DynamicLink
                          className="feat"
                          to={megaFeatHref(m)}
                          style={{ ["--art" as string]: m.f[2] }}
                          onClick={() => {
                            close();
                            navClick();
                          }}
                        >
                          <b>{m.f[0]}</b>
                          <span>{m.f[1]}</span>
                        </DynamicLink>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="nr">
            {user ? (
              <div className="acct">
                <button className="cp" onClick={() => setAcctOpen((v) => !v)}>
                  {(profile?.display_name || user.email || "?").split("@")[0]} ▾
                </button>
                {acctOpen && (
                  <div className="ad glass on ownonly">
                    <div className="ab">
                      <Link to="/account" className="btn s" onClick={() => setAcctOpen(false)}>
                        My account
                      </Link>
                      {isAdmin && (
                        <DynamicLink to="/admin" className="btn p">
                          <span onClick={() => setAcctOpen(false)}>Owner console</span>
                        </DynamicLink>
                      )}
                    </div>
                    <div className="ab" style={{ marginTop: 8 }}>
                      <button className="btn s" onClick={signOut}>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" search={{ redirect: "/" }} className="cp" onClick={navClick}>
                Sign in
              </Link>
            )}
            <button
              className="cp"
              onClick={() => {
                navClick();
                join.open("Contact Benji Agency", "contact");
              }}
            >
              Contact
            </button>
            <button
              className="btn p"
              onClick={() => {
                navClick();
                join.open("Book a free strategy call", "call");
              }}
            >
              Get in touch
            </button>
            <button className="tg" aria-label="Switch theme" onClick={flipTheme}>
              ◐
            </button>
            <button className="bg" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
