-- Confirmar email da Paula para permitir login
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmation_token = null,
    confirmation_sent_at = null
WHERE email = 'paula@watransportes.com';