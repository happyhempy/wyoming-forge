import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "500+", label: "LLCs Opened" },
  { value: "48h", label: "Average Turnaround" },
  { value: "4.9★", label: "Client Rating" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-navy-dark/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gold text-sm font-medium">Trusted by entrepreneurs worldwide</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight animate-fade-up delay-100">
          Your US LLC —{" "}
          <span className="text-gold">Ready in 48 Hours</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-up delay-200">
          Whether you sell on Amazon, offer freelance services, or run an online course — we handle <strong className="text-primary-foreground">everything</strong>.
          From filing to EIN to your bank account. Track it all in your personal dashboard.
        </p>

        <div className="mt-4 animate-fade-up delay-250">
          <span className="inline-flex items-center gap-2 bg-green-500/15 border border-green-400/30 rounded-full px-5 py-2 text-green-300 text-sm font-semibold">
            🛡️ 100% Money-Back Guarantee — If we don't deliver, you get a full refund
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
          <Link to="/pricing">
            <Button variant="gold" size="xl">
              Start Your LLC Now →
            </Button>
          </Link>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-gold text-gold hover:bg-gold/15 hover:border-gold backdrop-blur-sm"
            onClick={() => {
              const chatBtn = document.querySelector<HTMLButtonElement>('[aria-label="Open chat"], [aria-label="Close chat"]');
              if (chatBtn?.getAttribute("aria-label") === "Open chat") chatBtn.click();
            }}
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Free Consultation
          </Button>
        </div>

        {/* Social proof stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto animate-fade-up delay-400">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-xs sm:text-sm text-primary-foreground/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
