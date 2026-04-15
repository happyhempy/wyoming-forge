import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function AffiliateSection() {
  const { ref, isVisible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Save to Supabase affiliates table + notify admin
    setSubmitted(true);
  };

  return (
    <section ref={ref} className="py-20 bg-navy text-primary-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Partner with us — <span className="text-gold">Earn by referring clients</span> 🤝
          </h2>
          <p className="text-primary-foreground/70">
            Are you a content creator, consultant, or business advisor? Join our affiliate program and earn a commission for every client you refer. Fill out the form below and we'll get back to you.
          </p>
        </div>

        {submitted ? (
          <div className={`text-center bg-navy-light/40 border border-primary-foreground/10 rounded-2xl p-12 ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
            <span className="text-5xl block mb-4">🎉</span>
            <h3 className="text-xl font-bold">Application received!</h3>
            <p className="text-primary-foreground/70 mt-2">We'll review your application and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`bg-navy-light/30 border border-primary-foreground/10 rounded-2xl p-8 space-y-5 ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div>
              <label className="block text-sm font-medium text-primary-foreground mb-1.5">Full Name</label>
              <input required type="text" className="w-full rounded-lg border border-primary-foreground/20 bg-navy-light/40 px-4 py-3 text-sm text-primary-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors placeholder:text-primary-foreground/40" placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-foreground mb-1.5">Email</label>
              <input required type="email" className="w-full rounded-lg border border-primary-foreground/20 bg-navy-light/40 px-4 py-3 text-sm text-primary-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors placeholder:text-primary-foreground/40" placeholder="jane@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-foreground mb-1.5">Website or Social Media Link</label>
              <input type="url" className="w-full rounded-lg border border-primary-foreground/20 bg-navy-light/40 px-4 py-3 text-sm text-primary-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors placeholder:text-primary-foreground/40" placeholder="https://yoursite.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-foreground mb-1.5">How do you plan to promote us?</label>
              <textarea required rows={3} className="w-full rounded-lg border border-primary-foreground/20 bg-navy-light/40 px-4 py-3 text-sm text-primary-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors placeholder:text-primary-foreground/40 resize-none" placeholder="Tell us about your audience and promotion strategy..." />
            </div>
            <Button variant="gold" size="lg" type="submit" className="w-full">
              Apply to Become an Affiliate
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
