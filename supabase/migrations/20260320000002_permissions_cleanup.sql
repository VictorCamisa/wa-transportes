-- Migration: Promote hardcoded users to proper DB roles/permissions
-- Run this BEFORE removing hardcoded emails from the frontend code

-- Promote full-access users to admin role
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'
FROM public.profiles p
WHERE p.email IN (
    'mayte@watransportes.com',
    'victor@watransportes.com',
    'paula@watransportes.com'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Grant checklist_access to checklist users
INSERT INTO public.user_permissions (user_id, permission, granted_by)
SELECT p.id, 'checklist_access', (SELECT id FROM public.profiles WHERE email = 'victor@watransportes.com' LIMIT 1)
FROM public.profiles p
WHERE p.email IN (
    'gilberto@watransportes.com',
    'michel@watransportes.com',
    'fico@watransportes.com',
    'oxinho@watransportes.com'
)
ON CONFLICT DO NOTHING;

-- Also grant checklist_access to paula (she's admin but ensuring explicit permission)
INSERT INTO public.user_permissions (user_id, permission, granted_by)
SELECT p.id, 'checklist_access', p.id
FROM public.profiles p
WHERE p.email = 'paula@watransportes.com'
ON CONFLICT DO NOTHING;
