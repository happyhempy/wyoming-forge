ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS renewal_cancelled_at timestamptz;

CREATE OR REPLACE FUNCTION public.cancel_renewal()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_case_id uuid;
BEGIN
  SELECT id INTO target_case_id
  FROM public.cases
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;

  IF target_case_id IS NULL THEN
    RAISE EXCEPTION 'No active case found';
  END IF;

  UPDATE public.cases
  SET renewal_cancelled_at = NOW()
  WHERE id = target_case_id
    AND renewal_cancelled_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_renewal() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_renewal() TO service_role;