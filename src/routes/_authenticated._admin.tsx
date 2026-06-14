import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_ADMIN_ID, getDemoMode } from "@/lib/demoAccess";

export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: async () => {
    if (getDemoMode() === "admin") return { userRoles: ["admin"], userId: DEMO_ADMIN_ID };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const userRoles = roles?.map((r) => r.role) ?? [];
    const isAdmin = userRoles.includes("admin") || userRoles.includes("superadmin");

    if (!isAdmin) throw redirect({ to: "/dashboard" });

    return { userRoles, userId: user.id };
  },
  component: () => <Outlet />,
});
