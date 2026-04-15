import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog — US LLC Formation Tips & Guides" },
      { name: "description", content: "Expert guides on US LLC formation, Wyoming LLCs, EIN applications, and business banking for international entrepreneurs." },
      { property: "og:title", content: "Blog — US LLC Formation Tips & Guides" },
      { property: "og:description", content: "Expert guides on US LLC formation for international entrepreneurs." },
    ],
  }),
});

const articles = [
  {
    slug: "how-to-open-us-llc-non-resident",
    title: "How to Open a US LLC as a Non-Resident in 2024",
    excerpt: "A complete step-by-step guide for international entrepreneurs looking to form a US LLC without being a US citizen or resident.",
    date: "March 15, 2024",
    color: "bg-navy",
  },
  {
    slug: "wyoming-vs-delaware",
    title: "Wyoming vs Delaware — Which State is Best for Your LLC?",
    excerpt: "We compare the two most popular states for LLC formation and explain why Wyoming is often the better choice for non-residents.",
    date: "March 8, 2024",
    color: "bg-navy-light",
  },
  {
    slug: "what-is-ein",
    title: "What is an EIN and Why Does Your LLC Need One?",
    excerpt: "Everything you need to know about the Employer Identification Number — what it is, how to get one, and why it's essential.",
    date: "February 28, 2024",
    color: "bg-gold-dark",
  },
  {
    slug: "mercury-bank-account",
    title: "How to Open a Mercury Business Bank Account for Your LLC",
    excerpt: "Mercury is one of the best banking options for non-resident LLC owners. Here's how to open your account step by step.",
    date: "February 20, 2024",
    color: "bg-navy",
  },
  {
    slug: "top-5-reasons-wyoming",
    title: "Top 5 Reasons Entrepreneurs Choose Wyoming for Their LLC",
    excerpt: "From privacy protections to low fees — discover why Wyoming is the #1 state for LLC formation among international business owners.",
    date: "February 12, 2024",
    color: "bg-navy-light",
  },
];

function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-navy text-primary-foreground pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-primary-foreground/70">
              Expert guides, tips, and insights on US LLC formation for international entrepreneurs.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <article
                  key={i}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Cover placeholder */}
                  <div className={`h-48 ${article.color} flex items-center justify-center`}>
                    <span className="text-primary-foreground/30 text-6xl">📄</span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">{article.date}</p>
                    <h2 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{article.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                    <Button variant="navyOutline" size="sm">Read More</Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-primary-foreground/70 mb-6">Open your US LLC today — fast, simple, from anywhere.</p>
            <Link to="/">
              <Button variant="gold" size="lg">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
