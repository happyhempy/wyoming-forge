import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface LLCDetailsCardProps {
  userCase: Case;
}

export function LLCDetailsCard({ userCase }: LLCDetailsCardProps) {
  const isComplete = !!(userCase.first_name && userCase.last_name && userCase.llc_name);
  const [open, setOpen] = useState(!isComplete);

  const details = [
    { label: "LLC Name", value: userCase.llc_name || "Pending" },
    { label: "State", value: "Wyoming" },
    { label: "Package", value: userCase.package.charAt(0).toUpperCase() + userCase.package.slice(1) },
    { label: "Owner", value: userCase.first_name && userCase.last_name ? `${userCase.first_name} ${userCase.last_name}` : "Pending" },
    { label: "Payment Status", value: userCase.payment_status.charAt(0).toUpperCase() + userCase.payment_status.slice(1) },
    { label: "Started", value: new Date(userCase.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <span className="text-xl">🏢</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">LLC Details</h2>
            {!open && isComplete && (
              <p className="text-sm text-muted-foreground">
                {userCase.llc_name} · {userCase.first_name} {userCase.last_name}
              </p>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {details.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <p className="font-semibold mt-0.5 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
