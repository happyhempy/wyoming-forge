import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us — US LLC Formation" },
      { name: "description", content: "Get in touch with our LLC formation team. We respond within 24 hours via email or instantly on WhatsApp." },
      { property: "og:title", content: "Contact Us — US LLC Formation" },
      { property: "og:description", content: "Questions about forming your US LLC? We're here to help." },
    ],
  }),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Store as a lead
    const { error } = await supabase.from("leads").insert({
      full_name: name.trim(),
      email: email.trim(),
      business_type: "Contact Form Inquiry",
      phone: null,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setName("");
      setEmail("");
      setMessage("");
    }
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-24 pb-16 bg-navy text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-primary-foreground/70">
              Have questions? We're here to help. Reach out and we'll respond within 24 hours.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" maxLength={255} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" maxLength={255} />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 min-h-[120px]" maxLength={2000} />
                </div>
                <Button type="submit" variant="gold" disabled={sending} className="w-full">
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">📧 Email</h3>
                <p className="text-muted-foreground">support@llcformation.com</p>
                <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">💬 WhatsApp</h3>
                <p className="text-muted-foreground">Chat with us instantly</p>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-whatsapp text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Open WhatsApp Chat
                </a>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3">⏰ Business Hours</h3>
                <p className="text-muted-foreground">Monday – Friday: 9:00 AM – 6:00 PM EST</p>
                <p className="text-sm text-muted-foreground mt-1">WhatsApp messages are answered 7 days a week</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
