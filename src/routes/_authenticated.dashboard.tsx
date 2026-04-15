import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { DocumentsList } from "@/components/dashboard/DocumentsList";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import { LLCDetailsCard } from "@/components/dashboard/LLCDetailsCard";
import { ActionAlerts } from "@/components/dashboard/ActionAlerts";
import { UpsellSection } from "@/components/dashboard/UpsellSection";
import { IntakeForm } from "@/components/dashboard/IntakeForm";
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

          {/* Action Alerts */}
          <div className="mb-6">
            <ActionAlerts userCase={userCase} steps={steps} documents={documents} />
          </div>

          {/* LLC Details Card */}
          <div className="mb-8">
            <LLCDetailsCard userCase={userCase} />
          </div>

          {/* Intake Form */}
          {showIntake && (
            <IntakeForm userCase={userCase} onComplete={() => { setShowIntake(false); loadDashboard(); }} />
          )}

          {/* Progress Tracker */}
          <div className="mb-8">
            <ProgressTracker steps={steps} packageType={userCase.package} />
          </div>

          {/* Passport Upload & Documents */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Passport & Documents</h2>
            <FileUploadZone caseId={userCase.id} onUploadComplete={loadDashboard} />
            <div className="mt-6">
              <DocumentsList documents={documents} />
            </div>
          </div>

          {/* Messages */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <MessagesPanel messages={messages} caseId={userCase.id} onMessageSent={loadDashboard} />
          </div>

          {/* Upsell Services */}
          <div className="mb-8">
            <UpsellSection />
          </div>
        </div>
      </div>
    </>
  );
}
