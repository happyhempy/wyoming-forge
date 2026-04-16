import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: 1, icon: "🖊️", title: "Fill out your details", desc: "Takes less than 5 minutes" },
  { num: 2, icon: "💳", title: "Choose your package & pay securely", desc: "100% secure via Stripe" },
  { num: 3, icon: "📋", title: "We file with Wyoming", desc: "Articles of Organization submitted immediately" },
  { num: 4, icon: "🔢", title: "We apply for your EIN", desc: "Federal tax ID from the IRS" },
  { num: 5, icon: "🎉", title: "Your LLC is ready", desc: "You receive all documents to your dashboard" },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How it works - <span className="text-gold">5 simple steps</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border sm:-translate-x-0.5" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 sm:gap-0 ${
                  isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
                }`}
              >
                {/* Left content (even steps on desktop) */}
                <div className={`hidden sm:block w-1/2 ${i % 2 === 0 ? "pr-12 text-right" : ""}`}>
                  {i % 2 === 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  )}
                </div>

                {/* Circle */}
                <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-9 h-9 bg-gold rounded-full flex items-center justify-center text-navy-dark font-bold text-sm z-10 shadow-md">
                  {step.num}
                </div>

                {/* Right content (odd steps on desktop) */}
                <div className={`sm:w-1/2 pl-14 sm:pl-0 ${i % 2 === 0 ? "sm:pl-12" : "sm:pl-12"}`}>
                  {/* Mobile: always show here */}
                  <div className="sm:hidden">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="font-semibold text-lg text-foreground mt-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                  {/* Desktop: odd steps */}
                  <div className="hidden sm:block">
                    {i % 2 !== 0 && (
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
