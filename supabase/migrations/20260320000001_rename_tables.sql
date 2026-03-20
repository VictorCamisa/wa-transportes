-- Migration: Create servicos and custos tables (renamed from servicos_maio/custos_maio)
-- Strategy: Create new tables + copy data. Keep old tables for backward compat until frontend is updated.

-- Create servicos table (renamed from servicos_maio)
CREATE TABLE public.servicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    empresa text NOT NULL,
    solicitante text,
    servico text,
    cidade text,
    valor_texto text,
    valor_numerico numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    data_servico date DEFAULT CURRENT_DATE NOT NULL,
    ct_e text,
    nf text,
    tipo_veiculo text,
    veiculo text,
    motorista text,
    frete text,
    seguro text
);

-- Copy all existing data
INSERT INTO public.servicos
SELECT id, empresa, solicitante, servico, cidade, valor_texto, valor_numerico, created_at, data_servico,
       NULL as ct_e, NULL as nf, NULL as tipo_veiculo, NULL as veiculo, NULL as motorista, NULL as frete, NULL as seguro
FROM public.servicos_maio;

-- Try to update with extended columns if they exist (from other migrations)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='servicos_maio' AND column_name='ct_e') THEN
        UPDATE public.servicos s
        SET ct_e = sm.ct_e, nf = sm.nf, tipo_veiculo = sm.tipo_veiculo,
            veiculo = sm.veiculo, motorista = sm.motorista, frete = sm.frete, seguro = sm.seguro
        FROM public.servicos_maio sm WHERE s.id = sm.id;
    END IF;
END $$;

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view servicos"
    ON public.servicos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert servicos"
    ON public.servicos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update servicos"
    ON public.servicos FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete servicos"
    ON public.servicos FOR DELETE TO authenticated USING (true);

-- Create custos table (renamed from custos_maio)
CREATE TABLE public.custos (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    descricao text NOT NULL,
    data_vencimento date NOT NULL,
    valor_texto text NOT NULL,
    forma_pagamento text NOT NULL,
    tipo text NOT NULL,
    valor_numerico numeric(10,2) NOT NULL,
    categoria text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Copy existing data
INSERT INTO public.custos (id, descricao, data_vencimento, valor_texto, forma_pagamento, tipo, valor_numerico, created_at)
SELECT id, descricao, data_vencimento, valor_texto, forma_pagamento, tipo, valor_numerico, created_at
FROM public.custos_maio;

-- Validation trigger on new table
CREATE TRIGGER validate_custos_tipo
    BEFORE INSERT OR UPDATE ON public.custos
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_custos_tipo();

ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view custos"
    ON public.custos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert custos"
    ON public.custos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update custos"
    ON public.custos FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete custos"
    ON public.custos FOR DELETE TO authenticated USING (true);
