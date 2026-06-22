import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Generates a Wyoming Articles of Organization PDF — mirrors 1:1 the official
 * Wyoming Secretary of State form (LLC-ArticlesOrganization, Rev. June 2021).
 *
 * Page 1: Articles of Organization (items 1–6 + signature/contact block)
 * Page 2: Consent to Appointment by Registered Agent (RAConsent, Rev. Dec 2021)
 */
export async function generateArticlesPdf(
  c: Case,
  profile?: Profile | null,
  clientEmail?: string | null,
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const gray = rgb(0.35, 0.35, 0.35);
  const PAGE_W = 612;
  const PAGE_H = 792;
  const margin = 54;

  // USADOC registered agent constants (Wyoming)
  const RA_NAME = "USADOC Registered Agent Services LLC";
  const RA_ADDRESS = "30 N Gould St, Ste R";
  const RA_CITY_STATE_ZIP = "Sheridan, WY 82801";

  const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  const phone = profile?.phone ?? "";
  const email = clientEmail ?? "";
  const clientAddr = [
    c.client_address_line,
    [c.client_city, c.client_state_region, c.client_postal_code].filter(Boolean).join(", "),
    c.client_country,
  ]
    .filter(Boolean)
    .join(" — ");

  // ───── helpers ─────────────────────────────────────────────────────────────
  const draw = (
    page: any,
    text: string,
    x: number,
    y: number,
    opts: { size?: number; bold?: boolean; color?: any } = {},
  ) => {
    page.drawText(text || "", {
      x,
      y,
      size: opts.size ?? 11,
      font: opts.bold ? bold : font,
      color: opts.color ?? black,
    });
  };

  const drawLine = (page: any, x1: number, x2: number, y: number) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness: 0.5,
      color: gray,
    });
  };

  const drawHeader = (page: any) => {
    let y = PAGE_H - 50;
    draw(page, "Wyoming Secretary of State", PAGE_W / 2 - 90, y, { bold: true, size: 11 });
    y -= 12;
    draw(page, "Herschler Building East, Suite 101", PAGE_W / 2 - 85, y, { size: 9, color: gray });
    y -= 11;
    draw(page, "122 W 25th Street", PAGE_W / 2 - 45, y, { size: 9, color: gray });
    y -= 11;
    draw(page, "Cheyenne, WY 82002-0020", PAGE_W / 2 - 65, y, { size: 9, color: gray });
    y -= 11;
    draw(page, "Ph. 307.777.7311", PAGE_W / 2 - 40, y, { size: 9, color: gray });
    y -= 11;
    draw(page, "Email: Business@wyo.gov", PAGE_W / 2 - 60, y, { size: 9, color: gray });
    return y - 24;
  };

  // ═════ PAGE 1 — ARTICLES OF ORGANIZATION ═══════════════════════════════════
  const p1 = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = drawHeader(p1);

  draw(p1, "Limited Liability Company", PAGE_W / 2 - 95, y, { bold: true, size: 14 });
  y -= 16;
  draw(p1, "Articles of Organization", PAGE_W / 2 - 85, y, { bold: true, size: 14 });
  y -= 28;

  // 1. Name of LLC
  draw(p1, "1. Name of the limited liability company:", margin, y, { bold: true, size: 10 });
  y -= 22;
  drawLine(p1, margin, PAGE_W - margin, y);
  draw(p1, c.llc_name ?? "", margin + 4, y + 4, { size: 11 });
  y -= 26;

  // 2. Close LLC election
  draw(p1, "2. This entity elects to be a close limited liability company:", margin, y, {
    bold: true,
    size: 10,
  });
  y -= 14;
  // unchecked square
  p1.drawRectangle({ x: margin, y: y - 10, width: 10, height: 10, borderColor: black, borderWidth: 0.7 });
  draw(p1, "(Refer to Close LLC Supplement W.S. 17-25-101 — 17-25-109.)", margin + 18, y - 8, {
    size: 8,
    color: gray,
  });
  y -= 28;

  // 3. Registered agent
  draw(p1, "3. Name and physical address of its registered agent:", margin, y, { bold: true, size: 10 });
  y -= 18;
  draw(p1, "Name:", margin, y, { size: 10 });
  drawLine(p1, margin + 40, PAGE_W - margin, y - 2);
  draw(p1, RA_NAME, margin + 44, y + 2, { size: 11 });
  y -= 20;
  draw(p1, "Address:", margin, y, { size: 10 });
  drawLine(p1, margin + 55, PAGE_W - margin, y - 2);
  draw(p1, `${RA_ADDRESS}, ${RA_CITY_STATE_ZIP}`, margin + 59, y + 2, { size: 11 });
  y -= 28;

  // 4. Mailing address of LLC
  draw(p1, "4. Mailing address of the limited liability company:", margin, y, { bold: true, size: 10 });
  y -= 22;
  drawLine(p1, margin, PAGE_W - margin, y);
  draw(p1, clientAddr, margin + 4, y + 4, { size: 10 });
  y -= 28;

  // 5. Principal office address
  draw(p1, "5. Principal office address:", margin, y, { bold: true, size: 10 });
  y -= 22;
  drawLine(p1, margin, PAGE_W - margin, y);
  draw(p1, clientAddr, margin + 4, y + 4, { size: 10 });
  y -= 28;

  // 6. Certification checkbox
  draw(p1, "6. Certification.", margin, y, { bold: true, size: 10 });
  y -= 16;
  p1.drawRectangle({ x: margin, y: y - 2, width: 10, height: 10, borderColor: black, borderWidth: 0.7 });
  // checked X
  draw(p1, "X", margin + 1.5, y - 1, { size: 9, bold: true });
  draw(
    p1,
    "I consent on behalf of the business entity to accept electronic service of process at the",
    margin + 18,
    y + 1,
    { size: 9 },
  );
  y -= 11;
  draw(p1, "required email address provided on the form under W.S. 17-28-104(e).", margin + 18, y, {
    size: 9,
  });
  y -= 26;

  // Signature block
  const signed = c.articles_signed_at
    ? new Date(c.articles_signed_at).toLocaleDateString("en-US")
    : "";
  draw(p1, "Signature:", margin, y, { size: 10 });
  drawLine(p1, margin + 60, margin + 320, y - 2);
  if (c.articles_signature_name) {
    draw(p1, c.articles_signature_name, margin + 65, y + 2, { size: 12 });
  }
  draw(p1, "Date:", margin + 340, y, { size: 10 });
  drawLine(p1, margin + 375, PAGE_W - margin, y - 2);
  draw(p1, signed, margin + 380, y + 2, { size: 11 });
  y -= 12;
  draw(p1, "(Shall be executed by an organizer.)", margin + 60, y, { size: 8, color: gray });
  draw(p1, "(mm/dd/yyyy)", margin + 375, y, { size: 8, color: gray });
  y -= 22;

  draw(p1, "Print Name:", margin, y, { size: 10 });
  drawLine(p1, margin + 70, PAGE_W - margin, y - 2);
  draw(p1, fullName, margin + 74, y + 2, { size: 11 });
  y -= 22;

  draw(p1, "Contact Person:", margin, y, { size: 10 });
  drawLine(p1, margin + 90, PAGE_W - margin, y - 2);
  draw(p1, fullName, margin + 94, y + 2, { size: 11 });
  y -= 22;

  draw(p1, "Daytime Phone Number:", margin, y, { size: 10 });
  drawLine(p1, margin + 130, margin + 290, y - 2);
  draw(p1, phone, margin + 134, y + 2, { size: 11 });
  draw(p1, "Email:", margin + 305, y, { size: 10 });
  drawLine(p1, margin + 340, PAGE_W - margin, y - 2);
  draw(p1, email, margin + 344, y + 2, { size: 11 });

  draw(p1, "LLC-ArticlesOrganization — Revised June 2021", margin, 36, { size: 8, color: gray });

  // ═════ PAGE 2 — REGISTERED AGENT CONSENT ═══════════════════════════════════
  const p2 = pdfDoc.addPage([PAGE_W, PAGE_H]);
  y = drawHeader(p2);

  draw(p2, "Consent to Appointment by Registered Agent", PAGE_W / 2 - 145, y, {
    bold: true,
    size: 13,
  });
  y -= 30;

  draw(p2, "I,", margin, y, { size: 11 });
  drawLine(p2, margin + 14, PAGE_W - margin - 110, y - 2);
  draw(p2, RA_NAME, margin + 18, y + 2, { size: 11 });
  draw(p2, ", registered office located at", PAGE_W - margin - 108, y, { size: 9 });
  y -= 12;
  draw(p2, "(name of registered agent)", margin + 18, y, { size: 8, color: gray });
  y -= 22;

  drawLine(p2, margin, PAGE_W - margin - 130, y);
  draw(p2, `${RA_ADDRESS}, ${RA_CITY_STATE_ZIP}`, margin + 4, y + 4, { size: 11 });
  draw(p2, "voluntarily consent to serve", PAGE_W - margin - 128, y + 4, { size: 9 });
  y -= 12;
  draw(p2, "*(registered office physical address, city, state, & zip)", margin + 4, y, {
    size: 8,
    color: gray,
  });
  y -= 26;

  draw(p2, "as the registered agent for", margin, y, { size: 11 });
  drawLine(p2, margin + 150, PAGE_W - margin, y - 2);
  draw(p2, c.llc_name ?? "", margin + 154, y + 2, { size: 11 });
  y -= 12;
  draw(p2, "(name of business entity)", margin + 154, y, { size: 8, color: gray });
  y -= 24;

  draw(
    p2,
    "I hereby certify that I am in compliance with the requirements of W.S. 17-28-101 through W.S. 17-28-111.",
    margin,
    y,
    { size: 10 },
  );
  y -= 36;

  // RA signature block
  draw(p2, "Signature:", margin, y, { size: 10 });
  drawLine(p2, margin + 60, margin + 320, y - 2);
  draw(p2, RA_NAME, margin + 65, y + 2, { size: 10 });
  draw(p2, "Date:", margin + 340, y, { size: 10 });
  drawLine(p2, margin + 375, PAGE_W - margin, y - 2);
  draw(p2, signed, margin + 380, y + 2, { size: 11 });
  y -= 12;
  draw(p2, "(Shall be executed by the registered agent.)", margin + 60, y, { size: 8, color: gray });
  draw(p2, "(mm/dd/yyyy)", margin + 375, y, { size: 8, color: gray });
  y -= 22;

  draw(p2, "Print Name:", margin, y, { size: 10 });
  drawLine(p2, margin + 70, margin + 320, y - 2);
  draw(p2, "USADOC Registered Agent Services LLC", margin + 74, y + 2, { size: 10 });
  draw(p2, "Daytime Phone:", margin + 340, y, { size: 10 });
  drawLine(p2, margin + 425, PAGE_W - margin, y - 2);
  y -= 22;

  draw(p2, "Title:", margin, y, { size: 10 });
  drawLine(p2, margin + 35, margin + 320, y - 2);
  draw(p2, "Registered Agent", margin + 39, y + 2, { size: 10 });
  draw(p2, "Email:", margin + 340, y, { size: 10 });
  drawLine(p2, margin + 380, PAGE_W - margin, y - 2);
  y -= 32;

  draw(p2, "Registered Agent Mailing Address (if different than above):", margin, y, {
    bold: true,
    size: 10,
  });
  y -= 18;
  drawLine(p2, margin, PAGE_W - margin, y);
  y -= 20;
  drawLine(p2, margin, PAGE_W - margin, y);

  draw(p2, "RAConsent — Revised December 2021", margin, 36, { size: 8, color: gray });

  const bytes = await pdfDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
