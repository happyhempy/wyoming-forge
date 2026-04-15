
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'client');

-- Create case step status enum
CREATE TYPE public.step_status AS ENUM ('pending', 'in_progress', 'completed', 'locked');

-- Create package enum
CREATE TYPE public.package_type AS ENUM ('basic', 'popular', 'premium');

-- Create payment status enum  
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create affiliate status enum
CREATE TYPE public.affiliate_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USER ROLES TABLE (separate from profiles per security best practice)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER FUNCTION for role checks (avoids RLS recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_admin_role(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'superadmin')
  )
$$;

-- ============================================================
-- CASES TABLE
-- ============================================================
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package package_type NOT NULL DEFAULT 'basic',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  current_step INT NOT NULL DEFAULT 1,
  llc_name TEXT,
  sole_owner BOOLEAN DEFAULT true,
  first_name TEXT,
  last_name TEXT,
  passport_url TEXT,
  stripe_session_id TEXT,
  assigned_admin UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CASE STEPS TABLE
-- ============================================================
CREATE TABLE public.case_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  step_number INT NOT NULL,
  step_name TEXT NOT NULL,
  status step_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(case_id, step_number)
);
ALTER TABLE public.case_steps ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DOCUMENTS TABLE
-- ============================================================
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_role app_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PARTNERS TABLE
-- ============================================================
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  ownership_percentage NUMERIC(5,2) NOT NULL CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LEADS TABLE
-- ============================================================
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- AFFILIATES TABLE
-- ============================================================
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  promotion_plan TEXT,
  status affiliate_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS POLICIES — PROFILES
-- ============================================================
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_any_admin_role(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES — USER ROLES
-- ============================================================
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- ============================================================
-- RLS POLICIES — CASES
-- ============================================================
CREATE POLICY "Clients can view own cases" ON public.cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Assigned admins can view cases" ON public.cases
  FOR SELECT USING (auth.uid() = assigned_admin);

CREATE POLICY "Superadmins can view all cases" ON public.cases
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update assigned cases" ON public.cases
  FOR UPDATE USING (
    auth.uid() = assigned_admin OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "System can insert cases" ON public.cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES — CASE STEPS
-- ============================================================
CREATE POLICY "Users can view own case steps" ON public.case_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_steps.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Admins can view assigned case steps" ON public.case_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_steps.case_id AND cases.assigned_admin = auth.uid())
  );

CREATE POLICY "Superadmins can view all case steps" ON public.case_steps
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update case steps" ON public.case_steps
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_steps.case_id AND (cases.assigned_admin = auth.uid() OR public.has_role(auth.uid(), 'superadmin')))
  );

CREATE POLICY "System can insert case steps" ON public.case_steps
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = case_steps.case_id AND (cases.user_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin')))
  );

-- ============================================================
-- RLS POLICIES — DOCUMENTS
-- ============================================================
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Admins can view assigned case documents" ON public.documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND cases.assigned_admin = auth.uid())
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Users can upload own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can upload documents" ON public.documents
  FOR INSERT WITH CHECK (public.has_any_admin_role(auth.uid()));

-- ============================================================
-- RLS POLICIES — MESSAGES
-- ============================================================
CREATE POLICY "Users can view own case messages" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = messages.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Admins can view assigned case messages" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = messages.case_id AND cases.assigned_admin = auth.uid())
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "Users can send messages on own cases" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = messages.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Admins can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND public.has_any_admin_role(auth.uid())
  );

-- ============================================================
-- RLS POLICIES — PARTNERS
-- ============================================================
CREATE POLICY "Users can view own partners" ON public.partners
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = partners.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Users can manage own partners" ON public.partners
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.cases WHERE cases.id = partners.case_id AND cases.user_id = auth.uid())
  );

CREATE POLICY "Admins can view partners" ON public.partners
  FOR SELECT USING (public.has_any_admin_role(auth.uid()));

-- ============================================================
-- RLS POLICIES — LEADS (public insert, admin read)
-- ============================================================
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

-- ============================================================
-- RLS POLICIES — AFFILIATES (public insert, admin read)
-- ============================================================
CREATE POLICY "Anyone can apply as affiliate" ON public.affiliates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Superadmins can view affiliates" ON public.affiliates
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Superadmins can update affiliates" ON public.affiliates
  FOR UPDATE USING (public.has_role(auth.uid(), 'superadmin'));

-- ============================================================
-- RLS POLICIES — BLOG POSTS
-- ============================================================
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Superadmins can view all posts" ON public.blog_posts
  FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Superadmins can manage posts" ON public.blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- ============================================================
-- STORAGE POLICIES — DOCUMENTS BUCKET
-- ============================================================
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND public.has_any_admin_role(auth.uid())
  );

CREATE POLICY "Admins can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND public.has_any_admin_role(auth.uid())
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_cases_user_id ON public.cases(user_id);
CREATE INDEX idx_cases_assigned_admin ON public.cases(assigned_admin);
CREATE INDEX idx_case_steps_case_id ON public.case_steps(case_id);
CREATE INDEX idx_documents_case_id ON public.documents(case_id);
CREATE INDEX idx_messages_case_id ON public.messages(case_id);
CREATE INDEX idx_partners_case_id ON public.partners(case_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
