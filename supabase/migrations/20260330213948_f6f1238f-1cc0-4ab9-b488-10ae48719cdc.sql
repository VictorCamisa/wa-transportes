
-- Create empresas table
CREATE TABLE public.empresas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL UNIQUE,
    ativa boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view empresas" ON public.empresas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert empresas" ON public.empresas
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can manage empresas" ON public.empresas
    FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed unique companies
INSERT INTO public.empresas (nome) VALUES
    ('AUTOLIV'),
    ('HYDROSTEC'),
    ('RECICLAGEM'),
    ('RESINAS'),
    ('TAMPAS'),
    ('IFF'),
    ('PINTAKIN'),
    ('MUBEA'),
    ('MUBEA/FIXO'),
    ('PLASCAR'),
    ('GV'),
    ('LUGAB'),
    ('ACTA'),
    ('CAMPO LIMPO'),
    ('RIB PRETO'),
    ('PELZER'),
    ('PISANI'),
    ('CIESP'),
    ('INPEV'),
    ('JULIANA'),
    ('CBF')
ON CONFLICT (nome) DO NOTHING;
