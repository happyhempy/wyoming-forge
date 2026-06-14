import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { generateSS4Pdf } from "@/lib/generateSS4";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface Props {
  userCase: Case;
}

const approvalKey = (id: string) => `ss4_approved_${id}`;

export function SS4Review({ userCase }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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

  const fullName = [userCase.first_name, userCase.last_name].filter(Boolean).join(" ").trim();
  const merchandise = (userCase.products_services || userCase.business_purpose || "").trim();
  const startDate = userCase.business_start_date
    ? new Date(userCase.business_start_date).toLocaleDateString("en-US")
    : "Upon formation";

  const ss4Rows: Array<{ line: string; label: string; value: string }> = [
    { line: "1", label: "Legal name of entity (LLC)", value: userCase.llc_name || "—" },
    { line: "2", label: "Trade name / DBA", value: userCase.trade_name || "—" },
    { line: "6", label: "County and state of principal business", value: "Laramie, WY" },
    { line: "7a", label: "Name of responsible party", value: fullName || "—" },
    { line: "7b", label: "SSN / ITIN / EIN", value: "FOREIGN" },
    { line: "8a", label: "Is this an LLC?", value: "Yes" },
    { line: "8b", label: "Number of members", value: userCase.sole_owner ? "1" : "—" },
    { line: "8c", label: "Organized in the United States?", value: "Yes" },
    { line: "9a", label: "Type of entity", value: userCase.sole_owner ? "Disregarded entity — sole proprietorship" : "LLC" },
    { line: "10", label: "Reason for applying", value: `Started new business — ${merchandise.toUpperCase() || "—"}` },
    { line: "11", label: "Date business started", value: startDate },
    { line: "12", label: "Closing month of accounting year", value: "December" },
    { line: "13", label: "Employees expected (next 12 months)", value: "0" },
    { line: "16", label: "Principal activity", value: merchandise.toUpperCase() || "—" },
    { line: "17", label: "Principal merchandise / services", value: merchandise.toUpperCase() || "—" },
    { line: "18", label: "Previously applied for an EIN?", value: "No" },
    { line: "Sig", label: "Applicant signature", value: fullName ? `${fullName}, Member` : "—" },
  ];

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
        setPdfUrl(url);
      } catch (e: any) {
        console.error("SS-4 generation failed:", e);
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

  const openPdf = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    // Use a navigation-based download — works inside sandboxed preview iframes
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = filename;
    a.rel = "noopener";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApprove = () => {
    const at = new Date().toISOString();
    localStorage.setItem(approvalKey(userCase.id), at);
    setApprovedAt(at);
  };

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">IRS Form SS-4 — Review & Approve</h2>
          <p className="text-sm text-muted-foreground">
            This is the form we submit to the IRS to obtain your EIN. Review every line, then approve so we can file it after Wyoming approves your LLC.
          </p>
        </div>
        {approvedAt && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-green-500/15 text-green-600 px-2 py-1 rounded-full font-semibold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        )}
      </div>

      {/* Inline SS-4 summary — replaces the PDF iframe which is blocked in sandboxed previews */}
      <div className="mt-5 border border-border rounded-xl bg-background overflow-hidden">
        <div className="bg-navy text-white px-4 py-3">
          <p className="text-[10px] tracking-[0.25em] uppercase opacity-70">Form SS-4 (Rev. 12-2023)</p>
          <p className="text-sm font-bold">Application for Employer Identification Number</p>
          <p className="text-[11px] opacity-70">Department of the Treasury — Internal Revenue Service</p>
        </div>

        <div className="divide-y divide-border">
          {ss4Rows.map((r) => (
            <div key={r.line} className="flex gap-3 px-4 py-2.5 text-sm">
              <div className="w-10 shrink-0 text-[11px] font-mono text-gold font-bold pt-0.5">{r.line}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</p>
                <p className="font-semibold break-words">{r.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-muted/30 text-[11px] text-muted-foreground border-t border-border">
          The <strong>Third Party Designee</strong> section is intentionally left blank and completed by our filing team before submission to the IRS.
        </div>
      </div>

      {/* Actions */}
      {error && (
        <div className="mt-4">
          <span className="text-xs text-destructive">{error}</span>
        </div>
      )}
          </span>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      {!approvedAt ? (
        <div className="mt-5 space-y-4">
          <div className="bg-gold/5 border border-gold/30 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">⚠️ Please review carefully</p>
            <p className="text-muted-foreground">
              Verify your <strong className="text-foreground">LLC name</strong>, <strong className="text-foreground">responsible party</strong>, and <strong className="text-foreground">business activity</strong>. If anything is wrong, update your intake details first.
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
              I have reviewed the SS-4 details above and confirm they are correct. I authorize USADOC to submit this form to the IRS on my behalf.
            </label>
          </div>

          <Button
            variant="gold"
            size="lg"
            disabled={!confirmed}
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
