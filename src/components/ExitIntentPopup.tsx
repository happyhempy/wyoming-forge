import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "exit_intent_shown_v1";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    // Desktop: mouse leaves through top
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    // Mobile: trigger after 30s OR aggressive scroll-up
    const mobileTimer = window.setTimeout(trigger, 30000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        full_name: name,
        email,
        business_type: "Exit Intent - Free LLC Cost Calculator",
      });
      if (error) throw error;
      toast.success("Check your email for the Free LLC Cost Calculator!");
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 mb-4">
            <span className="text-3xl">🎁</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Wait! Get Our Free LLC Cost Calculator
          </h3>
          <p className="text-sm text-muted-foreground">
            Discover the <strong className="text-foreground">exact cost</strong> to open and maintain your US LLC — no hidden fees.
            Free PDF guide sent to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="email"
            placeholder="Your best email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Me The Free Calculator →"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-center text-muted-foreground">
          🔒 No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
