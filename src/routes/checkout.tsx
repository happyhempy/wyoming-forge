import { createFileRoute } from "@tanstack/react-router";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Link } from "@tanstack/react-router";

const priceMap: Record<string, { priceId: string; name: string; price: number }> = {
  essential: { priceId: "llc_basic_price", name: "Essential", price: 299 },
  business: { priceId: "llc_popular_price", name: "Business", price: 399 },
  premium: { priceId: "llc_premium_price", name: "Premium", price: 699 },
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => ({
    package: (search.package as string) || "business",
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { package: pkg } = Route.useSearch();
  const selected = priceMap[pkg] || priceMap.business;

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mt-4">
            Checkout — {selected.name} Package
          </h1>
          <p className="text-muted-foreground mt-2">
            ${selected.price} one-time payment
          </p>
        </div>
        <StripeEmbeddedCheckout
          priceId={selected.priceId}
          metadata={{ package: pkg }}
          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
        />
      </div>
    </div>
  );
}
