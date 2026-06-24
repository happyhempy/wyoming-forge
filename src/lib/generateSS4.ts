import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";
import ss4TemplateAsset from "@/assets/forms/ss4-blank.pdf.asset.json";

const SS4_TEMPLATE_URL = ss4TemplateAsset.url;

type Case = Database["public"]["Tables"]["cases"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Coordinate-based overlay for IRS Form SS-4.
 * pdf-lib does NOT support XFA (the format the IRS template uses), so we
 * cannot fill AcroForm fields reliably. Instead we draw text directly on
 * top of the template page. Output is a flat, standard PDF that opens in
 * any reader and downloads correctly.
 *
 * Coordinates are in PDF points from the BOTTOM-LEFT of the page.
 * Page size: US Letter = 612 x 792 pts. Tune values below if alignment drifts.
 */
type Draw = { x: number; y: number; text: string; size?: number };

function buildDraws(c: Case, profile?: Profile | null): Draw[] {
  const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim().toUpperCase();
  const merchandise = (c.products_services || c.business_purpose || "").trim().toUpperCase();
  const startDate = c.business_start_date
    ? new Date(c.business_start_date).toLocaleDateString("en-US")
    : "";

  // Default font size for filled values
  const S = 10;

  return [
    // Line 1 — Legal name of entity
    { x: 60,  y: 690, text: (c.llc_name ?? "").toUpperCase(), size: S },
    // Line 2 — Trade name (DBA)
    { x: 60,  y: 666, text: (c.trade_name ?? "").toUpperCase(), size: S },
    // Line 4a/4b — Mailing address (left blank — admin completes)
    // Line 6 — County and state
    { x: 60,  y: 596, text: "LARAMIE, WY", size: S },
    // Line 7a — Responsible party name
    { x: 60,  y: 572, text: fullName, size: S },
    // Line 7b — SSN/ITIN/EIN
    { x: 360, y: 572, text: "FOREIGN", size: S },
    // Line 8a — LLC? mark "Yes"
    { x: 343, y: 548, text: "X", size: 11 },
    // Line 8b — # of LLC members
    { x: 470, y: 548, text: c.sole_owner ? "1" : "", size: S },
    // Line 8c — Organized in US? "Yes"
    { x: 343, y: 530, text: "X", size: 11 },
    // Line 9a — "Other" checkbox + description
    { x: 60,  y: 460, text: "X", size: 11 }, // Other checkbox
    { x: 195, y: 460, text: c.sole_owner ? "DISREGARDED ENTITY - SOLE PROPRIETORSHIP" : "", size: S },
    // Line 10 — "Started new business" checkbox + specify
    { x: 60,  y: 388, text: "X", size: 11 },
    { x: 250, y: 388, text: merchandise, size: S },
    // Line 11 — Date business started
    { x: 360, y: 340, text: startDate, size: S },
    // Line 12 — Closing month of accounting year
    { x: 480, y: 340, text: "12", size: S },
    // Line 13 — Number of employees (agricultural / household / other)
    { x: 180, y: 316, text: "0", size: S },
    { x: 300, y: 316, text: "0", size: S },
    { x: 430, y: 316, text: "0", size: S },
    // Line 16 — Principal activity "Other (specify)"
    { x: 430, y: 232, text: "X", size: 11 },
    { x: 480, y: 232, text: merchandise, size: S },
    // Line 17 — Principal merchandise
    { x: 60,  y: 200, text: merchandise, size: S },
    // Line 18 — Ever applied for EIN? "No"
    { x: 360, y: 168, text: "X", size: 11 },
    // Signature block — name & title
    { x: 60,  y: 110, text: fullName ? `${fullName}, MEMBER` : "", size: S },
    // Phone
    { x: 430, y: 110, text: profile?.phone ?? "", size: S },
  ].filter(d => d.text && d.text.length > 0);
}

export async function generateSS4Pdf(c: Case, profile?: Profile | null): Promise<Blob> {
  const res = await fetch(SS4_TEMPLATE_URL);
  if (!res.ok) throw new Error("Failed to load SS-4 template");
  const templateBytes = await res.arrayBuffer();

  // ignoreEncryption + updateMetadata false keeps the original template intact
  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });

  // Strip the XFA form so the resulting PDF is a clean static PDF
  try {
    const form = pdfDoc.getForm();
    form.flatten();
  } catch {
    // No AcroForm to flatten — fine
  }

  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.getPages()[0];
  const black = rgb(0, 0, 0);

  for (const d of buildDraws(c, profile)) {
    const isMark = d.text === "X";
    page.drawText(d.text, {
      x: d.x,
      y: d.y,
      size: d.size ?? 10,
      font: isMark ? helvBold : helv,
      color: black,
    });
  }

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

