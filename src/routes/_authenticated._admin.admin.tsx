import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
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

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [{ title: "Admin Panel — US LLC Formation" }],
  }),
});

function AdminPanel() {
  const [cases, setCases] = useState<(Case & { steps?: CaseStep[] })[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if superadmin
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isSuperAdmin = roles?.some((r) => r.role === "superadmin");

    let query = supabase.from("cases").select("*").order("created_at", { ascending: false });
    if (!isSuperAdmin) {
      query = query.eq("assigned_admin", user.id);
    }

    const { data: casesData } = await query;

    if (casesData) {
      const withSteps = await Promise.all(
        casesData.map(async (c) => {
          const { data: steps } = await supabase
            .from("case_steps")
            .select("*")
            .eq("case_id", c.id)
            .order("step_number");
          return { ...c, steps: steps ?? [] };
        })
      );
      setCases(withSteps);
    }
    setLoading(false);
  };

  const updateStep = async (caseId: string, stepNumber: number, status: Database["public"]["Enums"]["step_status"]) => {
    await supabase
      .from("case_steps")
      .update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("case_id", caseId)
      .eq("step_number", stepNumber);
    loadCases();
  };

  const sendMessage = async (caseId: string) => {
    if (!messageContent.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      case_id: caseId,
      sender_id: user.id,
      sender_role: "admin" as const,
      content: messageContent.trim(),
    });
    setMessageContent("");
  };

  const handleDocUpload = async (caseId: string, file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `admin/${caseId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(filePath, file);
    if (error) return;

    await supabase.from("documents").insert({
      case_id: caseId,
      uploaded_by: user.id,
      file_url: filePath,
      file_name: file.name,
      document_type: "llc_document",
    });
    loadCases();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

          {cases.length === 0 ? (
            <p className="text-muted-foreground">No cases assigned to you.</p>
          ) : (
            <div className="space-y-4">
              {cases.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setSelectedCase(selectedCase === c.id ? null : c.id)}>
                    <div>
                      <h3 className="font-bold text-lg">{c.llc_name || "Unnamed LLC"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {c.first_name} {c.last_name} • <span className="capitalize">{c.package}</span> • Step {c.current_step}/8
                      </p>
                    </div>
                    <span className="text-muted-foreground">{selectedCase === c.id ? "▲" : "▼"}</span>
                  </div>

                  {selectedCase === c.id && (
                    <div className="space-y-6 border-t border-border pt-4">
                      {/* Steps */}
                      <div>
                        <h4 className="font-semibold mb-3">Progress Steps</h4>
                        <div className="space-y-2">
                          {STEP_NAMES.map((name, i) => {
                            const step = c.steps?.find((s) => s.step_number === i + 1);
                            const status = step?.status ?? "pending";
                            return (
                              <div key={i} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                                <span className="text-sm">{i + 1}. {name}</span>
                                <select
                                  value={status}
                                  onChange={(e) => updateStep(c.id, i + 1, e.target.value as any)}
                                  className="text-sm bg-background border border-border rounded px-2 py-1"
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
                      </div>

                      {/* Upload Document */}
                      <div>
                        <h4 className="font-semibold mb-2">Upload Document for Client</h4>
                        <Input type="file" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocUpload(c.id, file);
                        }} />
                      </div>

                      {/* Send Message */}
                      <div>
                        <h4 className="font-semibold mb-2">Send Message</h4>
                        <div className="flex gap-2">
                          <Textarea placeholder="Message to client..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="flex-1" rows={2} />
                          <Button variant="gold" onClick={() => sendMessage(c.id)} className="self-end">Send</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
