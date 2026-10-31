import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({
    meta: [
      { title: "Set a new password | Benji Agency" },
      { property: "og:title", content: "Set a new password | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Recovery links land with type=recovery in the URL hash; the session is
    // exchanged automatically by the client. Give it a moment, then allow.
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNote("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setNote(error.message);
      return;
    }
    setNote("Password updated. Redirecting…");
    setTimeout(() => navigate({ to: "/" }), 1200);
  };

  return (
    <section className="pg">
      <div className="c" style={{ maxWidth: 460, margin: "auto" }}>
        <div className="card glass" style={{ padding: 30 }}>
          <span className="k">Benji Agency</span>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 16 }}>Set a new password</h1>
          {!ready ? (
            <p style={{ color: "var(--mute)" }}>Confirming your reset link…</p>
          ) : (
            <form className="rf" onSubmit={submit} style={{ gap: 12 }}>
              <input
                type="password"
                placeholder="New password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button className="btn p" style={{ justifyContent: "center" }}>
                Update password
              </button>
            </form>
          )}
          <p style={{ color: "var(--g2)", marginTop: 10, minHeight: "1.4em" }}>{note}</p>
        </div>
      </div>
    </section>
  );
}
