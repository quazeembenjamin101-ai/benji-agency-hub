import { useEffect, useRef, useState } from "react";
import { botActions, botImage } from "@/data/content";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["What can you build for me?", "Give me an SEO checklist", "Book a strategy call"];

export function BenjiBot() {
  const [panelOn, setPanelOn] = useState(false);
  const [history, setHistory] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [anim, setAnim] = useState("");
  const [bubble, setBubble] = useState(true);
  const msRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setBubble(false), 9000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    msRef.current?.scrollTo({ top: 1e9 });
  }, [history, busy]);

  const scrollMs = () => requestAnimationFrame(() => msRef.current?.scrollTo({ top: 1e9 }));

  async function send(q: string) {
    if (busy || !q.trim()) return;
    setBusy(true);
    const next: Msg[] = [...history, { role: "user", content: q }];
    setHistory(next);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: next.slice(-12) }),
    });
    if (!res.ok || !res.body) {
      setHistory([...next, { role: "assistant", content: "The assistant is not available right now. Use the contact button to reach the team." }]);
      setBusy(false);
      return;
    }
    setHistory([...next, { role: "assistant", content: "" }]);
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += dec.decode(value, { stream: true });
      setHistory([...next, { role: "assistant", content: text }]);
      scrollMs();
    }
    if (text && "speechSynthesis" in window) {
      try {
        const u = new SpeechSynthesisUtterance(text.slice(0, 400));
        window.speechSynthesis.speak(u);
      } catch {
        /* ignore */
      }
    }
    setBusy(false);
  }

  return (
    <>
      <div
        id="bot"
        onClick={() => {
          setPanelOn((v) => !v);
          setBubble(false);
          setAnim("wave");
        }}
        onMouseEnter={() => setAnim("wave")}
      >
        <span id="bb" className={bubble ? "on" : ""}>
          Ask me anything 👋
        </span>
        <img src={botImage} alt="Benji AI assistant" className={anim} />
      </div>
      <div className={`pn glass${panelOn ? " on" : ""}`} id="pn">
        <div className="ph">
          <span>Benji AI</span>
          <button onClick={() => setPanelOn(false)} aria-label="Close chat">
            ×
          </button>
        </div>
        <div className="ms" ref={msRef}>
          <div className="m a">
            Hi, I'm Benji AI. Ask me about our services, get a quick website idea, or tell me about your
            project.
          </div>
          {history.map((m, i) => (
            <div key={i} className={`m ${m.role === "user" ? "u" : "a"}`} style={{ whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          ))}
          {busy && history[history.length - 1]?.role === "user" && <div className="m a">…</div>}
        </div>
        {history.length === 0 && (
          <div className="cs" id="cs">
            {SUGGESTIONS.map((q) => (
              <button key={q} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="cs">
          {botActions.map(([kind, label]) => (
            <button
              key={kind}
              onClick={() => {
                setAnim(kind);
                setTimeout(() => setAnim(""), 1600);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <form
          className="pf"
          onSubmit={(e) => {
            e.preventDefault();
            const v = inputRef.current?.value ?? "";
            if (inputRef.current) inputRef.current.value = "";
            send(v);
          }}
        >
          <input ref={inputRef} id="pi" placeholder="Message Benji AI…" maxLength={500} autoComplete="off" />
          <button aria-label="Send">➤</button>
        </form>
      </div>
    </>
  );
}
