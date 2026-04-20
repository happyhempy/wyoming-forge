import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, Upload, CheckCircle2, Shield, Bell } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-Time Progress Tracking",
    desc: "See exactly where your LLC stands - every step, from filing to EIN approval.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    desc: "Chat with our team directly from your dashboard. No emails lost, no waiting on hold.",
  },
  {
    icon: Upload,
    title: "Easy Document Upload",
    desc: "Upload your passport securely and receive all your LLC documents in one place.",
  },
  {
    icon: Bell,
    title: "Action Alerts",
    desc: "We'll tell you exactly what's needed from you - no confusion, no missed steps.",
  },
  {
    icon: CheckCircle2,
    title: "Step-by-Step Guidance",
    desc: "Each milestone is clearly marked. You always know what's done and what's next.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your documents and data are encrypted and stored securely. Only you and our team can access them.",
  },
];

export function DashboardPreviewSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-navy text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <LayoutDashboard className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Your Personal Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sign up and get <span className="text-gold">full visibility</span> into your LLC process
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            Once you sign up, you get access to a personal dashboard where you can track every step, upload documents, and communicate with our team - all in one place.
          </p>
        </div>

        {/* Mock dashboard card */}
        <div className={`mt-12 bg-navy-light/50 border border-primary-foreground/10 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto ${isVisible ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-sm text-primary-foreground/50">Your Dashboard</span>
          </div>

          {/* Mini progress tracker */}
          <div className="space-y-3">
            {[
              { step: "Payment Received", done: true },
              { step: "Documents Submitted", done: true },
              { step: "Articles of Organization Filed", done: true },
              { step: "EIN Application Submitted", active: true },
              { step: "EIN Received", pending: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.done ? "bg-green-500 text-primary-foreground" :
                  s.active ? "bg-gold text-navy-dark animate-pulse" :
                  "bg-primary-foreground/20 text-primary-foreground/50"
                }`}>
                  {s.done ? "✓" : i + 1}
                </div>
                <span className={`text-sm ${
                  s.done ? "text-primary-foreground/70 line-through" :
                  s.active ? "text-gold font-semibold" :
                  "text-primary-foreground/40"
                }`}>
                  {s.step}
                </span>
                {s.active && (
                  <span className="ml-auto text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">In Progress</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-primary-foreground/10 flex items-center gap-2 text-sm text-primary-foreground/50">
            <MessageSquare className="w-4 h-4" />
            <span>2 new messages from your account manager</span>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 ${isVisible ? `animate-fade-up delay-${(i + 2) * 100}` : "opacity-0"}`}
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-primary-foreground/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 ${isVisible ? "animate-fade-up delay-500" : "opacity-0"}`}>
          <Link to="/login">
            <Button variant="gold" size="xl">
              Create Your Account & Start →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
