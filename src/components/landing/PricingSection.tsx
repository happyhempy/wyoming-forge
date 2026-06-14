import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "@tanstack/react-router";

const packages = [
  {
    name: "Basic Formation",
    price: 299,
    badge: null,
    description: "Ideal for entrepreneurs who only need a legal U.S. company.",
    features: [
      "Get your Wyoming LLC formed in 48–72 hours",
      "Registered Agent included for the first year - no extra fees",
      "Full compliance with U.S. state requirements",
      "Personal dashboard to track every step in real time",
    ],
    cta: "Get Started",
    packageKey: "essential",
  },
  {
    name: "Formation + EIN",
    price: 399,
    badge: "⭐ MOST POPULAR",
    description: "Best for sellers who want to operate and receive payments in the U.S.",
    features: [
      "Everything in Basic Formation",
      "EIN (Tax ID) from the IRS - required to open a bank account",
      "Accept payments through Stripe, PayPal & more",
      "Start selling on Amazon, Shopify, or any U.S. platform",
      "Dedicated support throughout the entire process",
    ],
    cta: "Get Started",
    packageKey: "business",
  },
  {
    name: "Full Setup",
    price: 650,
    badge: "💎 COMPLETE",
    description: "Complete solution for running a compliant U.S. business - stress-free.",
    features: [
      "Everything in Formation + EIN",
      "Annual tax filing covered for the following year",
      "Stay compliant with zero paperwork on your end",
      "All mandatory state fees for 2 years fully included",
      "Year 2 document renewal & filing — only $300 (save $50)",
      "Priority support - we handle everything for you",
    ],
    cta: "Get Started",
    packageKey: "premium",
  },
];

export function PricingSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="pricing" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-4 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No hidden fees. No surprises. Choose the plan that fits your business - and we'll handle the rest.
          </p>
        </div>

        <div className={`flex justify-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Trusted by 500+ entrepreneurs worldwide
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, i) => {
            const isPopular = i === 1;
            return (
              <div
                key={i}
                className={`relative rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular
                    ? "border-gold bg-card shadow-lg scale-[1.02]"
                    : "border-border bg-card shadow-sm"
                } ${isVisible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {pkg.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    isPopular ? "bg-gold text-navy-dark" : "bg-navy text-primary-foreground"
                  }`}>
                    {pkg.badge}
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">one-time</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/dashboard" className="w-full">
                  <Button variant={isPopular ? "gold" : "navyOutline"} size="lg" className="w-full">
                    {pkg.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className={`mt-8 text-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-3 mb-4">
            <span className="text-2xl">🛡️</span>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              100% Money-Back Guarantee - If your LLC isn't successfully formed, we'll refund every penny.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            🔒 Secure payment · 📞 24/7 WhatsApp support · ⚡ LLC ready in 48–72 hours
          </p>
        </div>
      </div>
    </section>
  );
}
