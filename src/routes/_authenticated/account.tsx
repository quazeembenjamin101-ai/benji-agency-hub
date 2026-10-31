import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageIntro } from "@/components/pages/faq-list";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My account | Benji Agency" },
      { property: "og:title", content: "My account | Benji Agency" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AccountPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setName(profile?.display_name ?? "");
  }, [profile?.display_name]);

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
    supabase
      .from("members")
      .select("joined_at")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setMemberSince(data?.joined_at ?? null));
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ display_name: name.slice(0, 80) }).eq("id", user.id);
    if (error) {
      setNote("Could not save — try again.");
      return;
    }
    await supabase.from("members").upsert({ user_id: user.id, name: name.slice(0, 80) || "Member" });
    await refreshProfile();
    setNote("Saved.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <>
      <PageIntro title="My account" desc="Your profile, community membership and access." kicker="Account" />
      <section>
        <div className="c" style={{ maxWidth: 640, margin: "auto" }}>
          <div className="card glass" style={{ padding: 28 }}>
            <p style={{ color: "var(--mute)" }}>Signed in as {user?.email}</p>
            {memberSince && (
              <p style={{ color: "var(--mute)", fontSize: ".85rem" }}>
                Community member since {new Date(memberSince).toLocaleDateString()}
              </p>
            )}
            <form className="rf" onSubmit={save} style={{ marginTop: 16, gap: 12 }}>
              <label style={{ color: "var(--mute)", fontSize: ".85rem" }}>
                Display name
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} style={{ marginTop: 6 }} />
              </label>
              <button className="btn p" style={{ justifyContent: "center" }}>
                Save
              </button>
              <p style={{ color: "var(--g2)", minHeight: "1.4em" }}>{note}</p>
            </form>
          </div>
          <div className="grid3" style={{ marginTop: 18 }}>
            <Link to="/community" className="card glass">
              <h3>Community</h3>
              <p>Your posts, comments and the member directory.</p>
            </Link>
            <div className="card glass">
              <h3>Client portal</h3>
              <p>Projects, approvals, invoices and files — coming with your first project.</p>
            </div>
            {isAdmin && (
              <a href="/admin" className="card glass">
                <h3>Owner dashboard</h3>
                <p>Leads, pipeline, bookings, keywords and analytics.</p>
              </a>
            )}
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn s" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
