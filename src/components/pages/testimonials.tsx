import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Review = { id: string; name: string; company: string | null; rating: number; text: string };

export function TestimonialsBlock({ compact = false }: { compact?: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [show, setShow] = useState(compact ? 3 : 12);
  const [note, setNote] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id,name,company,rating,text")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const d = Object.fromEntries(new FormData(f)) as Record<string, string>;
    const { error } = await supabase.from("reviews").insert({
      name: d.name,
      company: d.co || null,
      rating: Number(d.r) || 5,
      text: d.t,
    });
    if (!error) {
      setReviews((r) => [
        { id: crypto.randomUUID(), name: d.name, company: d.co || null, rating: Number(d.r) || 5, text: d.t },
        ...r,
      ]);
      f.reset();
      setNote("Thank you for your review.");
    } else {
      setNote("Could not save the review right now — please try again later.");
    }
  };

  const visible = reviews.slice(0, show);

  return (
    <div className={compact ? "" : "cs2"}>
      <div className={compact ? "" : "rv2"}>
        <div className="tt" id="rl" style={compact ? undefined : { gridTemplateColumns: "repeat(2,1fr)" }}>
          {visible.length ? (
            visible.map((r) => (
              <div className="card glass" key={r.id}>
                <div className="av">{(r.name || "?")[0].toUpperCase()}</div>
                <span className="st">{"★".repeat(Math.max(1, Math.min(5, r.rating || 5)))}</span>
                <q>{r.text}</q>
                <b>
                  {r.name}
                  {r.company ? `, ${r.company}` : ""}
                </b>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--mute)" }}>No reviews yet. Be the first to write one.</p>
          )}
        </div>
        {reviews.length > show && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="btn s" onClick={() => setShow((s) => s + 12)}>
              Show more reviews
            </button>
          </div>
        )}
      </div>
      <form className="rf card glass" onSubmit={submit}>
        <h3>Write a review</h3>
        <input name="name" required maxLength={60} placeholder="Your name" />
        <input name="co" maxLength={80} placeholder="Company (optional)" />
        <select name="r" defaultValue="5">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
        </select>
        <textarea name="t" required maxLength={500} rows={4} placeholder="Share your experience" />
        <button className="btn p" style={{ justifyContent: "center" }} disabled={!user && false}>
          Submit review
        </button>
        <p id="rn" style={{ color: "var(--g2)" }}>
          {note}
        </p>
      </form>
    </div>
  );
}
