import { PDFDocument } from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";

const SS4_TEMPLATE_URL = "/ss4-blank.pdf";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * SS-4 field map (AcroForm names from the IRS PDF).
 * Only fields we can auto-fill from client intake data are listed here.
 * Empty fields will be left blank for the admin to complete manually.
 */
function buildFieldValues(c: Case, profile?: Profile | null) {
  const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  const merchandise = (c.products_services || c.business_purpose || "").trim();
  const startDate = c.business_start_date
    ? new Date(c.business_start_date).toLocaleDateString("en-US")
    : "";

  return {
    // Line 1 — Legal name of entity (LLC name)
    "topmostSubform[0].Page1[0].f1_2[0]": c.llc_name ?? "",
    // Line 2 — Trade name (DBA)
    "topmostSubform[0].Page1[0].f1_3[0]": c.trade_name ?? "",
    // Line 6 — County and state where principal business is located
    "topmostSubform[0].Page1[0].f1_9[0]": "LARAMIE, WY",
    // Line 7a — Name of responsible party
    "topmostSubform[0].Page1[0].f1_10[0]": fullName,
    // Line 7b — SSN/ITIN/EIN of responsible party (non-resident default)
    "topmostSubform[0].Page1[0].f1_11[0]": "FOREIGN",
    // Line 8b — If LLC, number of members
    "topmostSubform[0].Page1[0].f1_12[0]": c.sole_owner ? "1" : "",
    // Line 9a — "Other" type-of-entity description
    "topmostSubform[0].Page1[0].f1_19[0]": c.sole_owner
      ? "Disregarded entity-sole proprietorship"
      : "",
    // Line 10 — "Started new business" specify
    "topmostSubform[0].Page1[0].f1_25[0]": merchandise.toUpperCase(),
    // Line 11 — Date business started
    "topmostSubform[0].Page1[0].f1_31[0]": startDate,
    // Line 12 — Closing month of accounting year
    "topmostSubform[0].Page1[0].f1_32[0]": "12",
    // Line 13 — Highest number of employees (agricultural / household / other)
    "topmostSubform[0].Page1[0].f1_33[0]": "0",
    "topmostSubform[0].Page1[0].f1_34[0]": "0",
    "topmostSubform[0].Page1[0].f1_35[0]": "0",
    // Line 16 — Principal activity
    "topmostSubform[0].Page1[0].f1_37[0]": merchandise.toUpperCase(),
    // Line 17 — Principal line of merchandise
    "topmostSubform[0].Page1[0].f1_38[0]": merchandise.toUpperCase(),
    // Applicant signature block — name & title
    "topmostSubform[0].Page1[0].f1_44[0]": fullName ? `${fullName}, Member` : "",
    // Applicant phone (from profile if available)
    "topmostSubform[0].Page1[0].f1_45[0]": profile?.phone ?? "",
  } as Record<string, string>;
}

/**
 * Checkboxes to tick by default (LLC, sole-member treatment, e-commerce/other).
 * The /On export value is determined by inspecting the IRS PDF widget appearance.
 */
const CHECKBOXES_TO_CHECK = [
  // Box 8a — "Is this application for a limited liability company (LLC)?" Yes
  "topmostSubform[0].Page1[0].c1_1[0]",
  // Box 8c — "If 8a is Yes, was the LLC organized in the United States?" Yes
  "topmostSubform[0].Page1[0].c1_2[0]",
  // Line 9a — "Other (specify)" type of entity
  "topmostSubform[0].Page1[0].c1_3[15]",
  // Line 10 — "Started new business (specify type)"
  "topmostSubform[0].Page1[0].c1_4[1]",
  // Line 16 — "Other (specify)" principal activity
  "topmostSubform[0].Page1[0].c1_6[11]",
  // Line 18 — "Has the applicant entity shown on line 1 ever applied for and received an EIN?" No
  "topmostSubform[0].Page1[0].c1_7[1]",
];

export async function generateSS4Pdf(c: Case, profile?: Profile | null): Promise<Blob> {
  const res = await fetch(SS4_TEMPLATE_URL);
  if (!res.ok) throw new Error("Failed to load SS-4 template");
  const templateBytes = await res.arrayBuffer();

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const values = buildFieldValues(c, profile);
  for (const [name, value] of Object.entries(values)) {
    if (!value) continue;
    try {
      const field = form.getTextField(name);
      field.setText(value);
    } catch {
      // field name missing in this template version — skip silently
    }
  }

  for (const name of CHECKBOXES_TO_CHECK) {
    try {
      const cb = form.getCheckBox(name);
      cb.check();
    } catch {
      // skip if not a simple checkbox in this template
    }
  }

  // Don't flatten — admin/IRS may still need to edit
  const bytes = await pdfDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
