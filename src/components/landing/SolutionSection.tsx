import { useScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  { icon: "✅", title: "Full Legal Compliance", desc: "Every LLC is filed in full compliance with state and federal requirements. We work with a licensed US CPA firm." },
  { icon: "⚡", title: "48-Hour Turnaround", desc: "Your LLC is ready in 48-72 business hours. We file immediately — no delays, no excuses." },
  { icon: "🤝", title: "We're With You Every Step", desc: "From filing to EIN to your bank account — you get a personal dashboard and direct messaging with our team." },
  { icon: "🔒", title: "Your Own Secure Dashboard", desc: "Track progress, upload documents, and receive your LLC papers — all in one place. No email chains." },
];

export function SolutionSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-navy text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            We handle everything — <span className="text-gold">you just fill out a short form</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Sign up, complete a quick questionnaire, upload your passport, and we take it from there.
            You'll track the entire process in your personal dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`bg-navy-light/40 border border-primary-foreground/10 rounded-xl p-8 flex items-start gap-5 hover:bg-navy-light/60 transition-colors ${
                isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"
              }`}
            >
              <span className="text-4xl flex-shrink-0">{b.icon}</span>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold">{b.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
