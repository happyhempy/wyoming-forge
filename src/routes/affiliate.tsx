import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AffiliateSection } from "@/components/landing/AffiliateSection";

export const Route = createFileRoute("/affiliate")({
  component: AffiliatePage,
  head: () => ({
    meta: [
      { title: "Affiliate Program — Earn by Referring Clients | USADOC" },
      { name: "description", content: "Join our affiliate program and earn a commission for every client you refer. For content creators, consultants, and business advisors." },
      { property: "og:title", content: "Affiliate Program — Earn by Referring Clients" },
      { property: "og:description", content: "Join our affiliate program and earn a commission for every client you refer." },
    ],
  }),
});

function AffiliatePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <AffiliateSection />
      </main>
      <Footer />
    </>
  );
}
