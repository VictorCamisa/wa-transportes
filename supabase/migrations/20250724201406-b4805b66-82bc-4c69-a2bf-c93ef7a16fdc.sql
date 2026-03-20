-- Primeiro, deletar o usuário Oxinho existente se ele existir
DO $$
BEGIN
    -- Deletar da tabela profiles primeiro (se existir)
    DELETE FROM public.profiles WHERE email = 'oxinho@watransportes.com';
    
    -- Tentar deletar da tabela auth.users (pode não funcionar via SQL diretamente)
    -- Vamos fazer isso programaticamente depois
END $$;

-- Criar/inserir novos usuários na tabela profiles
-- Primeiro, vamos criar as entradas de profile para os novos usuários
-- Os IDs serão gerados quando eles fizerem login pela primeira vez

-- Inserir perfil para Fico (temporário até ele fazer login)
INSERT INTO public.profiles (id, username, email, role) 
VALUES (gen_random_uuid(), 'fico', 'fico@watransportes.com', 'user')
ON CONFLICT (email) DO UPDATE SET 
    username = EXCLUDED.username,
    role = EXCLUDED.role;

-- Inserir perfil para Oxinho (temporário até ele fazer login)  
INSERT INTO public.profiles (id, username, email, role) 
VALUES (gen_random_uuid(), 'oxinho', 'oxinho@watransportes.com', 'user')
ON CONFLICT (email) DO UPDATE SET 
    username = EXCLUDED.username,
    role = EXCLUDED.role;