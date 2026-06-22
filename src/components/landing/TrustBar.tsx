import { useScrollReveal } from "@/hooks/useScrollReveal";

const trustItems = [
  { icon: "🏢", text: "500+ LLCs Opened" },
  { icon: "⚡", text: "Ready in 48–72 Hours" },
  { icon: "🛡️", text: "100% Money-Back Guarantee" },
  { icon: "🔒", text: "Stripe Secure Payments" },
  { icon: "👨‍💼", text: "Licensed CPA Partner" },
];

export function TrustBar() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-12 bg-muted border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          {trustItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-semibold text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
