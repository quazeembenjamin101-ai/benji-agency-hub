import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { saveLead } from "@/lib/leads";

/** Inline email-capture form (newsletter, free checklists, …). */
export function LeadEmailForm({ source, button }: { source: string; button: string }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();

  return (
    <form
      className="nl"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
        const ok = await saveLead({ email, source, name: "" }, user);
        setBusy(false);
        setNote(
          ok
            ? "You're in. Check your email for next steps."
            : "Could not save — please message us on WhatsApp instead.",
        );
        if (ok) e.currentTarget.reset();
      }}
    >
      <input type="email" required placeholder="Your email address" maxLength={120} name="email" />
      <button className="btn p" disabled={busy}>
        {busy ? "…" : button}
      </button>
      <p className="nm" style={{ color: "var(--g2)", textAlign: "center", marginTop: 10, minHeight: "1.4em" }}>
        {note}
      </p>
    </form>
  );
}
