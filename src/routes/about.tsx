import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — USDOC" },
      { name: "description", content: "Learn about our mission to help international entrepreneurs open US LLCs with full legal compliance, speed, and personal support." },
      { property: "og:title", content: "About Us — USDOC" },
      { property: "og:description", content: "Learn about our mission to help international entrepreneurs open US LLCs." },
    ],
  }),
});

const values = [
  { icon: "🔍", title: "Transparency", desc: "No hidden fees, no surprises. You always know exactly what you're getting." },
  { icon: "⚡", title: "Speed", desc: "We move fast because your business can't wait. LLC ready in 48-72 hours." },
  { icon: "🤝", title: "Trust", desc: "Working alongside licensed CPAs, we ensure every filing is fully compliant." },
  { icon: "🎯", title: "Expertise", desc: "Wyoming specialists with hundreds of successful LLC formations." },
];

const team = [
  { name: "Michael Roberts", title: "CEO & Founder", initials: "MR" },
  { name: "Jessica Chen", title: "Operations Director", initials: "JC" },
  { name: "David Williams", title: "Client Success Manager", initials: "DW" },
];

function AboutPage() {
  const valuesReveal = useScrollReveal();
  const teamReveal = useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-navy text-primary-foreground pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Who We Are</h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              We make US company formation accessible to entrepreneurs around the world — with speed, transparency, and full legal compliance.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="prose text-muted-foreground space-y-4">
              <p>
                We started this company because we saw a gap in the market. International entrepreneurs wanted to access the US market, but the process was confusing, expensive, and filled with middlemen.
              </p>
              <p>
                We partnered with licensed US CPAs and built a streamlined system that takes the complexity out of LLC formation. Today, we've helped hundreds of entrepreneurs from over 50 countries open their US companies — quickly, affordably, and with complete compliance.
              </p>
              <p>
                Our mission is simple: make it as easy as possible for anyone, anywhere, to start a legitimate US business.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section ref={valuesReveal.ref} className="py-20 bg-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-foreground text-center mb-12 ${valuesReveal.isVisible ? "animate-fade-up" : "opacity-0"}`}>
              Our Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className={`bg-card rounded-xl border border-border p-6 text-center shadow-sm ${valuesReveal.isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"}`}>
                  <span className="text-4xl block mb-3">{v.icon}</span>
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section ref={teamReveal.ref} className="py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-foreground text-center mb-12 ${teamReveal.isVisible ? "animate-fade-up" : "opacity-0"}`}>
              Our Team
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <div key={i} className={`text-center ${teamReveal.isVisible ? `animate-fade-up delay-${(i + 1) * 100}` : "opacity-0"}`}>
                  <div className="w-28 h-28 rounded-full bg-navy mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gold text-2xl font-bold">{member.initials}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CPA */}
        <section className="py-16 bg-navy text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">We work alongside a licensed US CPA firm</h2>
            <p className="text-primary-foreground/70">
              Every LLC formation is coordinated with certified US accounting professionals to ensure your business meets all legal and tax requirements from day one.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to open your LLC?</h2>
            <p className="text-muted-foreground mb-8">Join hundreds of entrepreneurs who already trust us with their US company formation.</p>
            <Link to="/">
              <Button variant="gold" size="xl">Get Started</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
