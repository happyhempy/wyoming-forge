import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDemoMode } from "@/lib/demoAccess";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

interface Props {
  userCase: Case;
  documents?: Document[];
}

export function ProcessingStatus({ userCase, documents = [] }: Props) {
  const llcCertificate = documents.find(
    (d) => d.document_type === "llc_certificate" || d.document_type === "llc_document",
  );
  const einLetter = documents.find((d) => d.document_type === "ein_letter");

  const signedAt = userCase.articles_signed_at ? new Date(userCase.articles_signed_at) : new Date();
  const eta = new Date(signedAt.getTime() + 72 * 60 * 60 * 1000);
  const etaStr = eta.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const signedStr = signedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleDownload = async (doc: Document) => {
    if (getDemoMode()) {
      alert(`${doc.file_name} is a demo document.`);
      return;
    }
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const steps = [
    {
      status: "done" as const,
      title: "Signature received",
      desc: `We received your signed Articles of Organization on ${signedStr}.`,
    },
    {
      status: llcCertificate ? ("done" as const) : ("active" as const),
      title: "Filing submitted to the State of Wyoming",
      desc: llcCertificate
        ? "Wyoming has approved your LLC. The official document is available below."
        : "Your LLC formation documents have been submitted to the Wyoming Secretary of State for official registration.",
    },
    {
      status: llcCertificate ? ("done" as const) : ("pending" as const),
      title: llcCertificate ? "LLC approved by Wyoming" : "Awaiting state approval",
      desc: llcCertificate
        ? `Your company is now legally formed in the United States.`
        : `Approval typically arrives within 48–72 hours. Expected by ${etaStr}.`,
    },
    {
      status: einLetter
        ? ("done" as const)
        : llcCertificate
        ? ("active" as const)
        : ("pending" as const),
      title: einLetter ? "EIN received from the IRS" : "EIN application",
      desc: einLetter
        ? "Your Federal Tax ID (EIN) has been issued. The IRS confirmation letter is available below."
        : llcCertificate
        ? "We are now filing your EIN (Federal Tax ID) with the IRS."
        : "Once your LLC is approved, we'll automatically file your EIN with the IRS.",
    },
  ];

  const allDone = !!llcCertificate && !!einLetter;

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
          <span className="text-xl">{allDone ? "🎉" : llcCertificate ? "✅" : "🏛️"}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {allDone
              ? "Your LLC and EIN are ready"
              : llcCertificate
              ? "Your LLC is approved — EIN in progress"
              : "Your LLC is being filed with the State of Wyoming"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {allDone
              ? "Everything is in place. Download your official documents below."
              : "Here's exactly what's happening right now and what comes next."}
          </p>
        </div>
      </div>

      {!llcCertificate && (
        <div className="mt-5 rounded-lg bg-gold/5 border border-gold/20 p-4">
          <p className="text-sm">
            <span className="font-semibold">Current status: </span>
            Your formation documents were sent to the Wyoming Secretary of State and are waiting for approval. Estimated by{" "}
            <span className="font-semibold">{etaStr}</span>.
          </p>
        </div>
      )}

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

      {(llcCertificate || einLetter) && (
        <div className="mt-5 space-y-2">
          {llcCertificate && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-green-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">Wyoming LLC Certificate</p>
                  <p className="text-xs text-muted-foreground truncate">{llcCertificate.file_name}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDownload(llcCertificate)}>
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
            </div>
          )}
          {einLetter && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gold/5 border border-gold/30">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">EIN Confirmation (IRS CP-575)</p>
                  <p className="text-xs text-muted-foreground truncate">{einLetter.file_name}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDownload(einLetter)}>
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
            </div>
          )}
        </div>
      )}

      {!allDone && (
        <div className="mt-5 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
          💡 You don't need to do anything right now. We'll email you and update this dashboard the moment each step is complete.
        </div>
      )}
    </div>
  );
}
