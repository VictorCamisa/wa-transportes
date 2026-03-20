
-- Primeiro, vamos dropar as políticas existentes que estão causando problemas
DROP POLICY IF EXISTS "Admins can view all permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can insert permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can update permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can delete permissions" ON public.user_permissions;

-- Dropar políticas existentes da tabela profiles para recriar
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Dropar a função que está causando recursão infinita
DROP FUNCTION IF EXISTS public.is_current_user_admin();

-- Criar uma função de segurança definer para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Criar uma função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT public.get_current_user_role() = 'admin';
$$;

-- Habilitar RLS nas tabelas se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recriar as políticas RLS usando a nova função para user_permissions
CREATE POLICY "Admins can view all permissions"
  ON public.user_permissions
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert permissions"
  ON public.user_permissions
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update permissions"
  ON public.user_permissions
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete permissions"
  ON public.user_permissions
  FOR DELETE
  USING (public.is_admin());

-- Criar políticas RLS para a tabela profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());
