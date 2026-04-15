
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Anyone can apply as affiliate" ON public.affiliates;

-- Recreate with explicit anon + authenticated access
CREATE POLICY "Anon and authenticated can submit leads" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) > 0 AND length(full_name) <= 255 AND
    length(email) > 0 AND length(email) <= 255 AND
    length(business_type) > 0 AND length(business_type) <= 255
  );

CREATE POLICY "Anon and authenticated can apply as affiliate" ON public.affiliates
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) > 0 AND length(full_name) <= 255 AND
    length(email) > 0 AND length(email) <= 255
  );
