import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

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

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard — US LLC Formation" }],
  }),
});

function DashboardPage() {
  const [userCase, setUserCase] = useState<Case | null>(null);
  const [steps, setSteps] = useState<CaseStep[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showIntake, setShowIntake] = useState(false);

  // Intake form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [llcName, setLlcName] = useState("");
  const [soleOwner, setSoleOwner] = useState(true);
  const [partners, setPartners] = useState<{ full_name: string; email: string; ownership_percentage: number }[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cases } = await supabase
      .from("cases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (cases && cases.length > 0) {
      const c = cases[0];
      setUserCase(c);

      // Check if intake form needed
      if (!c.first_name || !c.last_name) {
        setShowIntake(true);
      }

      const { data: stepsData } = await supabase
        .from("case_steps")
        .select("*")
        .eq("case_id", c.id)
        .order("step_number");
      setSteps(stepsData ?? []);

      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("case_id", c.id)
        .order("created_at", { ascending: false });
      setDocuments(docsData ?? []);

      const { data: msgsData } = await supabase
        .from("messages")
        .select("*")
        .eq("case_id", c.id)
        .order("created_at");
      setMessages(msgsData ?? []);
    }
    setLoading(false);
  };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCase) return;

    const { error } = await supabase
      .from("cases")
      .update({ first_name: firstName, last_name: lastName, llc_name: llcName, sole_owner: soleOwner })
      .eq("id", userCase.id);

    if (error) return;

    if (!soleOwner && partners.length > 0) {
      const totalOwnership = partners.reduce((sum, p) => sum + p.ownership_percentage, 0);
      if (totalOwnership !== 100) {
        alert("Partner ownership must total exactly 100%");
        return;
      }
      await supabase
        .from("partners")
        .insert(partners.map((p) => ({ ...p, case_id: userCase.id })));
    }

    setShowIntake(false);
    loadDashboard();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userCase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      case_id: userCase.id,
      sender_id: user.id,
      sender_role: "client" as const,
      content: newMessage.trim(),
    });

    setNewMessage("");
    loadDashboard();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userCase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) return;

    await supabase.from("documents").insert({
      case_id: userCase.id,
      uploaded_by: user.id,
      file_url: filePath,
      file_name: file.name,
      document_type: "passport",
    });

    loadDashboard();
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

  if (!userCase) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">No Active Case</h1>
            <p className="text-muted-foreground mb-6">You don't have an active LLC formation case yet. Get started by choosing a package.</p>
            <a href="/#pricing"><Button variant="gold">View Packages</Button></a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Package: <span className="font-semibold capitalize text-gold">{userCase.package}</span>
          </p>

          {/* Intake Form Modal */}
          {showIntake && (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Complete Your Details</h2>
              <form onSubmit={handleIntakeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name (as on passport)</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <Label>Last Name (as on passport)</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Desired LLC Name</Label>
                  <Input value={llcName} onChange={(e) => setLlcName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label>Passport Photo (PDF or JPG)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="mt-1" />
                </div>
                <div>
                  <Label>Ownership Structure</Label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={soleOwner} onChange={() => setSoleOwner(true)} />
                      <span className="text-sm">Sole Owner</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={!soleOwner} onChange={() => setSoleOwner(false)} />
                      <span className="text-sm">I have partners</span>
                    </label>
                  </div>
                </div>

                {!soleOwner && (
                  <div className="space-y-3 border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <Label>Partners</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => setPartners([...partners, { full_name: "", email: "", ownership_percentage: 0 }])}>
                        + Add Partner
                      </Button>
                    </div>
                    {partners.map((p, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2">
                        <Input placeholder="Full Name" value={p.full_name} onChange={(e) => { const np = [...partners]; np[i].full_name = e.target.value; setPartners(np); }} />
                        <Input placeholder="Email" value={p.email} onChange={(e) => { const np = [...partners]; np[i].email = e.target.value; setPartners(np); }} />
                        <Input type="number" placeholder="%" value={p.ownership_percentage || ""} onChange={(e) => { const np = [...partners]; np[i].ownership_percentage = Number(e.target.value); setPartners(np); }} />
                      </div>
                    ))}
                    {partners.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Total: {partners.reduce((s, p) => s + p.ownership_percentage, 0)}% — must equal 100%
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit" variant="gold">Submit Details</Button>
              </form>
            </div>
          )}

          {/* Progress Tracker */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Progress Tracker</h2>
            <div className="space-y-4">
              {STEP_NAMES.map((name, i) => {
                const step = steps.find((s) => s.step_number === i + 1);
                const status = step?.status ?? "pending";
                const isMercuryLocked = i === 6 && userCase.package === "basic" && status !== "completed";

                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      status === "completed" ? "bg-green-500 text-white" :
                      status === "in_progress" ? "bg-gold text-navy-dark" :
                      isMercuryLocked ? "bg-muted text-muted-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {status === "completed" ? "✓" : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${status === "completed" ? "text-green-500" : ""}`}>
                        {name}
                        {isMercuryLocked && " 🔒"}
                      </p>
                      {status === "in_progress" && <p className="text-xs text-gold">In Progress</p>}
                      {step?.completed_at && <p className="text-xs text-muted-foreground">{new Date(step.completed_at).toLocaleDateString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Documents</h2>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No documents available yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{doc.file_name}</span>
                    <Button variant="outline" size="sm" onClick={async () => {
                      const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 3600);
                      if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                    }}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${msg.sender_role === "client" ? "bg-gold/10 ml-8" : "bg-muted/50 mr-8"}`}>
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{msg.sender_role} • {new Date(msg.created_at).toLocaleString()}</p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" rows={2} />
              <Button variant="gold" onClick={handleSendMessage} className="self-end">Send</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
