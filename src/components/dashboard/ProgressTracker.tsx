import type { Database } from "@/integrations/supabase/types";

type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];

const STEP_NAMES = [
  "Payment Received",
  "Documents Submitted",
  "Articles of Organization Filed",
  "EIN Application Submitted",
  "EIN Received",
  "Registered Agent Confirmed",
  "Mercury Bank Account",
  "Process Complete 🎉",
];

interface ProgressTrackerProps {
  steps: CaseStep[];
  packageType: string;
}

export function ProgressTracker({ steps, packageType }: ProgressTrackerProps) {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / STEP_NAMES.length) * 100);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Progress Tracker</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {progressPercent}% complete
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-1">
        {STEP_NAMES.map((name, i) => {
          const step = steps.find((s) => s.step_number === i + 1);
          const status = step?.status ?? "pending";
          const isMercuryLocked = i === 6 && packageType === "basic" && status !== "completed";

          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                status === "in_progress" ? "bg-gold/5" : ""
              }`}
            >
              {/* Step indicator */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                    status === "completed"
                      ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                      : status === "in_progress"
                      ? "bg-gold text-navy-dark shadow-sm shadow-gold/30 animate-pulse"
                      : isMercuryLocked
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status === "completed" ? "✓" : i + 1}
                </div>
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    status === "completed"
                      ? "text-green-500"
                      : status === "in_progress"
                      ? "text-gold"
                      : "text-foreground"
                  }`}
                >
                  {name}
                  {isMercuryLocked && " 🔒"}
                </p>
                {status === "in_progress" && (
                  <p className="text-xs text-gold mt-0.5">In Progress — we're working on it</p>
                )}
                {step?.completed_at && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed {new Date(step.completed_at).toLocaleDateString()}
                  </p>
                )}
                {isMercuryLocked && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Available in Popular & Premium packages
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
