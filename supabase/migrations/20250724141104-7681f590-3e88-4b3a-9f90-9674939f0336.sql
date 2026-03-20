-- Deletar o usuário Paula existente e recriar
DELETE FROM public.profiles WHERE email = 'paula@watransportes.com';
DELETE FROM auth.users WHERE email = 'paula@watransportes.com';

-- Criar novo usuário Paula usando a tabela auth.users com método mais direto
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'paula@watransportes.com',
  crypt('Wa@2025', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Criar perfil para o usuário
INSERT INTO public.profiles (
  id,
  username,
  email,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'paula@watransportes.com'),
  'paula',
  'paula@watransportes.com',
  'user',
  now(),
  now()
);