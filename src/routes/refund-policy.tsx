import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: "Refund Policy — USDOC" },
      { name: "description", content: "Our refund policy for LLC formation services. Full refund before filing, partial refund after." },
    ],
  }),
});

function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">Full Refund</h2>
              <p>You are eligible for a <strong className="text-foreground">full refund</strong> if you cancel your order before we begin the filing process with the state. This typically means within 24 hours of purchase, before your documents have been submitted.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">Partial Refund</h2>
              <p>If the filing process has already begun (documents submitted to the state), we can offer a <strong className="text-foreground">partial refund</strong> of our service fee, minus:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>State filing fees (non-refundable once submitted)</li>
                <li>Processing fees incurred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">No Refund</h2>
              <p>Refunds are <strong className="text-foreground">not available</strong> once:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Your LLC has been officially formed by the state</li>
                <li>Your EIN has been obtained from the IRS</li>
                <li>Registered agent service has been activated</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">Registered Agent Renewal</h2>
              <p>Annual registered agent renewal fees can be refunded within 14 days of the renewal charge, provided you notify us before the renewal date.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">How to Request a Refund</h2>
              <p>Contact us at <a href="mailto:support@llcformation.com" className="text-gold hover:underline">support@llcformation.com</a> or via WhatsApp. Include your order details and we'll process your request within 3-5 business days.</p>
            </section>

            <section className="bg-card border border-gold/30 rounded-2xl p-6 mt-8">
              <h3 className="font-bold text-foreground text-lg mb-2">💡 Our Promise</h3>
              <p>If we are unable to complete your LLC formation for any reason on our end, you will receive a full refund — no questions asked.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
