import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

interface ActionAlertsProps {
  userCase: Case;
  steps: CaseStep[];
  documents: Document[];
}

export function ActionAlerts({ userCase, steps, documents }: ActionAlertsProps) {
  const alerts: { icon: string; message: string; priority: "high" | "medium" }[] = [];

  const intakeComplete = !!(userCase.first_name && userCase.last_name && userCase.llc_name);
  const hasPassport = documents.some((d) => d.document_type.toLowerCase().includes("passport"));

  // Only show alerts for steps not already shown as dedicated UI sections
  if (intakeComplete && !hasPassport && !userCase.articles_signed_at) {
    alerts.push({ icon: "🪪", message: "Upload your passport to continue — scroll down.", priority: "high" });
  }

  if (intakeComplete && hasPassport && !userCase.articles_signed_at) {
    alerts.push({ icon: "✍️", message: "Review and sign your Articles of Organization — scroll down.", priority: "high" });
  }

  if (userCase.articles_signed_at) {
    const currentStep = steps.find((s) => s.status === "in_progress");
    if (currentStep) {
      alerts.push({ icon: "⏳", message: `In progress: ${currentStep.step_name}`, priority: "medium" });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
            alert.priority === "high"
              ? "bg-gold/10 border border-gold/30 text-foreground"
              : "bg-muted/50 border border-border text-muted-foreground"
          }`}
        >
          <span className="text-lg">{alert.icon}</span>
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
}
