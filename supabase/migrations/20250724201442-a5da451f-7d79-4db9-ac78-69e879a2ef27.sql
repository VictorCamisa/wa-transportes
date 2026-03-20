-- Deletar o usuário Oxinho existente da tabela profiles
DELETE FROM public.profiles WHERE email = 'oxinho@watransportes.com';

-- Inserir perfis temporários para os novos usuários
-- Eles serão atualizados quando fizerem login pela primeira vez
INSERT INTO public.profiles (id, username, email, role) 
VALUES 
    (gen_random_uuid(), 'fico', 'fico@watransportes.com', 'user'),
    (gen_random_uuid(), 'oxinho', 'oxinho@watransportes.com', 'user');