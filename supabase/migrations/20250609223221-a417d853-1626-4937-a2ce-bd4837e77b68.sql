
-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam apenas seu próprio perfil
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Criar política para permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Criar política para permitir inserção de novos perfis (para o trigger)
CREATE POLICY "Enable insert for service role" ON public.profiles
    FOR INSERT WITH CHECK (true);
