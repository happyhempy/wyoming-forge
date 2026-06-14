import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface Props {
  userCase: Case;
}

export function ProcessingStatus({ userCase }: Props) {
  const signedAt = userCase.articles_signed_at ? new Date(userCase.articles_signed_at) : new Date();
  const eta = new Date(signedAt.getTime() + 72 * 60 * 60 * 1000);
  const etaStr = eta.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
          <span className="text-2xl">⏳</span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Filing in progress</h2>
          <p className="text-muted-foreground mt-1">
            ✅ Signature received on{" "}
            <span className="font-semibold text-foreground">
              {signedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            . Your LLC is now being filed with the Wyoming Secretary of State.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Processing time</p>
              <p className="font-semibold mt-0.5">48 – 72 hours</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Expected by</p>
              <p className="font-semibold mt-0.5">{etaStr}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Next step</p>
              <p className="font-semibold mt-0.5">EIN application</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            You'll get an email and dashboard notification the moment your LLC is approved. No action needed from you in the meantime.
          </p>
        </div>
      </div>
    </div>
  );
}
