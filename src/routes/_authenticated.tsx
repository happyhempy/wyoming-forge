import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getDemoMode } from "@/lib/demoAccess";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (getDemoMode()) return { session: null };

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { session };
  },
  component: () => <Outlet />,
});
