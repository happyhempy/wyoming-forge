// One-time seed function to create a test admin + a fictitious client user.
// Safe to delete after running once.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const users = [
      {
        email: "admin@usadoc.net",
        password: "Admin2026!",
        fullName: "USADOC Admin",
        role: "admin" as const,
      },
      {
        email: "testclient@usadoc.net",
        password: "Test2026!",
        fullName: "Test Client",
        role: null,
      },
    ];

    const results: Array<Record<string, unknown>> = [];

    for (const u of users) {
      // Try to create — if exists, fetch existing user
      let userId: string | null = null;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.fullName },
      });

      if (createErr) {
        // Likely already exists — find them
        const { data: list } = await admin.auth.admin.listUsers();
        const existing = list.users.find((x) => x.email === u.email);
        if (existing) {
          userId = existing.id;
          // Update password to known value
          await admin.auth.admin.updateUserById(existing.id, {
            password: u.password,
            email_confirm: true,
          });
          results.push({ email: u.email, status: "updated", userId });
        } else {
          results.push({ email: u.email, status: "error", error: createErr.message });
          continue;
        }
      } else {
        userId = created.user.id;
        results.push({ email: u.email, status: "created", userId });
      }

      if (!userId) continue;

      // Ensure profile exists
      await admin.from("profiles").upsert(
        { user_id: userId, full_name: u.fullName },
        { onConflict: "user_id" }
      );

      // Assign role if specified
      if (u.role) {
        const { data: existingRole } = await admin
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .eq("role", u.role)
          .maybeSingle();
        if (!existingRole) {
          await admin.from("user_roles").insert({ user_id: userId, role: u.role });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
