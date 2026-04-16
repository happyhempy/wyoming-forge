import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export const Route = createFileRoute("/why-wyoming")({
  component: WhyWyomingPage,
  head: () => ({
    meta: [
      { title: "Why Wyoming for Your LLC? — US LLC Formation" },
      { name: "description", content: "Discover why Wyoming is the #1 state for LLC formation. No state income tax, strong privacy, low fees, and asset protection for international entrepreneurs." },
      { property: "og:title", content: "Why Wyoming for Your LLC?" },
      { property: "og:description", content: "No state income tax, strong privacy, low fees — why 80% of our clients choose Wyoming." },
    ],
  }),
});

function WhyWyomingPage() {
  const advantages = [
    {
      icon: "🏦",
      title: "No State Income Tax",
      description: "Wyoming has zero state income tax for individuals and LLCs. Your business profits are not taxed at the state level, maximizing your earnings.",
    },
    {
      icon: "🔒",
      title: "Maximum Privacy",
      description: "Wyoming does not require public disclosure of LLC members or managers. Your ownership remains completely private — no public records.",
    },
    {
      icon: "💰",
      title: "Lowest Fees in the US",
      description: "Annual report fee is just $60 — the lowest in the nation. No franchise tax for LLCs. Total annual cost of maintaining your LLC stays minimal.",
    },
    {
      icon: "🛡️",
      title: "Strongest Asset Protection",
      description: "Wyoming was the first state to create the LLC structure and offers the strongest charging order protection in the country. Creditors cannot seize your LLC assets.",
    },
    {
      icon: "⚡",
      title: "Fast Filing — 24-48 Hours",
      description: "Wyoming's Secretary of State processes filings quickly. With our expedited service, your LLC can be formed in as little as 24 hours.",
    },
    {
      icon: "🌍",
      title: "Perfect for Non-US Residents",
      description: "No requirement to be a US citizen or resident. No need to visit Wyoming. Everything can be done remotely — ideal for international entrepreneurs.",
    },
  ];

  const comparisons = [
    { feature: "State Income Tax", wyoming: "None", delaware: "8.7%", nevada: "None", florida: "None" },
    { feature: "Annual Report Fee", wyoming: "$60", delaware: "$300+", nevada: "$350+", florida: "$138" },
    { feature: "Privacy Protection", wyoming: "Strongest", delaware: "Moderate", nevada: "Strong", florida: "Weak" },
    { feature: "Asset Protection", wyoming: "Best", delaware: "Good", nevada: "Good", florida: "Moderate" },
    { feature: "Franchise Tax", wyoming: "None", delaware: "$300+", nevada: "$200+", florida: "None" },
    { feature: "Filing Speed", wyoming: "24-48h", delaware: "3-5 days", nevada: "1-3 days", florida: "3-7 days" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-24 pb-16 bg-navy text-primary-foreground">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
              🏔️ The #1 State for LLCs
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-gold">Wyoming</span> Is the Best State for Your LLC
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              80% of our international clients choose Wyoming. Here's why it's the smartest choice for your US business.
            </p>
          </div>
        </section>

        {/* Advantages Grid */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">6 Reasons to Choose Wyoming</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/30 transition-colors">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Wyoming vs Other States</h2>
            <p className="text-center text-muted-foreground mb-10">See how Wyoming compares to other popular LLC states</p>
            <div className="overflow-x-auto">
              <table className="w-full bg-card border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-navy text-primary-foreground">
                    <th className="text-left p-4 text-sm font-semibold">Feature</th>
                    <th className="text-center p-4 text-sm font-semibold text-gold">Wyoming ⭐</th>
                    <th className="text-center p-4 text-sm font-semibold">Delaware</th>
                    <th className="text-center p-4 text-sm font-semibold">Nevada</th>
                    <th className="text-center p-4 text-sm font-semibold">Florida</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <td className="p-4 text-sm font-medium">{row.feature}</td>
                      <td className="p-4 text-sm text-center font-semibold text-gold">{row.wyoming}</td>
                      <td className="p-4 text-sm text-center text-muted-foreground">{row.delaware}</td>
                      <td className="p-4 text-sm text-center text-muted-foreground">{row.nevada}</td>
                      <td className="p-4 text-sm text-center text-muted-foreground">{row.florida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Form Your Wyoming LLC?</h2>
            <p className="text-muted-foreground mb-8">Get started in minutes. Your LLC can be ready in 48-72 hours.</p>
            <a href="/#pricing">
              <button className="bg-gold text-navy-dark font-bold px-8 py-3 rounded-xl hover:bg-gold/90 transition-colors">
                View Packages — Starting at $299
              </button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
