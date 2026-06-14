import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface Props {
  userCase: Case;
}

export function ProcessingStatus({ userCase }: Props) {
  const signedAt = userCase.articles_signed_at ? new Date(userCase.articles_signed_at) : new Date();
  const eta = new Date(signedAt.getTime() + 72 * 60 * 60 * 1000);
  const etaStr = eta.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const signedStr = signedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const steps = [
    {
      status: "done" as const,
      title: "Signature received",
      desc: `We received your signed Articles of Organization on ${signedStr}.`,
    },
    {
      status: "active" as const,
      title: "Filing submitted to the State of Wyoming",
      desc: "Your LLC formation documents have been submitted to the Wyoming Secretary of State for official registration. This is the step where your company is legally created in the U.S.",
    },
    {
      status: "pending" as const,
      title: "Awaiting state approval",
      desc: `The state typically approves new LLCs within 48–72 hours. Expected approval by ${etaStr}.`,
    },
    {
      status: "pending" as const,
      title: "EIN application",
      desc: "Once your LLC is approved, we'll automatically file your EIN (Federal Tax ID) with the IRS.",
    },
  ];

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
          <span className="text-xl">🏛️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Your LLC is being filed with the State of Wyoming</h2>
          <p className="text-sm text-muted-foreground">Here's exactly what's happening right now and what comes next.</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-gold/5 border border-gold/20 p-4">
        <p className="text-sm">
          <span className="font-semibold">Current status: </span>
          Your formation documents were sent to the Wyoming Secretary of State and are now waiting for official approval. Estimated approval by{" "}
          <span className="font-semibold">{etaStr}</span>.
        </p>
      </div>

      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step.status === "done"
                    ? "bg-green-500/15 text-green-600 border border-green-500/30"
                    : step.status === "active"
                    ? "bg-gold/20 text-gold border border-gold/40 animate-pulse"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {step.status === "done" ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
            </div>
            <div className="pb-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{step.title}</p>
                {step.status === "active" && (
                  <span className="text-[10px] uppercase tracking-wide bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold">
                    In progress now
                  </span>
                )}
                {step.status === "done" && (
                  <span className="text-[10px] uppercase tracking-wide bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full font-semibold">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
        💡 You don't need to do anything right now. We'll email you and update this dashboard the moment Wyoming approves your LLC.
      </div>
    </div>
  );
}
