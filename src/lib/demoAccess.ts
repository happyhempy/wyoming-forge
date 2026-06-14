import type { Database } from "@/integrations/supabase/types";

export type DemoMode = "client" | "admin";

const DEMO_MODE_KEY = "usadoc_demo_mode";

export const DEMO_CLIENT_ID = "demo-client-user";
export const DEMO_ADMIN_ID = "demo-admin-user";

export function getDemoMode(): DemoMode | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(DEMO_MODE_KEY);
  return value === "client" || value === "admin" ? value : null;
}

export function setDemoMode(mode: DemoMode) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DEMO_MODE_KEY, mode);
}

export function clearDemoMode() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DEMO_MODE_KEY);
}

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

const now = new Date().toISOString();
const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString();

export const demoCase: Case = {
  id: "demo-case-001",
  user_id: DEMO_CLIENT_ID,
  assigned_admin: DEMO_ADMIN_ID,
  first_name: "Itamar",
  last_name: "Manor",
  llc_name: "Manor Digital LLC",
  package: "premium",
  payment_status: "completed",
  paid_at: now,
  years_paid: 2,
  current_step: 3,
  passport_url: "demo/passport.pdf",
  trade_name: null,
  business_purpose: "E-commerce and digital consulting services",
  products_services: "Online sales, consulting, and software services",
  business_start_date: now.slice(0, 10),
  sole_owner: true,
  stripe_session_id: null,
  expires_at: expires,
  renewal_reminder_sent_at: null,
  expired_notification_sent_at: null,
  created_at: now,
  updated_at: now,
};

export const demoSteps: CaseStep[] = [
  { id: "demo-step-1", case_id: demoCase.id, step_number: 1, step_name: "Intake & KYC", status: "completed", completed_at: now, created_at: now },
  { id: "demo-step-2", case_id: demoCase.id, step_number: 2, step_name: "LLC Name Reservation", status: "completed", completed_at: now, created_at: now },
  { id: "demo-step-3", case_id: demoCase.id, step_number: 3, step_name: "Articles of Organization", status: "in_progress", completed_at: null, created_at: now },
  { id: "demo-step-4", case_id: demoCase.id, step_number: 4, step_name: "EIN Application", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-5", case_id: demoCase.id, step_number: 5, step_name: "Operating Agreement", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-6", case_id: demoCase.id, step_number: 6, step_name: "Mercury Bank Account", status: "pending", completed_at: null, created_at: now },
];

export const demoDocuments: Document[] = [
  { id: "demo-doc-1", case_id: demoCase.id, uploaded_by: DEMO_CLIENT_ID, file_url: "demo/passport.pdf", file_name: "passport-demo.pdf", document_type: "passport", created_at: now },
  { id: "demo-doc-2", case_id: demoCase.id, uploaded_by: DEMO_ADMIN_ID, file_url: "demo/articles.pdf", file_name: "Articles-of-Organization-draft.pdf", document_type: "llc_document", created_at: now },
];

export const demoMessages: Message[] = [
  { id: "demo-msg-1", case_id: demoCase.id, sender_id: DEMO_ADMIN_ID, sender_role: "admin", content: "We received your details and started preparing the Wyoming filing.", created_at: now },
  { id: "demo-msg-2", case_id: demoCase.id, sender_id: DEMO_CLIENT_ID, sender_role: "client", content: "Great, please keep me updated when the EIN step starts.", created_at: now },
];