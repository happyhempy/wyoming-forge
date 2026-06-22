import { PDFDocument } from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";
import ss4TemplateAsset from "@/assets/forms/ss4-blank.pdf.asset.json";

const SS4_TEMPLATE_URL = ss4TemplateAsset.url;

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function renderPdfTab(win: Window, url: string, filename: string) {
  const safeFilename = escapeHtml(filename);
  const safeUrl = escapeAttribute(url);
  win.document.open();
  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeFilename}</title>
    <style>
      html, body { margin: 0; height: 100%; background: #111827; font-family: Arial, sans-serif; }
      .bar { height: 52px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 16px; color: #fff; background: #111827; box-sizing: border-box; }
      .bar span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bar a { color: #111827; background: #d4af37; text-decoration: none; font-weight: 700; border-radius: 6px; padding: 9px 14px; white-space: nowrap; }
      iframe { width: 100%; height: calc(100% - 52px); border: 0; background: #fff; }
    </style>
  </head>
  <body>
    <div class="bar"><span>${safeFilename}</span><a href="${safeUrl}" download="${safeFilename}">Download</a></div>
    <iframe src="${safeUrl}" title="${safeFilename}"></iframe>
  </body>
</html>`);
  win.document.close();
}

function renderPdfTabFromBlob(win: Window, blob: Blob, filename: string) {
  const reader = new FileReader();
  reader.onload = () => renderPdfTab(win, String(reader.result), filename);
  reader.onerror = () => {
    const url = URL.createObjectURL(blob);
    renderPdfTab(win, url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 600_000);
  };
  reader.readAsDataURL(blob);
}

export function preparePdfDownloadTab(filename: string): Window | null {
  const inIframe = typeof window !== "undefined" && window.top !== window.self;
  if (!inIframe) return null;

  const win = window.open("", "_blank");
  if (!win) return null;

  const safeFilename = escapeHtml(filename);
  win.document.write(`<!doctype html><html><head><title>${safeFilename}</title></head><body style="margin:0;background:#111827;color:white;font-family:Arial,sans-serif;display:grid;place-items:center;height:100vh"><div>Preparing PDF...</div></body></html>`);
  win.document.close();
  return win;
}

export function downloadBlob(blob: Blob, filename: string, preparedTab?: Window | null) {
  if (preparedTab && !preparedTab.closed) {
    renderPdfTabFromBlob(preparedTab, blob, filename);
    return;
  }

  const inIframe = typeof window !== "undefined" && window.top !== window.self;
  if (inIframe) {
    const win = window.open("", "_blank");
    if (win) {
      renderPdfTabFromBlob(win, blob, filename);
      return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

