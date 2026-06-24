import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { resetDemoClientFlow, setDemoMode, type DemoMode } from "@/lib/demoAccess";

const STORAGE_KEY = "usadoc_gate_v2";


export function SiteGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/demo-user") {
      resetDemoClientFlow();
      setDemoMode("client");
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.location.replace("/dashboard");
      return;
    }
    if (window.location.pathname === "/demo-admin") {
      resetDemoClientFlow();
      setDemoMode("admin");
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.location.replace("/admin");
      return;
    }

    try { localStorage.removeItem("usadoc_site_unlocked"); } catch {}
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    setChecked(true);
  }, []);

  const enterAs = (kind: DemoMode) => {
    setLoading(true);
    resetDemoClientFlow();
    setDemoMode(kind);
    sessionStorage.setItem(STORAGE_KEY, "1");
    window.location.href = kind === "admin" ? "/admin" : "/dashboard";
  };

  // Suppress unused-var lint for legacy gate constants (kept for future use)
  void GATE_EMAIL; void GATE_PASSWORD; void getDemoLoginMode;

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-xl border border-navy-light/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy-dark font-bold text-sm">US</span>
            </div>
            <span className="text-card-foreground font-bold text-xl">USADOC</span>
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-2">Choose how you'd like to enter</p>
        </div>

        <div className="space-y-3">
          <Button type="button" variant="gold" className="w-full h-12 text-base" disabled={loading} onClick={() => enterAs("client")}>
            🚀 Enter as User
          </Button>
          <Button type="button" variant="navyOutline" className="w-full h-12 text-base" disabled={loading} onClick={() => enterAs("admin")}>
            🛡️ Enter as Admin
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Free access · No payment required
        </p>
      </div>
    </div>
  );
}
