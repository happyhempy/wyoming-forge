import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";

type Case = Database["public"]["Tables"]["cases"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Generates a Wyoming Articles of Organization PDF (Domestic LLC) from scratch.
 * NOTE: This is a working draft built from the official Wyoming SOS form structure.
 * Once the user provides the actual blank PDF, swap to a field-mapped version like generateSS4.
 */
export async function generateArticlesPdf(c: Case, profile?: Profile | null): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.07, 0.12, 0.25);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.35, 0.35, 0.35);

  let y = 750;
  const margin = 50;
  const lineH = 16;

  const draw = (text: string, x: number, yy: number, opts: { size?: number; bold?: boolean; color?: any } = {}) => {
    page.drawText(text || "", {
      x,
      y: yy,
      size: opts.size ?? 11,
      font: opts.bold ? bold : font,
      color: opts.color ?? black,
    });
  };

  const drawField = (label: string, value: string) => {
    draw(label, margin, y, { size: 9, bold: true, color: gray });
    y -= 14;
    // underline
    page.drawLine({
      start: { x: margin, y: y - 2 },
      end: { x: 612 - margin, y: y - 2 },
      thickness: 0.5,
      color: gray,
    });
    draw(value || "", margin + 4, y + 2, { size: 11 });
    y -= lineH + 6;
  };

  // Header
  draw("STATE OF WYOMING", 612 / 2 - 70, y, { bold: true, size: 14, color: navy });
  y -= 18;
  draw("Office of the Secretary of State", 612 / 2 - 95, y, { size: 10, color: gray });
  y -= 28;
  draw("ARTICLES OF ORGANIZATION", 612 / 2 - 110, y, { bold: true, size: 16, color: navy });
  y -= 14;
  draw("(Domestic Limited Liability Company)", 612 / 2 - 110, y, { size: 9, color: gray });
  y -= 30;

  // Article 1 — Name
  draw("ARTICLE 1 — Name of the Limited Liability Company", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  drawField("Legal name of the LLC (must contain 'LLC', 'L.L.C.', or 'Limited Liability Company')", c.llc_name ?? "");

  // Article 2 — Registered Office & Agent (admin-provided defaults shown for reference)
  draw("ARTICLE 2 — Registered Agent and Registered Office in Wyoming", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  drawField("Registered Agent (provided by USADOC)", "USADOC Registered Agent Services LLC");
  drawField("Registered Office (Wyoming street address)", "30 N Gould St, Ste R, Sheridan, WY 82801");

  // Article 3 — Mailing Address of LLC
  draw("ARTICLE 3 — Principal Mailing Address of the LLC", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  const clientAddr = [
    c.client_address_line,
    [c.client_city, c.client_state_region, c.client_postal_code].filter(Boolean).join(", "),
    c.client_country,
  ].filter(Boolean).join(" — ");
  drawField("Mailing address", clientAddr);

  // Article 4 — Organizer
  draw("ARTICLE 4 — Organizer", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  drawField("Name of Organizer", fullName);
  drawField("Organizer Address", clientAddr);

  // Article 5 — Effective Date
  draw("ARTICLE 5 — Effective Date", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  drawField("Effective date of filing", c.business_start_date
    ? new Date(c.business_start_date).toLocaleDateString("en-US")
    : "Upon filing");

  // Signature block
  y -= 10;
  draw("SIGNATURE OF ORGANIZER", margin, y, { bold: true, size: 10, color: navy });
  y -= 18;
  draw("Signature: ", margin, y, { size: 10 });
  page.drawLine({ start: { x: margin + 60, y: y - 2 }, end: { x: margin + 280, y: y - 2 }, thickness: 0.5, color: gray });
  if (c.articles_signature_name) {
    draw(c.articles_signature_name, margin + 65, y + 2, { size: 12 });
  }
  draw("Date: ", margin + 300, y, { size: 10 });
  page.drawLine({ start: { x: margin + 335, y: y - 2 }, end: { x: 612 - margin, y: y - 2 }, thickness: 0.5, color: gray });
  draw(
    c.articles_signed_at ? new Date(c.articles_signed_at).toLocaleDateString("en-US") : new Date().toLocaleDateString("en-US"),
    margin + 340,
    y + 2,
    { size: 11 },
  );
  y -= 26;
  draw("Printed name of Organizer", margin, y, { size: 9, color: gray });
  y -= 14;
  page.drawLine({ start: { x: margin, y: y - 2 }, end: { x: 612 / 2, y: y - 2 }, thickness: 0.5, color: gray });
  draw(fullName, margin + 4, y + 2, { size: 11 });

  // Footer
  draw(
    "Prepared by USADOC — Draft generated for filing. Verify all fields against the official Wyoming SOS template before submission.",
    margin,
    40,
    { size: 8, color: gray },
  );

  const bytes = await pdfDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
