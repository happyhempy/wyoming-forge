import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function LeadCaptureSection() {
  const { ref, isVisible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Save to Supabase leads table + notify admin
    setSubmitted(true);
  };

  return (
    <section ref={ref} className="py-20 bg-muted">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Not ready yet? Leave your details 📩
          </h2>
          <p className="text-muted-foreground">We'll reach out and answer any questions you have.</p>
        </div>

        {submitted ? (
          <div className={`text-center bg-card rounded-2xl border border-border p-12 ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
            <span className="text-5xl block mb-4">✅</span>
            <h3 className="text-xl font-bold text-foreground">Thank you!</h3>
            <p className="text-muted-foreground mt-2">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`bg-card rounded-2xl border border-border p-8 shadow-sm space-y-5 ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input required type="text" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input required type="email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input type="tel" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Business Type</label>
              <select required className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors">
                <option value="">Select...</option>
                <option>E-Commerce</option>
                <option>Amazon FBA</option>
                <option>Real Estate</option>
                <option>Freelance</option>
                <option>Other</option>
              </select>
            </div>
            <Button variant="gold" size="lg" type="submit" className="w-full">
              Send me details
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
