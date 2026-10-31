import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

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
