import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];

interface IntakeFormProps {
  userCase: Case;
  onComplete: () => void;
}

export function IntakeForm({ userCase, onComplete }: IntakeFormProps) {
  const [firstName, setFirstName] = useState(userCase.first_name ?? "");
  const [lastName, setLastName] = useState(userCase.last_name ?? "");
  const [llcName, setLlcName] = useState(userCase.llc_name ?? "");
  const [tradeName, setTradeName] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [productsServices, setProductsServices] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const [soleOwner, setSoleOwner] = useState(true);
  const [numMembers, setNumMembers] = useState(1);
  const [partners, setPartners] = useState<{ full_name: string; email: string; ownership_percentage: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [einAuthorized, setEinAuthorized] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  const includesEIN = userCase.package === "popular" || userCase.package === "premium";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("cases")
        .update({
          first_name: firstName,
          last_name: lastName,
          llc_name: llcName,
          trade_name: tradeName || null,
          business_purpose: businessPurpose,
          products_services: productsServices,
          business_start_date: businessStartDate || null,
          sole_owner: soleOwner,
        })
        .eq("id", userCase.id);

      if (error) throw error;

      if (!soleOwner && partners.length > 0) {
        const total = partners.reduce((s, p) => s + p.ownership_percentage, 0);
        if (total !== 100) {
          alert("Partner ownership must total exactly 100%");
          setSubmitting(false);
          return;
        }
        await supabase.from("partners").insert(
          partners.map((p) => ({ ...p, case_id: userCase.id }))
        );
      }

      onComplete();
    } catch (err: any) {
      alert(err.message || "Failed to save details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-gold/30 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-1">Complete Your Details</h2>
      <p className="text-sm text-muted-foreground mb-6">
        We need the following information to file your LLC formation and EIN application.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Responsible Party */}
        <div>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">
            Responsible Party (as on passport)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="mt-1" placeholder="e.g. John" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="mt-1" placeholder="e.g. Smith" />
            </div>
          </div>
        </div>

        {/* Section 2: LLC Details */}
        <div>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">
            LLC Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Desired LLC Name</Label>
              <Input value={llcName} onChange={(e) => setLlcName(e.target.value)} required className="mt-1" placeholder="e.g. My Business LLC" />
              <p className="text-xs text-muted-foreground mt-1">This will be the legal name of your company</p>
            </div>
            <div>
              <Label>Trade Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input value={tradeName} onChange={(e) => setTradeName(e.target.value)} className="mt-1" placeholder="e.g. MyBrand — only if different from LLC name" />
            </div>
          </div>
        </div>

        {/* Section 3: Ownership */}
        <div>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">
            Ownership Structure
          </h3>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={soleOwner} onChange={() => { setSoleOwner(true); setNumMembers(1); }} />
              <span className="text-sm">Sole Owner</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={!soleOwner} onChange={() => setSoleOwner(false)} />
              <span className="text-sm">Multiple Members</span>
            </label>
          </div>

          {!soleOwner && (
            <div className="space-y-3 border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Label>Number of Members</Label>
                <Input
                  type="number"
                  min={2}
                  value={numMembers}
                  onChange={(e) => setNumMembers(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label>Partners</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setPartners([...partners, { full_name: "", email: "", ownership_percentage: 0 }])}>
                  + Add Partner
                </Button>
              </div>
              {partners.map((p, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Full Name" value={p.full_name} onChange={(e) => { const np = [...partners]; np[i].full_name = e.target.value; setPartners(np); }} />
                  <Input placeholder="Email" value={p.email} onChange={(e) => { const np = [...partners]; np[i].email = e.target.value; setPartners(np); }} />
                  <Input type="number" placeholder="Ownership %" value={p.ownership_percentage || ""} onChange={(e) => { const np = [...partners]; np[i].ownership_percentage = Number(e.target.value); setPartners(np); }} />
                </div>
              ))}
              {partners.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Total: {partners.reduce((s, p) => s + p.ownership_percentage, 0)}% — must equal 100%
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Business Info */}
        <div>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">
            Business Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Business Purpose / Type of Activity</Label>
              <Textarea
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                required
                className="mt-1"
                placeholder="e.g. E-commerce, Consulting, Software Development, Dropshipping..."
                rows={2}
              />
            </div>
            <div>
              <Label>Products or Services</Label>
              <Textarea
                value={productsServices}
                onChange={(e) => setProductsServices(e.target.value)}
                required
                className="mt-1"
                placeholder="e.g. Online retail of electronics, Marketing consulting services..."
                rows={2}
              />
            </div>
            <div>
              <Label>Expected Business Start Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                type="date"
                value={businessStartDate}
                onChange={(e) => setBusinessStartDate(e.target.value)}
                className="mt-1 w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* Section 5: EIN Authorization (only for packages with EIN) */}
        {includesEIN && (
          <div className="border border-gold/30 rounded-lg p-5 bg-gold/5">
            <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">
              EIN Authorization (IRS Form SS-4)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              To apply for your EIN (Employer Identification Number) with the IRS, we need your authorization to submit Form SS-4 on your behalf as a Third Party Designee.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="ein-auth"
                  checked={einAuthorized}
                  onCheckedChange={(checked) => setEinAuthorized(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="ein-auth" className="text-sm leading-relaxed cursor-pointer">
                  I hereby authorize <strong>Amer LLC</strong> to act as my Third Party Designee and submit IRS Form SS-4 on my behalf to obtain an Employer Identification Number (EIN) for my LLC. I understand this authorization is limited solely to the EIN application process.
                </label>
              </div>

              <div>
                <Label>Digital Signature (type your full legal name)</Label>
                <Input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="mt-1 italic font-serif text-lg"
                  required={includesEIN}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  By typing your name above, you confirm this serves as your electronic signature - Date: {new Date().toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={submitting || (includesEIN && (!einAuthorized || !signatureName.trim()))}
          className="w-full sm:w-auto"
        >
          {submitting ? "Saving..." : "Submit Details"}
        </Button>
      </form>
    </div>
  );
}
