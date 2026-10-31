import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: s["redirect"] as string }),
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in | Benji Agency" },
      { name: "description", content: "Sign in to the Benji community, client portal and owner dashboard." },
      { property: "og:title", content: "Sign in | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function safePath(raw: string): string {
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const target = safePath(Route.useSearch().redirect);

  const afterAuth = () => navigate({ to: target, replace: true });

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + target,
        data: name ? { display_name: name.slice(0, 80) } : undefined,
      },
    });
    setBusy(false);
    if (error) {
      setNote(error.message);
      return;
    }
    if (data.session) {
      afterAuth();
      return;
    }
    setNote("Check your email to confirm your account, then sign in.");
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setNote(error.message);
      return;
    }
    afterAuth();
  };

  const forgot = async () => {
    if (!email) {
      setNote("Enter your email first, then tap forgot password.");
      return;
    }
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setNote("Reset link sent — check your email.");
  };

  const google = async () => {
    sessionStorage.setItem("bj-next", target);
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  };

  const lovableSignIn = async () => {
    sessionStorage.setItem("bj-next", target);
    await lovable.auth.signInWithOAuth("lovable", { redirect_uri: window.location.origin });
  };

  return (
    <section className="pg">
      <div className="c" style={{ maxWidth: 460, margin: "auto" }}>
        <div className="card glass" style={{ padding: 30 }}>
          <span className="k">Benji Agency</span>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{ color: "var(--mute)", marginBottom: 20 }}>
            One account for the community, client portal and dashboard.
          </p>
          <form
            className="rf"
            onSubmit={mode === "signin" ? signIn : signUp}
            style={{ gap: 12 }}
          >
            {mode === "signup" && (
              <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
            <button className="btn p" style={{ justifyContent: "center" }} disabled={busy}>
              {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          {mode === "signin" && (
            <button className="cp" style={{ marginTop: 10, color: "var(--g2)" }} onClick={forgot}>
              Forgot password?
            </button>
          )}
          <p id="jn" style={{ color: "var(--g2)", marginTop: 10, minHeight: "1.4em" }}>
            {note}
          </p>
          <div className="ctas" style={{ margin: "18px 0 6px" }}>
            <button className="btn s" onClick={google} style={{ minWidth: 0, flex: 1 }}>
              Continue with Google
            </button>
            <button className="btn s" onClick={lovableSignIn} style={{ minWidth: 0, flex: 1 }}>
              Continue with Lovable
            </button>
          </div>
          <p style={{ textAlign: "center", color: "var(--mute)", fontSize: ".88rem" }}>
            {mode === "signin" ? "New here? " : "Already have an account? "}
            <button className="cp" style={{ color: "var(--g2)" }} onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
          {session && (
            <button className="btn p" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={afterAuth}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
