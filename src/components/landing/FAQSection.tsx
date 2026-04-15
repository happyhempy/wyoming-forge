import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Do I need to be a US citizen to open an LLC?", a: "No. Anyone from any country can open a US LLC. You do not need US citizenship, residency, or a visa. Our service is designed specifically for international entrepreneurs." },
  { q: "What is a Registered Agent?", a: "A Registered Agent is a person or entity required by Wyoming law to receive official legal and tax documents on behalf of your LLC. We provide this service as part of your package." },
  { q: "What is an EIN and why do I need it?", a: "An EIN (Employer Identification Number) is your LLC's federal tax ID number, issued by the IRS. You need it to open a bank account, file taxes, and conduct business in the US." },
  { q: "Can I open a bank account with my LLC?", a: "Yes! Our Business and Premium packages include help opening a Mercury business bank account, which is one of the best options for non-resident LLC owners." },
  { q: "Which US state do you work with?", a: "We work exclusively with Wyoming. It's one of the most popular states for LLC formation due to its strong privacy protections, low fees, and business-friendly regulations." },
  { q: "How long does the full process take?", a: "Your LLC is typically ready in 48-72 business hours. The EIN from the IRS takes 4-6 weeks, as it requires federal processing. We begin the EIN application immediately after your LLC is approved." },
  { q: "What happens after I pay?", a: "After payment, you'll receive login credentials to your personal dashboard where you can track progress, upload documents, and download your completed LLC documents." },
];

export function FAQSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Frequently Asked Questions ❓
          </h2>
        </div>

        <div className={isVisible ? "animate-fade-up delay-200" : "opacity-0"}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-gold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
