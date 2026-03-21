-- Company settings table
CREATE TABLE public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'W&A Transportes',
  cnpj text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  zip_code text,
  logo_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings" ON public.company_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage settings" ON public.company_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default row
INSERT INTO public.company_settings (name) VALUES ('W&A Transportes');

-- Employee documents table
CREATE TABLE public.employee_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_number text,
  expiry_date date,
  file_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage documents" ON public.employee_documents
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own documents" ON public.employee_documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Activity logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs" ON public.activity_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own logs" ON public.activity_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can insert logs" ON public.activity_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Add status and extra fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

CREATE POLICY "Admins can manage document files" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can view own document files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text
  );