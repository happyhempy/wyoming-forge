ALTER TABLE public.cases
  ADD COLUMN trade_name text,
  ADD COLUMN business_purpose text,
  ADD COLUMN products_services text,
  ADD COLUMN business_start_date date;