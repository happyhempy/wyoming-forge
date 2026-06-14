import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Send, Upload, FileText, Download, User, Mail, Phone } from "lucide-react";
import { addDemoDocument, addDemoMessage, getDemoMode, updateDemoStep } from "@/lib/demoAccess";
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

  const handleDocUpload = async (file: File) => {
    if (getDemoMode()) {
      addDemoDocument(file.name, "llc_document", caseData.assigned_admin ?? undefined);
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
      document_type: "llc_document",
    });
    onRefresh();
  };

  const handleDownload = async (doc: Document) => {
    if (getDemoMode()) {
      alert(`${doc.file_name} is a demo document.`);
      return;
    }

    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
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
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-xl">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upload document for client</p>
                    <p className="text-xs text-muted-foreground">PDF, images, or other files</p>
                  </div>
                  <Input
                    type="file"
                    className="w-auto max-w-[200px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocUpload(file);
                    }}
                  />
                </div>
                {caseData.documents && caseData.documents.length > 0 ? (
                  <div className="space-y-2">
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
                  <p className="text-muted-foreground text-sm text-center py-4">No documents uploaded yet.</p>
                )}
              </div>
            )}

            {/* Client Info Tab */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: User, label: "Name", value: `${caseData.first_name ?? "—"} ${caseData.last_name ?? ""}` },
                  { icon: Mail, label: "Email", value: caseData.profile?.full_name ?? "See profile" },
                  { icon: Phone, label: "Phone", value: caseData.profile?.phone ?? "—" },
                  { label: "LLC Name", value: caseData.llc_name ?? "—" },
                  { label: "Trade Name", value: caseData.trade_name ?? "—" },
                  { label: "Business Purpose", value: caseData.business_purpose ?? "—" },
                  { label: "Products/Services", value: caseData.products_services ?? "—" },
                  { label: "Sole Owner", value: caseData.sole_owner ? "Yes" : "No" },
                  { label: "Package", value: caseData.package?.toUpperCase() ?? "—" },
                  { label: "Start Date", value: caseData.business_start_date ?? "—" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
