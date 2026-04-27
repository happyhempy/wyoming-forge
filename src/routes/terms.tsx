import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — USADOC" },
      { name: "description", content: "Read our terms of service. Understand the conditions for using our LLC formation services." },
    ],
  }),
});

function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">1. Services</h2>
              <p>USADOC provides LLC formation services, EIN acquisition, registered agent services, and related business formation assistance. We act as your authorized representative to file documents with state authorities and the IRS.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">2. Client Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Provide accurate and truthful information</li>
                <li>Upload valid identification documents when requested</li>
                <li>Respond to our communications in a timely manner</li>
                <li>Use the LLC for lawful business purposes only</li>
                <li>Maintain your LLC in good standing after formation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">3. Pricing & Payment</h2>
              <p>All prices are listed in USD and are due at the time of purchase. Our packages include the services described on our pricing page. State filing fees are included in our package prices. Payment is processed securely via Stripe.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">4. Timeline</h2>
              <p>While we strive to complete LLC formation within the advertised timeline (48-72 hours for standard processing), actual processing times depend on state authorities and the IRS, which are outside our control.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">5. Registered Agent Service</h2>
              <p>Our Premium package includes 1 year of registered agent service. This service renews annually. You will be notified before renewal and can cancel at any time before the renewal date.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">6. Limitation of Liability</h2>
              <p>We are not a law firm and do not provide legal advice. Our services are limited to document preparation and filing. We recommend consulting with a qualified attorney for legal questions about your LLC.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">7. Contact</h2>
              <p>Questions about these terms? Contact us at <a href="mailto:support@usadoc.net" className="text-gold hover:underline">support@usadoc.net</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
