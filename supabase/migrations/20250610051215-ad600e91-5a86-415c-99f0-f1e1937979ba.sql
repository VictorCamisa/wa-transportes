
-- Criar tabela para gerenciar permissões dos usuários
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Habilitar RLS na tabela de permissões
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Função para verificar se um usuário tem uma permissão específica
CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions 
    WHERE user_permissions.user_id = has_permission.user_id 
    AND user_permissions.permission = permission_name
  );
$$;

-- Função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Políticas RLS para user_permissions
CREATE POLICY "Admins can view all permissions"
  ON public.user_permissions
  FOR SELECT
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can insert permissions"
  ON public.user_permissions
  FOR INSERT
  WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update permissions"
  ON public.user_permissions
  FOR UPDATE
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete permissions"
  ON public.user_permissions
  FOR DELETE
  USING (public.is_current_user_admin());

-- Adicionar permissões padrão para o usuário admin existente (assumindo que já existe)
-- Isso pode ser executado manualmente depois se necessário
