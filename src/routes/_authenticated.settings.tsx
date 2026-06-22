import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getDemoMode, getDemoClientData, updateDemoCase } from "@/lib/demoAccess";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Account Settings — USADOC" }],
  }),
});

type Case = Database["public"]["Tables"]["cases"]["Row"];

const PACKAGE_LABELS: Record<string, string> = {
  basic: "Essential",
  popular: "Business",
  premium: "Premium",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userCase, setUserCase] = useState<Case | null>(null);
  const [cancellingRenewal, setCancellingRenewal] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      if (getDemoMode() === "client") {
        const demo = getDemoClientData();
        setUserCase(demo.case);
        setEmail("demo-client@example.com");
        setFullName("Demo Client");
        setPhone("");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? "");

      const [{ data: profile }, { data: cases }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle(),
        supabase
          .from("cases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      if (profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
      }
      if (cases && cases.length > 0) {
        setUserCase(cases[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleCancelRenewal = async () => {
    if (!userCase) return;
    if (!confirm("Are you sure you want to cancel auto-renewal? Your registered agent service will remain active until the renewal date.")) {
      return;
    }
    setCancellingRenewal(true);

    if (getDemoMode() === "client") {
      const updated = updateDemoCase({ renewal_cancelled_at: new Date().toISOString() });
      setUserCase(updated.case);
      toast.success("Auto-renewal cancelled");
      setCancellingRenewal(false);
      return;
    }

    const { error } = await supabase.rpc("cancel_renewal");
    if (error) {
      toast.error(error.message || "Failed to cancel auto-renewal");
    } else {
      toast.success("Auto-renewal cancelled");
      setUserCase({ ...userCase, renewal_cancelled_at: new Date().toISOString() } as Case);
    }
    setCancellingRenewal(false);
  };

  const isRenewalCancelled = !!userCase?.renewal_cancelled_at;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {/* Profile */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={email} disabled className="mt-1 bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" maxLength={255} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" maxLength={20} placeholder="+1 (555) 123-4567" />
              </div>
              <Button type="submit" variant="gold" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Plan & Renewals */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Your Plan & Renewals</h2>
            {userCase ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-semibold capitalize text-foreground">
                      {PACKAGE_LABELS[userCase.package] ?? userCase.package}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize text-foreground">
                      {userCase.payment_status === "completed" ? "Active" : userCase.payment_status}
                    </p>
                  </div>
                  {userCase.paid_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Paid on</p>
                      <p className="font-semibold text-foreground">{formatDate(userCase.paid_at)}</p>
                    </div>
                  )}
                  {userCase.expires_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Renews on</p>
                      <p className="font-semibold text-foreground">{formatDate(userCase.expires_at)}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  {isRenewalCancelled ? (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="font-semibold text-foreground">Auto-renewal cancelled</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your registered agent service will not renew automatically. It remains active until{" "}
                        {formatDate(userCase.expires_at)}.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your registered agent service renews automatically on {formatDate(userCase.expires_at)}.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleCancelRenewal}
                        disabled={cancellingRenewal || !userCase.expires_at}
                      >
                        {cancellingRenewal ? "Cancelling..." : "Cancel auto-renewal"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No active plan found.</p>
            )}
          </div>

          {/* Password */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" required minLength={6} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" required minLength={6} />
              </div>
              <Button type="submit" variant="gold" disabled={changingPassword}>
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
