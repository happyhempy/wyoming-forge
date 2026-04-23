import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminCaseCard } from "@/components/admin/AdminCaseCard";
import { Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type DocRow = Database["public"]["Tables"]["documents"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type EnrichedCase = Case & {
  steps?: CaseStep[];
  messages?: Message[];
  documents?: DocRow[];
  profile?: Profile | null;
};

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [{ title: "Admin Panel — USDOC" }],
  }),
});

function AdminPanel() {
  const [cases, setCases] = useState<EnrichedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isSuperAdmin = roles?.some((r) => r.role === "superadmin");

    let query = supabase.from("cases").select("*").order("created_at", { ascending: false });
    if (!isSuperAdmin) {
      query = query.eq("assigned_admin", user.id);
    }

    const { data: casesData } = await query;
    if (!casesData) {
      setLoading(false);
      return;
    }

    const caseIds = casesData.map((c) => c.id);
    const userIds = [...new Set(casesData.map((c) => c.user_id))];

    // Fetch all related data in parallel
    const [stepsRes, msgsRes, docsRes, profilesRes] = await Promise.all([
      supabase.from("case_steps").select("*").in("case_id", caseIds).order("step_number"),
      supabase.from("messages").select("*").in("case_id", caseIds).order("created_at"),
      supabase.from("documents").select("*").in("case_id", caseIds).order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").in("user_id", userIds),
    ]);

    const steps = stepsRes.data ?? [];
    const msgs = msgsRes.data ?? [];
    const docs = docsRes.data ?? [];
    const profiles = profilesRes.data ?? [];

    const enriched: EnrichedCase[] = casesData.map((c) => ({
      ...c,
      steps: steps.filter((s) => s.case_id === c.id),
      messages: msgs.filter((m) => m.case_id === c.id),
      documents: docs.filter((d) => d.case_id === c.id),
      profile: profiles.find((p) => p.user_id === c.user_id) ?? null,
    }));

    setCases(enriched);
    setLoading(false);
  };

  const activeCases = cases.filter((c) => c.current_step < 5);
  const completedCases = cases.filter((c) => c.current_step >= 5);
  const revenue = cases.filter((c) => c.payment_status === "completed").reduce((sum, c) => {
    const prices: Record<string, number> = { basic: 299, popular: 399, premium: 650 };
    return sum + (prices[c.package] ?? 399);
  }, 0);

  const filtered = cases.filter((c) => {
    if (filter === "active" && c.current_step >= 5) return false;
    if (filter === "completed" && c.current_step < 5) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.llc_name?.toLowerCase().includes(q) ||
        c.first_name?.toLowerCase().includes(q) ||
        c.last_name?.toLowerCase().includes(q) ||
        c.package?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading cases...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage client cases, documents, and communications.</p>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <AdminStats
              totalCases={cases.length}
              activeCases={activeCases.length}
              completedCases={completedCases.length}
              revenue={revenue}
            />
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, LLC, or package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                    filter === f
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f} {f === "all" ? `(${cases.length})` : f === "active" ? `(${activeCases.length})` : `(${completedCases.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">
                {search ? "No cases match your search." : "No cases found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => (
                <AdminCaseCard key={c.id} caseData={c} onRefresh={loadCases} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
