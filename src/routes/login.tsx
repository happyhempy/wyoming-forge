import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — US LLC Formation" },
      { name: "description", content: "Log in to your US LLC Formation dashboard." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const [signupName, setSignupName] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: signupName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setMode("login");
      setError("Check your email to confirm your account.");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy-dark font-bold text-sm">US</span>
            </div>
            <span className="text-primary-foreground font-bold text-xl">LLC Formation</span>
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl border border-navy-light/20">
          {mode === "login" && (
            <>
              <h1 className="text-2xl font-bold text-card-foreground mb-6">Welcome Back</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 text-center space-y-2">
                <button onClick={() => setMode("forgot")} className="text-sm text-gold hover:underline">
                  Forgot password?
                </button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-gold hover:underline">
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              <h1 className="text-2xl font-bold text-card-foreground mb-6">Create Account</h1>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-gold hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h1 className="text-2xl font-bold text-card-foreground mb-6">Reset Password</h1>
              {resetSent ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Check your email for a password reset link.</p>
                  <button onClick={() => { setMode("login"); setResetSent(false); }} className="text-gold hover:underline text-sm">
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <button onClick={() => setMode("login")} className="text-sm text-gold hover:underline w-full text-center">
                    Back to login
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
