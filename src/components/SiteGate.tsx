import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setDemoMode, type DemoMode } from "@/lib/demoAccess";

const STORAGE_KEY = "usadoc_gate_v2";
const GATE_EMAIL = "itamarmanor1@gmail.com";
const GATE_PASSWORD = "123456";

export function SiteGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // clear any legacy persisted unlock so the gate always shows on fresh load
    try { localStorage.removeItem("usadoc_site_unlocked"); } catch {}
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    setChecked(true);
  }, []);

  const unlock = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setUnlocked(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() === GATE_EMAIL && password === GATE_PASSWORD) {
      unlock();
    } else {
      setError("Invalid credentials");
    }
  };

  const demoLogin = (kind: DemoMode) => {
    setError("");
    setLoading(true);
    setDemoMode(kind);
    unlock();
    window.location.href = kind === "admin" ? "/admin" : "/dashboard";
  };

  if (!checked) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-xl border border-navy-light/20">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy-dark font-bold text-sm">US</span>
            </div>
            <span className="text-card-foreground font-bold text-xl">USADOC</span>
          </div>
          <h1 className="text-xl font-bold text-card-foreground">Site Locked</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gate-email">Email</Label>
            <Input id="gate-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="gate-password">Password</Label>
            <Input id="gate-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="gold" className="w-full">Unlock Site</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">demo access</span></div>
        </div>

        <div className="space-y-2">
          <Button type="button" variant="gold" className="w-full" disabled={loading} onClick={() => demoLogin("client")}>
            🚀 Enter as User
          </Button>
          <Button type="button" variant="navyOutline" className="w-full" disabled={loading} onClick={() => demoLogin("admin")}>
            🛡️ Enter as Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
