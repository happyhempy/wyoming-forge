import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Send, Upload, FileText, Download, User, FileSignature, Award } from "lucide-react";
import { addDemoDocument, addDemoMessage, getDemoMode, updateDemoStep } from "@/lib/demoAccess";
import { generateSS4Pdf, downloadBlob } from "@/lib/generateSS4";
import { generateArticlesPdf } from "@/lib/generateArticles";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AdminCaseCardProps {
  caseData: Case & { steps?: CaseStep[]; messages?: Message[]; documents?: Document[]; profile?: Profile | null };
  onRefresh: () => void;
}

const STEP_NAMES = [
  "Payment Received",
  "Documents Submitted",
  "Articles of Organization Filed",
  "EIN Application Submitted",
  "EIN Received",
  "Registered Agent Confirmed",
  "Mercury Bank Account",
  "Process Complete",
];

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_progress: "bg-gold/20 text-gold",
  completed: "bg-emerald-500/20 text-emerald-400",
  locked: "bg-red-500/20 text-red-400",
};

export function AdminCaseCard({ caseData, onRefresh }: AdminCaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"steps" | "messages" | "documents" | "info">("steps");
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);

  const completedSteps = caseData.steps?.filter((s) => s.status === "completed").length ?? 0;
  const totalSteps = STEP_NAMES.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const updateStep = async (stepNumber: number, status: Database["public"]["Enums"]["step_status"]) => {
    if (getDemoMode()) {
      updateDemoStep(stepNumber, status);
      onRefresh();
      return;
    }

    await supabase
      .from("case_steps")
      .update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("case_id", caseData.id)
      .eq("step_number", stepNumber);

    // Update current_step on the case
    if (status === "completed") {
      const nextStep = Math.min(stepNumber + 1, totalSteps);
      await supabase.from("cases").update({ current_step: nextStep }).eq("id", caseData.id);
    }
    onRefresh();
  };

  const sendMessage = async () => {
    if (!messageContent.trim()) return;
    setSending(true);
    if (getDemoMode()) {
      addDemoMessage(messageContent.trim(), "admin");
      setMessageContent("");
      setSending(false);
      onRefresh();
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      case_id: caseData.id,
      sender_id: user.id,
      sender_role: "admin" as const,
      content: messageContent.trim(),
    });
    setMessageContent("");
    setSending(false);
    onRefresh();
  };

  const handleDocUpload = async (file: File, documentType: string) => {
    if (getDemoMode()) {
      addDemoDocument(file.name, documentType, caseData.assigned_admin ?? undefined);
      onRefresh();
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `admin/${caseData.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(filePath, file);
    if (error) return;

    await supabase.from("documents").insert({
      case_id: caseData.id,
      uploaded_by: user.id,
      file_url: filePath,
      file_name: file.name,
      document_type: documentType,
    });
    onRefresh();
  };

  const [generatingSS4, setGeneratingSS4] = useState(false);
  const [generatingArticles, setGeneratingArticles] = useState(false);

  const handleGenerateSS4 = async () => {
    setGeneratingSS4(true);
    try {
      const blob = await generateSS4Pdf(caseData, caseData.profile ?? null);
      const safeName = (caseData.llc_name || "case").replace(/[^a-z0-9]+/gi, "_");
      downloadBlob(blob, `SS4-${safeName}.pdf`);
    } catch (e) {
      console.error("SS-4 generation failed:", e);
      alert("Failed to generate SS-4. See console for details.");
    } finally {
      setGeneratingSS4(false);
    }
  };

  const handleGenerateArticles = async () => {
    setGeneratingArticles(true);
    try {
      const blob = await generateArticlesPdf(caseData, caseData.profile ?? null);
      const safeName = (caseData.llc_name || "case").replace(/[^a-z0-9]+/gi, "_");
      downloadBlob(blob, `ArticlesOfOrganization-${safeName}.pdf`);
    } catch (e) {
      console.error("Articles generation failed:", e);
      alert("Failed to generate Articles of Organization. See console for details.");
    } finally {
      setGeneratingArticles(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (getDemoMode()) {
      alert(`${doc.file_name} is a demo document.`);
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session?.access_token) {
      alert("Admin session expired. Please sign in again.");
      return;
    }

    const response = await fetch(`/api/admin/documents/${encodeURIComponent(doc.id)}`, {
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    });

    if (!response.ok) {
      const message = await response.text();
      alert(message || "Download failed. Please try again.");
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, doc.file_name);
  };

  const paymentBadge = caseData.payment_status === "completed"
    ? <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Paid</Badge>
    : <Badge className="bg-yellow-500/20 text-yellow-400 border-0 capitalize">{caseData.payment_status}</Badge>;

  const tabs = [
    { id: "steps" as const, label: "Steps" },
    { id: "messages" as const, label: `Messages (${caseData.messages?.length ?? 0})` },
    { id: "documents" as const, label: `Docs (${caseData.documents?.length ?? 0})` },
    { id: "info" as const, label: "Client Info" },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-gold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base">{caseData.llc_name || "Unnamed LLC"}</h3>
              <Badge variant="outline" className="capitalize text-xs">{caseData.package}</Badge>
              {paymentBadge}
            </div>
            <p className="text-sm text-muted-foreground">
              {caseData.first_name} {caseData.last_name} • Created {new Date(caseData.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{progressPercent}%</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border">
          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? "text-gold border-b-2 border-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* Steps Tab */}
            {activeTab === "steps" && (
              <div className="space-y-2">
                {STEP_NAMES.map((name, i) => {
                  const step = caseData.steps?.find((s) => s.step_number === i + 1);
                  const status = step?.status ?? "pending";
                  return (
                    <div key={i} className="flex items-center justify-between py-3 px-4 bg-muted/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${statusColors[status]}`}>
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      <select
                        value={status}
                        onChange={(e) => updateStep(i + 1, e.target.value as Database["public"]["Enums"]["step_status"])}
                        className="text-sm bg-background border border-border rounded-lg px-3 py-1.5 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="locked">Locked</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                  {(!caseData.messages || caseData.messages.length === 0) ? (
                    <p className="text-muted-foreground text-sm text-center py-6">No messages yet.</p>
                  ) : (
                    caseData.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl ${
                          msg.sender_role !== "client"
                            ? "bg-gold/10 ml-8 rounded-br-sm"
                            : "bg-muted/50 mr-8 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground mb-1 capitalize">
                          {msg.sender_role === "client" ? "Client" : "Admin"} · {new Date(msg.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Message to client..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-1 min-h-[44px]"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button variant="gold" onClick={sendMessage} disabled={sending || !messageContent.trim()} className="self-end" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-5">
                {/* Articles of Organization Auto-Generator */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <FileSignature className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">Generate Articles of Organization (Wyoming LLC)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Auto-fills the Wyoming SOS Articles of Organization with this client's intake data. Submit to Wyoming Secretary of State to form the LLC.
                      </p>
                      <Button
                        variant="gold"
                        size="sm"
                        className="mt-3"
                        onClick={handleGenerateArticles}
                        disabled={generatingArticles || !caseData.llc_name || !caseData.client_address_line}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {generatingArticles ? "Generating..." : "Generate Articles PDF"}
                      </Button>
                      {!caseData.client_address_line && (
                        <p className="text-xs text-yellow-500 mt-2">Client must complete intake (incl. address) first.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SS-4 Auto-Generator */}
                <div className="p-4 bg-gold/5 border border-gold/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                      <FileSignature className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">Generate SS-4 (EIN Application)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Auto-fills the IRS SS-4 form with this client's intake data. Review and complete the Third-Party Designee section manually before submitting.
                      </p>
                      <Button
                        variant="gold"
                        size="sm"
                        className="mt-3"
                        onClick={handleGenerateSS4}
                        disabled={generatingSS4 || !caseData.llc_name}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {generatingSS4 ? "Generating..." : "Generate SS-4 PDF"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upload — Filed Articles from Wyoming */}
                <div className="p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <p className="text-sm font-semibold">Approved LLC document (from State of Wyoming)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload the filed Articles / Certificate of Organization once Wyoming approves the LLC. The client will see it on their dashboard.
                  </p>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocUpload(file, "llc_certificate");
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* Upload — EIN Letter */}
                <div className="p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gold" />
                    <p className="text-sm font-semibold">EIN Confirmation Letter (CP-575)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload the IRS-issued EIN confirmation. The client's "EIN Received" step will reflect this on their dashboard.
                  </p>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocUpload(file, "ein_letter");
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* Other upload */}
                <div className="p-4 border border-dashed border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">Other document</p>
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocUpload(file, "llc_document");
                      e.target.value = "";
                    }}
                  />
                </div>

                {caseData.documents && caseData.documents.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">All Documents</p>
                    {caseData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-gold shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {doc.document_type.replace(/_/g, " ")} · {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-2">No documents uploaded yet.</p>
                )}
              </div>
            )}

            {/* Client Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-6">
                {/* Personal */}
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Personal</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Full Name", value: `${caseData.first_name ?? "—"} ${caseData.last_name ?? ""}` },
                      { label: "Profile Name", value: caseData.profile?.full_name ?? "—" },
                      { label: "Phone", value: caseData.profile?.phone ?? "—" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LLC Details */}
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">LLC Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "LLC Name", value: caseData.llc_name ?? "—" },
                      { label: "Trade Name (DBA)", value: caseData.trade_name ?? "—" },
                      { label: "Business Purpose", value: caseData.business_purpose ?? "—" },
                      { label: "Products / Services", value: caseData.products_services ?? "—" },
                      { label: "Sole Owner", value: caseData.sole_owner ? "Yes" : "No" },
                      { label: "Expected Start Date", value: caseData.business_start_date ?? "—" },
                      { label: "Package", value: caseData.package?.toUpperCase() ?? "—" },
                      { label: "Years Paid", value: caseData.years_paid ?? "—" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-medium">{String(item.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passport */}
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Passport / ID</h4>
                  {caseData.passport_url ? (
                    <div className="p-3 bg-muted/20 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-gold shrink-0" />
                        <p className="text-sm font-medium truncate">Passport uploaded</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const { data } = await supabase.storage.from("documents").createSignedUrl(caseData.passport_url!, 3600);
                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" /> View
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-xl">Not uploaded yet.</p>
                  )}
                </div>

                {/* Articles Signature */}
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Articles of Organization — Signature</h4>
                  {caseData.articles_signed_at ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <p className="text-sm">
                        ✅ Signed by <span className="font-bold italic font-serif">{caseData.articles_signature_name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        on {new Date(caseData.articles_signed_at).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-xl">Awaiting client signature.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
