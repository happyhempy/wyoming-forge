ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS client_address_line text,
  ADD COLUMN IF NOT EXISTS client_city text,
  ADD COLUMN IF NOT EXISTS client_state_region text,
  ADD COLUMN IF NOT EXISTS client_postal_code text,
  ADD COLUMN IF NOT EXISTS client_country text;