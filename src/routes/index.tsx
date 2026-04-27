import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { PainSection } from "@/components/landing/PainSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection, MiniTestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CPASection } from "@/components/landing/CPASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LeadCaptureSection } from "@/components/landing/LeadCaptureSection";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountdownPromo } from "@/components/landing/CountdownPromo";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

import { ChatWidget } from "@/components/ChatWidget";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "USADOC — Open Your LLC in 48 Hours | Trusted by 500+ Entrepreneurs" },
      { name: "description", content: "Open your US LLC in 48-72 hours. Full-service LLC formation for international entrepreneurs. EIN, Registered Agent, bank account, and a personal dashboard to track every step." },
      { property: "og:title", content: "USADOC — Open Your LLC in 48 Hours" },
      { property: "og:description", content: "Full-service US LLC formation. Track your progress in a personal dashboard. Trusted by 500+ entrepreneurs worldwide." },
      { property: "og:url", content: "https://usadoc.net/" },
    ],
    links: [
      { rel: "canonical", href: "https://usadoc.net/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "USADOC",
          url: "https://usadoc.net",
          description: "US LLC formation services. Wyoming LLC specialists for international entrepreneurs.",
          areaServed: "Worldwide",
          priceRange: "$299 - $699",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "500",
          },
          offers: [
            { "@type": "Offer", name: "Essential LLC Package", price: "299", priceCurrency: "USD" },
            { "@type": "Offer", name: "Popular LLC Package", price: "399", priceCurrency: "USD" },
            { "@type": "Offer", name: "Premium LLC Package", price: "699", priceCurrency: "USD" },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PainSection />
        <SolutionSection />
        <HowItWorks />
        <DashboardPreviewSection />
        <CountdownPromo />
        <PricingSection />
        <TestimonialsSection />
        <MiniTestimonialsSection />
        <TimelineSection />
        <CPASection />
        <FAQSection />
        <LeadCaptureSection />
      </main>
      <Footer />
      <ChatWidget />
      <ExitIntentPopup />
    </>
  );
}
