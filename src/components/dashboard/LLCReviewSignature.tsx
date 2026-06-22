import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getDemoMode, updateDemoCase, updateDemoStep, getDemoClientData, saveDemoClientData } from "@/lib/demoAccess";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface Props {
  userCase: Case;
  onSigned: () => void;
}

export function LLCReviewSignature({ userCase, onSigned }: Props) {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [signature, setSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fullName = `${userCase.first_name ?? ""} ${userCase.last_name ?? ""}`.trim();
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const rows = [
    { label: "Legal LLC Name", value: userCase.llc_name || "—" },
    { label: "Trade Name (DBA)", value: userCase.trade_name || "—" },
    { label: "State of Formation", value: "Wyoming, USA" },
    { label: "Responsible Party", value: fullName || "—" },
    { label: "Ownership Structure", value: userCase.sole_owner ? "Sole Owner (Single-Member LLC)" : "Multi-Member LLC" },
    { label: "Business Purpose", value: userCase.business_purpose || "—" },
    { label: "Products / Services", value: userCase.products_services || "—" },
    { label: "Expected Start Date", value: userCase.business_start_date ? new Date(userCase.business_start_date).toLocaleDateString("en-US") : "Upon formation" },
  ];

  const handleSign = async () => {
    if (!confirmed || !signature.trim()) return;
    setSubmitting(true);
    try {
      const signedAt = new Date().toISOString();
      if (getDemoMode()) {
        updateDemoCase({ articles_signed_at: signedAt, articles_signature_name: signature.trim() });
        // mark step 1 done & step 2 in progress
        const data = getDemoClientData();
        data.steps = data.steps.map((s) =>
          s.step_number === 1 ? { ...s, status: "completed", completed_at: signedAt } :
          s.step_number === 2 ? { ...s, status: "in_progress" } : s
        );
        data.case.current_step = 2;
        saveDemoClientData(data);
        onSigned();
        return;
      }
      const { error } = await supabase
        .from("cases")
        .update({ articles_signed_at: signedAt, articles_signature_name: signature.trim(), current_step: 2 })
        .eq("id", userCase.id);
      if (error) throw error;
      onSigned();
    } catch (e: any) {
      alert(e.message || "Failed to submit signature");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <span className="text-xl">📜</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Review & Sign — LLC Formation Summary</h2>
            <p className="text-sm text-muted-foreground">Please review the details below carefully. After your signature, we begin filing your LLC.</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <>
          {/* Document preview */}
          <div className="mt-5 border border-border rounded-xl bg-background p-6 sm:p-8 font-serif">
            <div className="text-center mb-5 pb-4 border-b border-border">
              <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase mb-1">State of Wyoming</p>
              <h3 className="text-xl font-bold">Articles of Organization — Summary</h3>
              <p className="text-xs text-muted-foreground mt-1">Limited Liability Company · Prepared {today}</p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground font-sans">{r.label}</dt>
                  <dd className="font-semibold text-foreground mt-0.5 break-words">{r.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
              By signing below, you confirm the information above is accurate and authorize <strong className="text-foreground">USADOC / Amer LLC</strong> to file this LLC formation with the Wyoming Secretary of State on your behalf.
            </div>
          </div>

          {/* Important notice */}
          <div className="mt-5 bg-gold/5 border border-gold/30 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">⚠️ Please review carefully</p>
            <p className="text-muted-foreground">
              Make sure every detail above — especially your <strong className="text-foreground">name spelling</strong> and the <strong className="text-foreground">LLC name</strong> — is exactly correct. Once filed with the state, changes require a paid amendment.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox id="confirm-review" checked={confirmed} onCheckedChange={(c) => setConfirmed(c === true)} className="mt-0.5" />
              <label htmlFor="confirm-review" className="text-sm leading-relaxed cursor-pointer">
                I have reviewed all the information above and confirm that it is correct and accurate to the best of my knowledge.
              </label>
            </div>

            <div>
              <Label>Digital Signature (type your full legal name)</Label>
              <Input
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder={fullName || "e.g. John Smith"}
                className="mt-1 italic font-serif text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                By typing your name, this serves as your electronic signature — Date: {today}
              </p>
            </div>

            <Button
              variant="gold"
              size="lg"
              disabled={!confirmed || !signature.trim() || submitting}
              onClick={handleSign}
              className="w-full sm:w-auto"
            >
              {submitting ? "Submitting..." : "Sign & Submit for Filing"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
