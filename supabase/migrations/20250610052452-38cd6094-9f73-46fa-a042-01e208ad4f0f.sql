
-- Remover a foreign key constraint que está causando o problema
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Adicionar uma coluna de email para referência (se não existir)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Gerar emails únicos para registros existentes
UPDATE public.profiles 
SET email = CONCAT(username, '@sistema.local')
WHERE email IS NULL OR email = 'email@exemplo.com';

-- Tornar o email obrigatório
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;

-- Criar um índice único para o email
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_key ON public.profiles(email);
