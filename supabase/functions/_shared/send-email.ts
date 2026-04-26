// Internal helper for Supabase Edge Functions to send transactional emails
// via the TanStack server route at /lovable/email/transactional/send.
// Uses the SUPABASE_SERVICE_ROLE_KEY as the Bearer token (server-to-server).

const APP_URL = Deno.env.get("APP_PUBLIC_URL") || "https://usadoc.net";

interface SendArgs {
  templateName: string;
  recipientEmail: string;
  idempotencyKey?: string;
  templateData?: Record<string, unknown>;
}

export async function sendUsadocEmail(args: SendArgs): Promise<void> {
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    console.error("[email] SUPABASE_SERVICE_ROLE_KEY not configured");
    return;
  }
  if (!args.recipientEmail) {
    console.warn("[email] skipping send — no recipient", args.templateName);
    return;
  }

  try {
    const res = await fetch(`${APP_URL}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        templateName: args.templateName,
        recipientEmail: args.recipientEmail,
        idempotencyKey: args.idempotencyKey,
        templateData: args.templateData,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] send failed (${res.status})`, args.templateName, body);
    } else {
      console.log("[email] enqueued", args.templateName, "→", args.recipientEmail);
    }
  } catch (err) {
    console.error("[email] network error", args.templateName, err);
  }
}
