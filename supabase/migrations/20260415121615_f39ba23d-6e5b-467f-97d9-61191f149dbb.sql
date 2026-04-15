-- Create a test case for user to see dashboard
INSERT INTO public.cases (id, user_id, package, payment_status, current_step, first_name, last_name, llc_name, sole_owner)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'f195911b-c9d3-4e26-8010-c4a5788bf53e',
  'popular',
  'completed',
  3,
  'Test',
  'User',
  'My Cool LLC',
  true
);

-- Create steps
INSERT INTO public.case_steps (case_id, step_number, step_name, status, completed_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 1, 'Payment Received', 'completed', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000001', 2, 'Documents Submitted', 'completed', now() - interval '3 days'),
  ('a0000000-0000-0000-0000-000000000001', 3, 'Articles of Organization Filed', 'in_progress', null),
  ('a0000000-0000-0000-0000-000000000001', 4, 'EIN Application Submitted', 'pending', null),
  ('a0000000-0000-0000-0000-000000000001', 5, 'EIN Received', 'pending', null),
  ('a0000000-0000-0000-0000-000000000001', 6, 'Registered Agent Confirmed', 'pending', null),
  ('a0000000-0000-0000-0000-000000000001', 7, 'Mercury Bank Account', 'pending', null),
  ('a0000000-0000-0000-0000-000000000001', 8, 'Process Complete', 'pending', null);

-- Add a welcome message from admin
INSERT INTO public.messages (case_id, sender_id, sender_role, content)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'f195911b-c9d3-4e26-8010-c4a5788bf53e',
  'admin',
  'Welcome! Your LLC formation process has started. We are currently filing your Articles of Organization. Please upload your passport copy when ready.'
);