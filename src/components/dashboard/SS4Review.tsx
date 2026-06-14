import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { generateSS4Pdf, downloadBlob } from "@/lib/generateSS4";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface Props {
  userCase: Case;
}

const approvalKey = (id: string) => `ss4_approved_${id}`;

export function SS4Review({ userCase }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(approvalKey(userCase.id)) : null,
  );

  const filename = useMemo(
    () => `SS-4_${(userCase.llc_name || "LLC").replace(/[^a-z0-9]+/gi, "_")}.pdf`,
    [userCase.llc_name],
  );

  useEffect(() => {
    let revokeUrl: string | null = null;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const b = await generateSS4Pdf(userCase, null);
        if (cancelled) return;
        const url = URL.createObjectURL(b);
        revokeUrl = url;
        setBlob(b);
        setPdfUrl(url);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to generate SS-4");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [userCase]);

  const handleApprove = () => {
    const at = new Date().toISOString();
    localStorage.setItem(approvalKey(userCase.id), at);
    setApprovedAt(at);
  };

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">IRS Form SS-4 — Review & Approve</h2>
          <p className="text-sm text-muted-foreground">
            This is the form we submit to the IRS to obtain your EIN. Please review the auto-filled details before we send it.
          </p>
        </div>
        {approvedAt && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-green-500/15 text-green-600 px-2 py-1 rounded-full font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        )}
      </div>

      {/* PDF preview */}
      <div className="mt-5 border border-border rounded-xl overflow-hidden bg-background">
        {loading && (
          <div className="h-[480px] flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Generating your SS-4 form...
            </div>
          </div>
        )}
        {error && (
          <div className="h-[200px] flex items-center justify-center text-sm text-destructive px-4 text-center">
            {error}
          </div>
        )}
        {!loading && !error && pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="SS-4 Form Preview"
            className="w-full h-[600px]"
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!blob}
          onClick={() => blob && downloadBlob(blob, filename)}
        >
          <Download className="w-4 h-4 mr-1" /> Download PDF
        </Button>
      </div>

      {!approvedAt ? (
        <div className="mt-5 space-y-4">
          <div className="bg-gold/5 border border-gold/30 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">⚠️ Please review carefully</p>
            <p className="text-muted-foreground">
              Verify your <strong className="text-foreground">LLC name</strong>, <strong className="text-foreground">responsible party</strong>, and <strong className="text-foreground">business activity</strong> in the form above. If anything looks wrong, update your intake details first.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="ss4-confirm"
              checked={confirmed}
              onCheckedChange={(c) => setConfirmed(c === true)}
              className="mt-0.5"
            />
            <label htmlFor="ss4-confirm" className="text-sm leading-relaxed cursor-pointer">
              I have reviewed the SS-4 form above and confirm the information is correct. I authorize USADOC to submit it to the IRS on my behalf.
            </label>
          </div>

          <Button
            variant="gold"
            size="lg"
            disabled={!confirmed || loading || !!error}
            onClick={handleApprove}
            className="w-full sm:w-auto"
          >
            Approve SS-4 Form
          </Button>
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-green-500/5 border border-green-500/20 p-4 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">SS-4 Approved</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Approved on {new Date(approvedAt).toLocaleString("en-US")}. We'll file it with the IRS as soon as Wyoming approves your LLC.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
