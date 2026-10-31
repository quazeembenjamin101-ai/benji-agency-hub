import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { saveLead } from "@/lib/leads";

type JoinState = {
  open: (title?: string, source?: string) => void;
};

const JoinContext = createContext<JoinState>({ open: () => {} });

export function useJoinModal() {
  return useContext(JoinContext);
}

export function JoinModalProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Join the Benji community");
  const [source, setSource] = useState("community");
  const [on, setOn] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();

  const open = (t?: string, src?: string) => {
    if (t) setTitle(t);
    setSource(src || "community");
    setNote("");
    setOn(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const ok = await saveLead(
      { name: d["name"] || null, email: d["email"] ?? "", build: d["build"] || null, source, when: d["when"] || null },
      user,
    );
    setBusy(false);
    setNote(
      ok
        ? "You're in. Check your email for next steps."
        : "Could not save — please message us on WhatsApp instead.",
    );
    if (ok) (e.target as HTMLFormElement).reset();
  };

  return (
    <JoinContext.Provider value={{ open }}>
      {children}
      <div
        className={`mo${on ? " on" : ""}`}
        id="jm"
        onClick={(e) => {
          if (e.target === e.currentTarget) setOn(false);
        }}
      >
        <form className="bx glass" onSubmit={submit}>
          <h3>{title}</h3>
          <p>Free access to discussions, templates and the AI assistant.</p>
          <input name="name" placeholder="Your name" required maxLength={80} />
          <input name="email" type="email" placeholder="Email address" required maxLength={120} />
          <input name="build" placeholder="What are you building?" maxLength={200} />
          {source === "call" && (
            <input name="when" type="datetime-local" aria-label="Preferred date and time" />
          )}
          <button className="btn p" style={{ justifyContent: "center" }} disabled={busy}>
            {busy ? "Sending…" : "Send"}
          </button>
          <p id="jn" style={{ color: "var(--g2)", textAlign: "center", minHeight: "1.4em" }}>
            {note}
          </p>
          {!user && source === "community" && (
            <p style={{ textAlign: "center", fontSize: ".85rem" }}>
              Want to post in the community?{" "}
              <a href="/auth" style={{ color: "var(--g2)" }}>
                Create a free account →
              </a>
            </p>
          )}
        </form>
      </div>
    </JoinContext.Provider>
  );
}
