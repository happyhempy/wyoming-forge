import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search) => ({
    session_id: (search.session_id as string) || "",
  }),
  component: CheckoutReturnPage,
});

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!session_id) {
      setChecking(false);
      return;
    }

    // Check if user is logged in, if so redirect to dashboard
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // User is authenticated - go straight to dashboard
        navigate({ to: "/dashboard" });
      } else {
        setChecking(false);
      }
    });
  }, [session_id, navigate]);

  if (checking && session_id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {session_id ? (
          <>
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your LLC formation process will begin shortly.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to="/dashboard" className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-navy-dark font-medium hover:opacity-90 transition">
                Go to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              We couldn't verify your payment. Please try again or contact support.
            </p>
            <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition">
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
