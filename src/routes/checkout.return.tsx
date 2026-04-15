import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search) => ({
    session_id: (search.session_id as string) || "",
  }),
  component: CheckoutReturnPage,
});

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {session_id ? (
          <>
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your LLC formation process will begin shortly.
              You'll receive a confirmation email with next steps.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition">
                Sign In to Dashboard
              </Link>
              <Link to="/" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-foreground font-medium hover:bg-muted transition">
                Back to Home
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
