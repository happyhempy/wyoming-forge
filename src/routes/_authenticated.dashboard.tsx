import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { DocumentsList } from "@/components/dashboard/DocumentsList";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

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
  const [loading, setLoading] = useState(true);
  const [showIntake, setShowIntake] = useState(false);

  // Intake form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [llcName, setLlcName] = useState("");
  const [soleOwner, setSoleOwner] = useState(true);
  const [partners, setPartners] = useState<{ full_name: string; email: string; ownership_percentage: number }[]>([]);

  const loadDashboard = useCallback(async () => {
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
      if (!c.first_name || !c.last_name) setShowIntake(true);

      const [stepsRes, docsRes, msgsRes] = await Promise.all([
        supabase.from("case_steps").select("*").eq("case_id", c.id).order("step_number"),
        supabase.from("documents").select("*").eq("case_id", c.id).order("created_at", { ascending: false }),
        supabase.from("messages").select("*").eq("case_id", c.id).order("created_at"),
      ]);

      setSteps(stepsRes.data ?? []);
      setDocuments(docsRes.data ?? []);
      setMessages(msgsRes.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCase) return;

    const { error } = await supabase
      .from("cases")
      .update({ first_name: firstName, last_name: lastName, llc_name: llcName, sole_owner: soleOwner })
      .eq("id", userCase.id);

    if (error) return;

    if (!soleOwner && partners.length > 0) {
      const total = partners.reduce((s, p) => s + p.ownership_percentage, 0);
      if (total !== 100) {
        alert("Partner ownership must total exactly 100%");
        return;
      }
      await supabase.from("partners").insert(partners.map((p) => ({ ...p, case_id: userCase.id })));
    }

    setShowIntake(false);
    loadDashboard();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!userCase) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-2xl font-bold mb-3">No Active Case</h1>
            <p className="text-muted-foreground mb-6">
              You don't have an active LLC formation case yet. Get started by choosing a package.
            </p>
            <a href="/#pricing">
              <Button variant="gold" size="lg">View Packages</Button>
            </a>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {userCase.llc_name && (
                <span className="font-semibold text-foreground">{userCase.llc_name}</span>
              )}
              {userCase.llc_name && " · "}
              Package: <span className="font-semibold capitalize text-gold">{userCase.package}</span>
            </p>
          </div>

          {/* Intake Form */}
          {showIntake && (
            <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-1">Complete Your Details</h2>
              <p className="text-sm text-muted-foreground mb-4">We need a few details to start your LLC formation.</p>
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
                  <Label>Ownership Structure</Label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={soleOwner} onChange={() => setSoleOwner(true)} />
                      <span className="text-sm">Sole Owner</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
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
          <div className="mb-8">
            <ProgressTracker steps={steps} packageType={userCase.package} />
          </div>

          {/* Documents & Upload */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Documents</h2>
            <FileUploadZone caseId={userCase.id} onUploadComplete={loadDashboard} />
            <div className="mt-6">
              <DocumentsList documents={documents} />
            </div>
          </div>

          {/* Messages */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <MessagesPanel messages={messages} caseId={userCase.id} onMessageSent={loadDashboard} />
          </div>
        </div>
      </div>
    </>
  );
}
