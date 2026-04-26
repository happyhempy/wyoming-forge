// Shared inline styles for USADOC transactional emails.
// Brand: navy + gold accents. Body background must remain white.

export const SITE_NAME = "USADOC";
export const SITE_URL = "https://usadoc.net";
export const SUPPORT_EMAIL = "support@usadoc.net";
export const NAVY = "#0b1d3a";
export const GOLD = "#c8a04a";

export const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: 0,
} as const;

export const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px 24px",
} as const;

export const brandBar = {
  backgroundColor: NAVY,
  color: "#ffffff",
  padding: "20px 24px",
  borderRadius: "8px 8px 0 0",
  fontSize: "20px",
  fontWeight: 700 as const,
  letterSpacing: "1px",
} as const;

export const card = {
  border: "1px solid #e6e8ee",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  padding: "28px 24px",
} as const;

export const h1 = {
  fontSize: "22px",
  fontWeight: 700 as const,
  color: NAVY,
  margin: "0 0 16px",
} as const;

export const h2 = {
  fontSize: "16px",
  fontWeight: 600 as const,
  color: NAVY,
  margin: "24px 0 8px",
} as const;

export const text = {
  fontSize: "15px",
  color: "#3a3f4b",
  lineHeight: "1.6",
  margin: "0 0 14px",
} as const;

export const muted = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "1.5",
  margin: "16px 0 0",
} as const;

export const button = {
  backgroundColor: GOLD,
  color: NAVY,
  fontSize: "15px",
  fontWeight: 700 as const,
  borderRadius: "6px",
  padding: "12px 22px",
  textDecoration: "none",
  display: "inline-block",
} as const;

export const list = {
  fontSize: "15px",
  color: "#3a3f4b",
  lineHeight: "1.7",
  margin: "0 0 14px",
  paddingLeft: "20px",
} as const;

export const footer = {
  fontSize: "12px",
  color: "#9aa0ad",
  textAlign: "center" as const,
  marginTop: "28px",
  lineHeight: "1.6",
} as const;
