ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS articles_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS articles_signature_name text;