import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — US LLC Formation" },
      { name: "description", content: "Read our privacy policy. Learn how we collect, use, and protect your personal information." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly, including your name, email address, passport details, phone number, and business information necessary for LLC formation. We also collect payment information processed securely through Stripe.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Process your LLC formation and related services</li>
                <li>Communicate with you about your order status</li>
                <li>File documents with state authorities on your behalf</li>
                <li>Obtain your EIN from the IRS</li>
                <li>Send important service updates and notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">3. Data Protection</h2>
              <p>We implement industry-standard security measures to protect your personal data. Your documents are stored securely with encryption at rest and in transit. We never sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">4. Data Sharing</h2>
              <p>We share your information only with:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>State authorities (for LLC filing purposes)</li>
                <li>The IRS (for EIN application)</li>
                <li>Our partner CPA firm (for compliance services)</li>
                <li>Payment processors (Stripe, for secure payments)</li>
                <li>Our registered agent provider (for registered agent services)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">5. Data Retention</h2>
              <p>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account and data by contacting us at support@llcformation.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">6. Cookies</h2>
              <p>We use essential cookies for authentication and session management. We may use analytics cookies to improve our service. You can disable cookies in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mt-8 mb-3">7. Contact</h2>
              <p>For privacy-related questions, contact us at <a href="mailto:support@llcformation.com" className="text-gold hover:underline">support@llcformation.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
