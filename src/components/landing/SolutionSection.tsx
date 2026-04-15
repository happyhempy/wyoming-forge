import { useScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  { icon: "✅", title: "Full Legal Compliance", desc: "Every LLC is filed in full compliance with Wyoming and federal requirements." },
  { icon: "⚡", title: "Fast Turnaround", desc: "Your LLC is ready in 48-72 business hours. We don't waste time." },
  { icon: "🤝", title: "Personal Support", desc: "We guide you through every step — from filing to your EIN and bank account." },
];

export function SolutionSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-navy text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            We take care of everything — <span className="text-gold">you just fill out a short form</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Our team, working alongside a licensed US CPA firm, handles the entire process from start to finish. No lawyers, no confusion, no wasted time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`bg-navy-light/40 border border-primary-foreground/10 rounded-xl p-8 text-center hover:bg-navy-light/60 transition-colors ${
                isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
              }`}
            >
              <span className="text-4xl mb-4 block">{b.icon}</span>
              <h3 className="text-xl font-semibold mb-2 text-gold">{b.title}</h3>
              <p className="text-primary-foreground/70 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
