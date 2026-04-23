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
      { title: "USDOC — Open Your LLC in 48 Hours | Trusted by 500+ Entrepreneurs" },
      { name: "description", content: "Open your US LLC in 48-72 hours. Full-service LLC formation for international entrepreneurs. EIN, Registered Agent, bank account, and a personal dashboard to track every step." },
      { property: "og:title", content: "USDOC — Open Your LLC in 48 Hours" },
      { property: "og:description", content: "Full-service US LLC formation. Track your progress in a personal dashboard. Trusted by 500+ entrepreneurs worldwide." },
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
