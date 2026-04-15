interface UpsellItem {
  icon: string;
  title: string;
  description: string;
  price: string;
  recurring?: string;
}

const upsells: UpsellItem[] = [
  {
    icon: "📄",
    title: "Annual Report Filing",
    description: "We file your annual report with Wyoming on time, every year. Never miss a deadline.",
    price: "$99",
    recurring: "/year",
  },
  {
    icon: "📮",
    title: "Registered Agent Renewal",
    description: "Keep your Wyoming registered agent active. Required by law for every LLC.",
    price: "$149",
    recurring: "/year",
  },
  {
    icon: "📋",
    title: "Operating Agreement",
    description: "Custom Operating Agreement tailored to your LLC structure. Required by banks and partners.",
    price: "$149",
  },
  {
    icon: "📬",
    title: "Virtual Address & Mail Forwarding",
    description: "US business address with mail scanning and forwarding to your international address.",
    price: "$29",
    recurring: "/month",
  },
  {
    icon: "🔏",
    title: "Apostille Service",
    description: "Get your LLC documents apostilled for international legal recognition.",
    price: "$199",
  },
];

export function UpsellSection() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
          <span className="text-xl">🛒</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Additional Services</h2>
          <p className="text-sm text-muted-foreground">Grow and protect your LLC</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upsells.map((item) => (
          <div
            key={item.title}
            className="border border-border rounded-xl p-4 hover:border-gold/30 transition-colors flex flex-col"
          >
            <span className="text-2xl mb-2">{item.icon}</span>
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground flex-1 mb-3">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold">
                {item.price}
                {item.recurring && <span className="text-xs text-muted-foreground font-normal">{item.recurring}</span>}
              </span>
              <a
                href="https://wa.me/1234567890?text=Hi%2C%20I%27d%20like%20to%20add%20the%20service%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gold/10 text-gold px-3 py-1.5 rounded-lg font-medium hover:bg-gold/20 transition-colors"
              >
                Inquire
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
