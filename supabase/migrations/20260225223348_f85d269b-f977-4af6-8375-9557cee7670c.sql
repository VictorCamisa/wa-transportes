
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Authenticated users can view roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Create servicos_maio table
CREATE TABLE public.servicos_maio (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    empresa text NOT NULL,
    solicitante text,
    servico text,
    cidade text,
    valor_texto text,
    valor_numerico numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    data_servico date DEFAULT CURRENT_DATE NOT NULL
);

ALTER TABLE public.servicos_maio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view servicos"
    ON public.servicos_maio FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert servicos"
    ON public.servicos_maio FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update servicos"
    ON public.servicos_maio FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete servicos"
    ON public.servicos_maio FOR DELETE
    TO authenticated
    USING (true);

-- Create custos_maio table (without CHECK constraint, using trigger instead)
CREATE TABLE public.custos_maio (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    descricao text NOT NULL,
    data_vencimento date NOT NULL,
    valor_texto text NOT NULL,
    forma_pagamento text NOT NULL,
    tipo text NOT NULL,
    valor_numerico numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Validation trigger for tipo column
CREATE OR REPLACE FUNCTION public.validate_custos_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo NOT IN ('Fixo', 'Variável') THEN
        RAISE EXCEPTION 'tipo must be Fixo or Variável';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_custos_maio_tipo
    BEFORE INSERT OR UPDATE ON public.custos_maio
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_custos_tipo();

ALTER TABLE public.custos_maio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view custos"
    ON public.custos_maio FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert custos"
    ON public.custos_maio FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update custos"
    ON public.custos_maio FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete custos"
    ON public.custos_maio FOR DELETE
    TO authenticated
    USING (true);

-- Create user_permissions table (legacy, keeping for compatibility)
CREATE TABLE public.user_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    permission text NOT NULL,
    granted_by uuid,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view permissions"
    ON public.user_permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage permissions"
    ON public.user_permissions FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup (auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
