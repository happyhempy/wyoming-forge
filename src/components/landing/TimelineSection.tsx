import { useScrollReveal } from "@/hooks/useScrollReveal";

export function TimelineSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-muted">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How long does it take? ⏱️
          </h2>
        </div>

        <div className={`grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
            <span className="text-5xl mb-4 block">🏢</span>
            <h3 className="text-xl font-bold text-foreground mb-2">LLC Formation</h3>
            <p className="text-3xl font-bold text-gold">48-72 hours</p>
            <p className="text-sm text-muted-foreground mt-2">Business hours</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
            <span className="text-5xl mb-4 block">🔢</span>
            <h3 className="text-xl font-bold text-foreground mb-2">EIN from IRS</h3>
            <p className="text-3xl font-bold text-gold">4-6 weeks</p>
            <p className="text-sm text-muted-foreground mt-2">Federal processing</p>
          </div>
        </div>

        <p className={`text-center text-muted-foreground text-sm mt-8 ${isVisible ? "animate-fade-up delay-300" : "opacity-0"}`}>
          We begin your EIN application immediately after your LLC is approved.
        </p>
      </div>
    </section>
  );
}
