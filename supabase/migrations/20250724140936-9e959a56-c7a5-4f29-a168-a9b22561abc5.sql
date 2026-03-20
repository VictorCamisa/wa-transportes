-- Atualizar senha da Paula
UPDATE auth.users 
SET encrypted_password = crypt('Wa@2025', gen_salt('bf')),
    updated_at = now()
WHERE email = 'paula@watransportes.com';