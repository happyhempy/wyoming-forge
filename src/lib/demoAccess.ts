import type { Database } from "@/integrations/supabase/types";

export type DemoMode = "client" | "admin";

const DEMO_MODE_KEY = "usadoc_demo_mode";
const DEMO_CLIENT_STATE_KEY = "usadoc_demo_client_state_v1";

export const DEMO_CLIENT_ID = "demo-client-user";
export const DEMO_ADMIN_ID = "demo-admin-user";

export function getDemoMode(): DemoMode | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(DEMO_MODE_KEY) ?? localStorage.getItem(DEMO_MODE_KEY);
  return value === "client" || value === "admin" ? value : null;
}

export function setDemoMode(mode: DemoMode) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DEMO_MODE_KEY, mode);
  localStorage.setItem(DEMO_MODE_KEY, mode);
}

export function clearDemoMode() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_MODE_KEY);
}

type Case = Database["public"]["Tables"]["cases"]["Row"];
type CaseStep = Database["public"]["Tables"]["case_steps"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
export type DemoClientData = { case: Case; steps: CaseStep[]; documents: Document[]; messages: Message[] };

const now = new Date().toISOString();
const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString();

export const demoCase: Case = {
  id: "demo-case-001",
  user_id: DEMO_CLIENT_ID,
  assigned_admin: DEMO_ADMIN_ID,
  first_name: null,
  last_name: null,
  llc_name: null,
  package: "premium",
  payment_status: "completed",
  paid_at: now,
  years_paid: 2,
  current_step: 1,
  passport_url: null,
  trade_name: null,
  business_purpose: null,
  products_services: null,
  business_start_date: null,
  sole_owner: true,
  stripe_session_id: null,
  expires_at: expires,
  renewal_reminder_sent_at: null,
  renewal_cancelled_at: null,
  expired_notification_sent_at: null,
  articles_signed_at: null,
  articles_signature_name: null,
  client_address_line: null,
  client_city: null,
  client_state_region: null,
  client_postal_code: null,
  client_country: null,
  created_at: now,
  updated_at: now,
};

export const demoSteps: CaseStep[] = [
  { id: "demo-step-1", case_id: demoCase.id, step_number: 1, step_name: "Intake & KYC", status: "in_progress", completed_at: null, created_at: now },
  { id: "demo-step-2", case_id: demoCase.id, step_number: 2, step_name: "LLC Name Reservation", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-3", case_id: demoCase.id, step_number: 3, step_name: "Articles of Organization", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-4", case_id: demoCase.id, step_number: 4, step_name: "EIN Application", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-5", case_id: demoCase.id, step_number: 5, step_name: "Operating Agreement", status: "pending", completed_at: null, created_at: now },
  { id: "demo-step-6", case_id: demoCase.id, step_number: 6, step_name: "Mercury Bank Account", status: "pending", completed_at: null, created_at: now },
];

export const demoDocuments: Document[] = [];

export const demoMessages: Message[] = [];

export function getFreshDemoClientData(): DemoClientData {
  return {
    case: { ...demoCase, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    steps: demoSteps.map((step) => ({ ...step, created_at: new Date().toISOString() })),
    documents: [],
    messages: [],
  };
}

export function saveDemoClientData(data: DemoClientData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_CLIENT_STATE_KEY, JSON.stringify(data));
}

export function getDemoClientData(): DemoClientData {
  if (typeof window === "undefined") return getFreshDemoClientData();
  const saved = localStorage.getItem(DEMO_CLIENT_STATE_KEY);
  if (!saved) {
    const fresh = getFreshDemoClientData();
    saveDemoClientData(fresh);
    return fresh;
  }
  try {
    return JSON.parse(saved) as DemoClientData;
  } catch {
    const fresh = getFreshDemoClientData();
    saveDemoClientData(fresh);
    return fresh;
  }
}

export function resetDemoClientFlow() {
  const fresh = getFreshDemoClientData();
  saveDemoClientData(fresh);
  return fresh;
}

export function updateDemoCase(updates: Partial<Case>) {
  const data = getDemoClientData();
  data.case = { ...data.case, ...updates, updated_at: new Date().toISOString() };
  data.steps = data.steps.map((step) => step.step_number === 1 ? { ...step, status: "completed", completed_at: new Date().toISOString() } : step);
  if (data.steps.some((step) => step.step_number === 2 && step.status === "pending")) {
    data.steps = data.steps.map((step) => step.step_number === 2 ? { ...step, status: "in_progress" } : step);
    data.case.current_step = 2;
  }
  saveDemoClientData(data);
  return data;
}

export function addDemoDocument(fileName: string, documentType = "passport", uploadedBy = DEMO_CLIENT_ID) {
  const data = getDemoClientData();
  const createdAt = new Date().toISOString();
  data.documents = [{
    id: `demo-doc-${Date.now()}`,
    case_id: data.case.id,
    uploaded_by: uploadedBy,
    file_url: `demo/${fileName}`,
    file_name: fileName,
    document_type: documentType,
    created_at: createdAt,
  }, ...data.documents];
  saveDemoClientData(data);
  return data;
}

export function addDemoMessage(content: string, senderRole: "client" | "admin") {
  const data = getDemoClientData();
  data.messages = [...data.messages, {
    id: `demo-msg-${Date.now()}`,
    case_id: data.case.id,
    sender_id: senderRole === "admin" ? DEMO_ADMIN_ID : DEMO_CLIENT_ID,
    sender_role: senderRole,
    content,
    created_at: new Date().toISOString(),
  }];
  saveDemoClientData(data);
  return data;
}

export function updateDemoStep(stepNumber: number, status: Database["public"]["Enums"]["step_status"]) {
  const data = getDemoClientData();
  data.steps = data.steps.map((step) => step.step_number === stepNumber ? { ...step, status, completed_at: status === "completed" ? new Date().toISOString() : null } : step);
  if (status === "completed") data.case.current_step = Math.min(stepNumber + 1, 8);
  saveDemoClientData(data);
  return data;
}