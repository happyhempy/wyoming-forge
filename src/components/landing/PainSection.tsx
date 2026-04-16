import { useScrollReveal } from "@/hooks/useScrollReveal";

const painPoints = [
  { icon: "🛒", text: "You want to sell on Amazon, Shopify, or other U.S. platforms - but need a legal company first" },
  { icon: "💻", text: "You offer freelance services or sell digital products - and need a professional U.S. business entity" },
  { icon: "🎓", text: "You sell online courses or coaching - and want to accept payments like a real U.S. business" },
  { icon: "💸", text: "You've heard opening a US LLC is complicated, expensive, and full of paperwork" },
  { icon: "🤷", text: "You don't know where to start - or who you can actually trust" },
  { icon: "📄", text: "You're worried about taxes, compliance, and doing something wrong" },
];

export function PainSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={isVisible ? "animate-fade-up" : "opacity-0"}>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
            Sound familiar? 😓
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            You're not alone - these are the most common challenges our clients face before finding us.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className={`bg-card rounded-xl border border-border p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow ${
                isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
              }`}
            >
              <span className="text-3xl flex-shrink-0">{point.icon}</span>
              <p className="text-foreground font-medium">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
