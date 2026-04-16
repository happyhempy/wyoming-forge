import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Map price lookup keys to package types
const PRICE_TO_PACKAGE: Record<string, string> = {
  llc_basic_price: "basic",
  llc_popular_price: "popular",
  llc_premium_price: "premium",
};

// Default steps for every new LLC case
const DEFAULT_STEPS = [
  { step_number: 1, step_name: "Payment Received" },
  { step_number: 2, step_name: "Information Review" },
  { step_number: 3, step_name: "LLC Filing with State" },
  { step_number: 4, step_name: "EIN Application" },
  { step_number: 5, step_name: "Documents Ready" },
];

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  console.log("Checkout completed:", session.id);
  const userId = session.metadata?.userId;
  if (!userId) {
    console.log("No userId in session metadata (anonymous checkout)");
    return;
  }

  const packageName = session.metadata?.package || "basic";
  const packageType = ["basic", "popular", "premium"].includes(packageName) ? packageName : "basic";

  // Check if a case already exists for this user with pending payment
  const { data: existingCase } = await supabase
    .from("cases")
    .select("id")
    .eq("user_id", userId)
    .eq("payment_status", "pending")
    .maybeSingle();

  if (existingCase) {
    // Update existing case
    const { error } = await supabase
      .from("cases")
      .update({
        payment_status: "completed",
        stripe_session_id: session.id,
        package: packageType,
      })
      .eq("id", existingCase.id);

    if (error) {
      console.error("Failed to update case:", error);
      return;
    }

    // Mark first step as completed
    await supabase
      .from("case_steps")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("case_id", existingCase.id)
      .eq("step_number", 1);

    // Mark second step as in_progress
    await supabase
      .from("case_steps")
      .update({ status: "in_progress" })
      .eq("case_id", existingCase.id)
      .eq("step_number", 2);

    console.log("Updated existing case:", existingCase.id);
  } else {
    // Create new case
    const { data: newCase, error: caseError } = await supabase
      .from("cases")
      .insert({
        user_id: userId,
        package: packageType,
        payment_status: "completed",
        stripe_session_id: session.id,
        current_step: 2,
      })
      .select("id")
      .single();

    if (caseError || !newCase) {
      console.error("Failed to create case:", caseError);
      return;
    }

    // Create steps
    const steps = DEFAULT_STEPS.map((step) => ({
      case_id: newCase.id,
      step_number: step.step_number,
      step_name: step.step_name,
      status: step.step_number === 1 ? "completed" : step.step_number === 2 ? "in_progress" : "pending",
      ...(step.step_number === 1 && { completed_at: new Date().toISOString() }),
    }));

    const { error: stepsError } = await supabase
      .from("case_steps")
      .insert(steps);

    if (stepsError) {
      console.error("Failed to create case steps:", stepsError);
    }

    console.log("Created new case:", newCase.id, "with package:", packageType);
  }
}
