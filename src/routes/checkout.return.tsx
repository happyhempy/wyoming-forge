import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search) => ({
    session_id: (search.session_id as string) || "",
  }),
  component: CheckoutReturnPage,
});

const NEXT_STEPS = [
  { icon: "📝", title: "Complete your intake form", desc: "Tell us your LLC name and business details (5 minutes)" },
  { icon: "🪪", title: "Upload your passport", desc: "We need a copy to verify your identity" },
  { icon: "✍️", title: "Review & sign", desc: "Sign your Articles of Organization digitally" },
  { icon: "🏛️", title: "We file with Wyoming", desc: "We handle everything — you just wait for updates" },
];

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (!session_id) {
      setChecking(false);
      return;
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setChecking(false);
      if (user) {
        // Show success page, then auto-redirect after countdown
        const interval = setInterval(() => {
          setCountdown((n) => {
            if (n <= 1) {
              clearInterval(interval);
              navigate({ to: "/dashboard" });
              return 0;
            }
            return n - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    });
  }, [session_id, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!session_id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">❌</div>
          <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">
            We couldn't verify your payment. Please try again or contact support.
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Your Wyoming LLC formation is officially underway.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            A confirmation email is on its way to your inbox.
          </p>
        </div>

        {/* Next steps */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">What happens next</h2>
          <div className="space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-base">{step.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-gold px-8 py-3.5 text-navy-dark font-bold hover:opacity-90 transition text-base w-full"
          >
            Go to My Dashboard →
          </Link>
          {countdown > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Redirecting automatically in {countdown} seconds…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
