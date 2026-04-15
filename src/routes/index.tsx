import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { PainSection } from "@/components/landing/PainSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CPASection } from "@/components/landing/CPASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { LeadCaptureSection } from "@/components/landing/LeadCaptureSection";
import { AffiliateSection } from "@/components/landing/AffiliateSection";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "US LLC Formation — Open Your LLC Fast | Wyoming Specialists" },
      { name: "description", content: "Open your US LLC in 48-72 hours. Wyoming LLC formation for international entrepreneurs. EIN, Registered Agent, and Mercury bank account included." },
      { property: "og:title", content: "US LLC Formation — Open Your LLC Fast" },
      { property: "og:description", content: "Open your US LLC in 48-72 hours. Wyoming LLC formation for international entrepreneurs." },
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
        <TimelineSection />
        <PricingSection />
        <TestimonialsSection />
        <CPASection />
        <FAQSection />
        <LeadCaptureSection />
        <AffiliateSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
