import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CPASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-navy text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={isVisible ? "animate-fade-up" : "opacity-0"}>
          <div className="w-20 h-20 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Working alongside a licensed <span className="text-gold">US CPA firm</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Every LLC we open is handled in full coordination with our certified US accounting partners - ensuring complete legal and tax compliance from day one.
          </p>
        </div>
      </div>
    </section>
  );
}
