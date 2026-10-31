import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type LeadInput = {
  name?: string;
  email: string;
  build?: string;
  source: string;
  when?: string | null;
};

/** Saves a lead. Anyone can submit; signed-in members also join the community roster. */
export async function saveLead(o: LeadInput, user: User | null): Promise<boolean> {
  const row = {
    user_id: user?.id ?? null,
    name: o.name?.slice(0, 80) ?? null,
    email: String(o.email).slice(0, 120),
    build: o.build?.slice(0, 300) ?? null,
    source: o.source,
    status: "New",
    ts: new Date().toISOString(),
    call_when: o.when ?? null,
  };
  const { error } = await supabase.from("leads").insert(row);
  if (error) return false;
  if (user && o.source === "community") {
    await supabase.from("members").upsert({
      user_id: user.id,
      name: o.name || user.email?.split("@")[0] || "Member",
    });
  }
  return true;
}
