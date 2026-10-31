import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    // Client-only gate: the session lives in localStorage, invisible to the server.
    return supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        throw redirect({ to: "/auth", search: { redirect: "/" } });
      }
    });
  },
  component: () => <Outlet />,
});

// Keeps the auth import used for the tree-shaker while the gate uses getUser().
void useAuth;

export const validateAuthenticated = async () => {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
};

export const guardEffect = useEffect;
