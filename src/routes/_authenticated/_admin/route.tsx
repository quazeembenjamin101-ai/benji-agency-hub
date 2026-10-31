import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: () => {
    // Role gate: UI-level only; all data access is also RLS-protected server-side.
    return supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) throw redirect({ to: "/auth", search: { redirect: "/admin" } });
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (!ok) throw redirect({ to: "/account" });
    });
  },
  component: () => <Outlet />,
});

// Admin shell renders the sidebar in the index route; this component only mounts children.
void useState;
void useAuth;
