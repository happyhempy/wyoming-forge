import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/documents/$documentId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }

        const token = authHeader.slice("Bearer ".length).trim();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
        const user = authData.user;
        if (authError || !user) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { data: roles, error: rolesError } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (rolesError) {
          return new Response("Could not verify admin permissions", { status: 500 });
        }

        const isAdmin = roles?.some((row) => row.role === "admin" || row.role === "superadmin") ?? false;
        const isSuperAdmin = roles?.some((row) => row.role === "superadmin") ?? false;
        if (!isAdmin) {
          return new Response("Forbidden", { status: 403 });
        }

        const { data: document, error: documentError } = await supabaseAdmin
          .from("documents")
          .select("id, file_url, file_name, case_id, cases!inner(assigned_admin)")
          .eq("id", params.documentId)
          .maybeSingle();

        if (documentError) {
          return new Response("Could not load document", { status: 500 });
        }

        if (!document) {
          return new Response("Document not found", { status: 404 });
        }

        const assignedAdmin = Array.isArray(document.cases)
          ? document.cases[0]?.assigned_admin
          : document.cases?.assigned_admin;

        if (!isSuperAdmin && assignedAdmin !== user.id) {
          return new Response("Forbidden", { status: 403 });
        }

        const { data: file, error: fileError } = await supabaseAdmin.storage
          .from("documents")
          .download(document.file_url);

        if (fileError || !file) {
          return new Response("File not found in storage", { status: 404 });
        }

        const safeFileName = document.file_name.replace(/[\r\n"]/g, "_");
        return new Response(file, {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${safeFileName}"`,
          },
        });
      },
    },
  },
});