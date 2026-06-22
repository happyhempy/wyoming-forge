CREATE POLICY "Admins can view unassigned cases"
ON public.cases
FOR SELECT
TO authenticated
USING (assigned_admin IS NULL AND public.has_any_admin_role(auth.uid()));

CREATE POLICY "Admins can view unassigned case steps"
ON public.case_steps
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_steps.case_id
      AND cases.assigned_admin IS NULL
      AND public.has_any_admin_role(auth.uid())
  )
);

CREATE POLICY "Clients can update own document submission step"
ON public.case_steps
FOR UPDATE
TO authenticated
USING (
  step_number = 2
  AND EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_steps.case_id
      AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  step_number = 2
  AND EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_steps.case_id
      AND cases.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view unassigned case documents"
ON public.documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
      AND cases.assigned_admin IS NULL
      AND public.has_any_admin_role(auth.uid())
  )
);

CREATE POLICY "Admins can view unassigned case messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = messages.case_id
      AND cases.assigned_admin IS NULL
      AND public.has_any_admin_role(auth.uid())
  )
);

CREATE POLICY "Admins can view client profiles for visible cases"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.user_id = profiles.user_id
      AND (
        cases.assigned_admin = auth.uid()
        OR cases.assigned_admin IS NULL AND public.has_any_admin_role(auth.uid())
        OR public.has_role(auth.uid(), 'superadmin')
      )
  )
);