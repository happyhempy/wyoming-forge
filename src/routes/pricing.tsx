import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, Shield, Clock, Users, Building2, FileText, CreditCard, Headphones } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Packages — USDOC" },
      { name: "description", content: "Compare our LLC formation packages. From $299 — includes filing, EIN, registered agent. No hidden fees." },
      { property: "og:title", content: "LLC Formation Packages — USDOC" },
      { property: "og:description", content: "Simple, transparent pricing for your US LLC. Everything included, no surprises." },
    ],
  }),
  component: PricingPage,
});

const packages = [
  {
    name: "Essential",
    price: 299,
    subtitle: "Everything you need to get started",
    badge: null,
    description: "Perfect for entrepreneurs who want a straightforward LLC formation with all the legal essentials covered.",
    features: [
      { text: "Wyoming LLC Articles of Organization filing", detail: "We prepare and file your formation documents with the Wyoming Secretary of State" },
      { text: "EIN (Tax ID) from the IRS", detail: "Your Employer Identification Number — required for opening bank accounts, filing taxes, and hiring" },
      { text: "Registered Agent — Year 1", detail: "A registered agent in Wyoming who receives legal documents on your behalf (required by law)" },
      { text: "LLC ready in 48-72 hours", detail: "Fast processing so you can start doing business quickly" },
    ],
    notIncluded: [
      "Business bank account opening",
      "Year 2 registered agent renewal",
      "Year 2 annual report filing",
    ],
  },
  {
    name: "Business",
    price: 399,
    subtitle: "Most popular — start banking right away",
    badge: "⭐ MOST POPULAR",
    description: "Our most popular package. Includes everything in Essential plus we open your US business bank account so you can start accepting payments immediately.",
    features: [
      { text: "Wyoming LLC Articles of Organization filing", detail: "We prepare and file your formation documents with the Wyoming Secretary of State" },
      { text: "EIN (Tax ID) from the IRS", detail: "Your Employer Identification Number — required for opening bank accounts, filing taxes, and hiring" },
      { text: "Registered Agent — Year 1", detail: "A registered agent in Wyoming who receives legal documents on your behalf (required by law)" },
      { text: "Mercury Business bank account opening", detail: "We help you open a US business bank account with Mercury — accept payments, manage finances, get a debit card" },
      { text: "LLC ready in 48-72 hours", detail: "Fast processing so you can start doing business quickly" },
    ],
    notIncluded: [
      "Year 2 registered agent renewal",
      "Year 2 annual report filing",
    ],
  },
  {
    name: "Premium",
    price: 650,
    subtitle: "Full coverage for 2 years — zero hassle",
    badge: "💎 PREMIUM",
    description: "The complete package. We handle everything for the first 2 years, including all mandatory renewals and state payments. You focus on your business, we handle the rest.",
    features: [
      { text: "Wyoming LLC Articles of Organization filing", detail: "We prepare and file your formation documents with the Wyoming Secretary of State" },
      { text: "EIN (Tax ID) from the IRS", detail: "Your Employer Identification Number — required for opening bank accounts, filing taxes, and hiring" },
      { text: "Registered Agent — Year 1", detail: "A registered agent in Wyoming who receives legal documents on your behalf (required by law)" },
      { text: "Mercury Business bank account opening", detail: "We help you open a US business bank account with Mercury — accept payments, manage finances, get a debit card" },
      { text: "Registered Agent renewal — Year 2", detail: "We renew your registered agent for the second year so you stay compliant" },
      { text: "Wyoming Annual Report — Year 2", detail: "We file your required annual report with the state — miss this and your LLC could be dissolved" },
      { text: "All mandatory state payments for 2 years fully covered", detail: "Every fee the state of Wyoming charges for your LLC is included — no surprise bills" },
      { text: "Year 2 document renewal & filing for only $300 (save $50)", detail: "When it's time to renew your documents for year 2, you pay only $300 instead of the standard $350 — exclusive Premium discount" },
      { text: "LLC ready in 48-72 hours", detail: "Fast processing so you can start doing business quickly" },
    ],
    notIncluded: [],
  },
];

const faqs = [
  {
    q: "What is an Articles of Organization?",
    a: "It's the official document filed with the state to legally create your LLC. Think of it as your company's birth certificate. We prepare it and file it for you.",
  },
  {
    q: "What is an EIN and why do I need one?",
    a: "An EIN (Employer Identification Number) is like a Social Security number for your business. It's issued by the IRS and required to open a bank account, file taxes, and hire employees.",
  },
  {
    q: "What does a Registered Agent do?",
    a: "Every LLC in Wyoming must have a registered agent — a person or company with a physical address in the state who can receive legal documents and official mail on your behalf. We provide this service for you.",
  },
  {
    q: "Why Mercury for the bank account?",
    a: "Mercury is a leading US business banking platform, trusted by thousands of startups and international businesses. It offers online account management, debit cards, and integrations with popular business tools — all with no monthly fees.",
  },
  {
    q: "What happens after Year 1?",
    a: "Your LLC requires an annual report filing ($60) and registered agent renewal each year to stay active. With our Premium package, Year 2 is fully covered. For Essential and Business packages, we'll remind you and offer competitive renewal rates.",
  },
  {
    q: "Why Wyoming?",
    a: "Wyoming offers zero state income tax, strong privacy protections, low annual fees, and a business-friendly legal environment. It's one of the top states for LLC formation in the US.",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-navy-dark text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your <span className="text-gold">LLC Package</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Every package includes full formation support, a personal dashboard to track your progress,
            and direct chat with our team. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gold" /> Secure payment</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> 48-72 hour turnaround</div>
          <div className="flex items-center gap-2"><Headphones className="w-4 h-4 text-gold" /> Direct chat support</div>
          <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gold" /> 500+ LLCs formed</div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, i) => {
              const isPopular = i === 1;
              const isPremium = i === 2;
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPopular
                      ? "border-gold bg-card shadow-lg lg:scale-[1.03]"
                      : isPremium
                        ? "border-navy bg-card shadow-md"
                        : "border-border bg-card shadow-sm"
                  }`}
                >
                  {pkg.badge && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      isPopular ? "bg-gold text-navy-dark" : "bg-navy text-primary-foreground"
                    }`}>
                      {pkg.badge}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">{pkg.subtitle}</p>

                  <div className="mb-4">
                    <span className="text-5xl font-bold text-foreground">${pkg.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">one-time payment</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{pkg.description}</p>

                  <div className="border-t border-border pt-6 mb-6 flex-1">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">What's included:</p>
                    <ul className="space-y-4">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{f.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {pkg.notIncluded.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Not included:</p>
                        <ul className="space-y-2">
                          {pkg.notIncluded.map((item, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/50">—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Link to="/checkout" search={{ package: pkg.name.toLowerCase() }} className="w-full">
                    <Button variant={isPopular ? "gold" : "navyOutline"} size="lg" className="w-full text-base">
                      {isPopular ? "Get Started — Most Popular" : `Get Started — $${pkg.price}`}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get with every package */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Included with every package
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: "Personal Dashboard", desc: "Track every step of your LLC formation in real-time. See exactly where you are and what's next." },
              { icon: Headphones, title: "Direct Chat Support", desc: "Message our team anytime directly from your dashboard. No tickets, no waiting — real human support." },
              { icon: FileText, title: "All Documents Delivered", desc: "Receive your Articles of Organization, EIN letter, and all formation documents digitally in your dashboard." },
              { icon: CreditCard, title: "No Hidden Fees", desc: "The price you see is the price you pay. All state filing fees are included in every package." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                <item.icon className="w-8 h-8 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Understanding your package
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-border rounded-xl bg-card overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-foreground hover:bg-muted/50 transition-colors">
                  {faq.q}
                  <span className="ml-4 text-muted-foreground group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-navy-dark text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your business?</h2>
          <p className="text-primary-foreground/70 mb-8">
            Choose a package above and have your LLC ready in as little as 48 hours.
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <Button variant="gold" size="xl">View Packages ↑</Button>
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="xl">
                Chat with us on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
