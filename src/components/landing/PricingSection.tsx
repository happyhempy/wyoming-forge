import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "@tanstack/react-router";

const packages = [
  {
    name: "Essential",
    price: 299,
    badge: null,
    features: [
      "Wyoming LLC Articles of Organization filing",
      "EIN from the IRS",
      "Registered Agent — Year 1",
      "LLC ready in 48-72 hours",
    ],
  },
  {
    name: "Business",
    price: 399,
    badge: "⭐ MOST POPULAR",
    features: [
      "Wyoming LLC Articles of Organization filing",
      "EIN from the IRS",
      "Registered Agent — Year 1",
      "Mercury Business bank account opening",
      "LLC ready in 48-72 hours",
    ],
  },
  {
    name: "Premium",
    price: 699,
    badge: "💎 PREMIUM",
    features: [
      "Wyoming LLC Articles of Organization filing",
      "EIN from the IRS",
      "Registered Agent — Year 1",
      "Mercury Business bank account opening",
      "Registered Agent renewal — Year 2",
      "Wyoming Annual Report — Year 2",
      "All mandatory state payments for 2 years fully covered",
      "LLC ready in 48-72 hours",
    ],
  },
];

export function PricingSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="pricing" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing 💰
          </h2>
          <p className="text-muted-foreground">No hidden fees. No surprises. Everything included.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => {
            const isPopular = i === 1;
            return (
              <div
                key={i}
                className={`relative rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular
                    ? "border-gold bg-card shadow-lg scale-[1.02]"
                    : "border-border bg-card shadow-sm"
                } ${isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"}`}
              >
                {pkg.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                    isPopular ? "bg-gold text-navy-dark" : "bg-navy text-primary-foreground"
                  }`}>
                    {pkg.badge}
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
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

                <Link to="/checkout" search={{ package: pkg.name.toLowerCase() }} className="w-full">
                  <Button variant={isPopular ? "gold" : "navyOutline"} size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
