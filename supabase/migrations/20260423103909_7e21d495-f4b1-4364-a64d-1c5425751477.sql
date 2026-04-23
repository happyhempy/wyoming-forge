-- Add renewal tracking fields to cases
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS years_paid integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS renewal_reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS expired_notification_sent_at timestamptz;

-- Constraint: years_paid must be 1 or 2
ALTER TABLE public.cases
  DROP CONSTRAINT IF EXISTS cases_years_paid_check;
ALTER TABLE public.cases
  ADD CONSTRAINT cases_years_paid_check CHECK (years_paid IN (1, 2));

-- Email log table to prevent duplicate sends
CREATE TABLE IF NOT EXISTS public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb,
  UNIQUE (case_id, email_type)
);

CREATE INDEX IF NOT EXISTS idx_email_log_case_id ON public.email_log(case_id);
CREATE INDEX IF NOT EXISTS idx_email_log_email_type ON public.email_log(email_type);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email log"
  ON public.email_log FOR SELECT
  USING (public.has_any_admin_role(auth.uid()));

-- Index for renewal cron job (find cases expiring soon)
CREATE INDEX IF NOT EXISTS idx_cases_expires_at ON public.cases(expires_at)
  WHERE payment_status = 'completed';