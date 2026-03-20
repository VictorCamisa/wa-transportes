-- Migration: Create domain tables for TMS Phase 1
-- Tables: motoristas, veiculos, ordens_servico, checklists, tabela_precos

-- Sequence for OS numbers
CREATE SEQUENCE IF NOT EXISTS public.os_numero_seq START 1;

-- Motoristas (Drivers)
CREATE TABLE public.motoristas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL,
    cnh text NOT NULL,
    categoria_cnh text NOT NULL,
    vencimento_cnh date NOT NULL,
    telefone text,
    status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'afastado')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (cnh)
);

ALTER TABLE public.motoristas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view motoristas"
    ON public.motoristas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert motoristas"
    ON public.motoristas FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update motoristas"
    ON public.motoristas FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete motoristas"
    ON public.motoristas FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_motoristas_updated_at
    BEFORE UPDATE ON public.motoristas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Veiculos (Vehicles)
CREATE TABLE public.veiculos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    placa text NOT NULL,
    tipo text NOT NULL,
    marca text,
    modelo text,
    ano integer,
    capacidade_kg numeric(10,2),
    seguro_vencimento date,
    crlv_vencimento date,
    status text NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_servico', 'manutencao', 'inativo')),
    motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (placa)
);

ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view veiculos"
    ON public.veiculos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert veiculos"
    ON public.veiculos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update veiculos"
    ON public.veiculos FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete veiculos"
    ON public.veiculos FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_veiculos_updated_at
    BEFORE UPDATE ON public.veiculos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate OS number
CREATE OR REPLACE FUNCTION public.generate_os_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numero_os := 'OS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                     LPAD(nextval('public.os_numero_seq')::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ordens de Servico (Work Orders)
CREATE TABLE public.ordens_servico (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_os text UNIQUE,
    servico_id uuid REFERENCES public.servicos(id) ON DELETE SET NULL,
    veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE SET NULL,
    motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'criada' CHECK (status IN (
        'criada', 'despachada', 'aceita', 'em_execucao', 'concluida', 'cancelada'
    )),
    empresa text,
    descricao text,
    cidade_origem text,
    cidade_destino text,
    valor_frete numeric(10,2),
    data_criacao timestamp with time zone DEFAULT now(),
    data_despacho timestamp with time zone,
    data_aceite timestamp with time zone,
    data_inicio_execucao timestamp with time zone,
    data_conclusao timestamp with time zone,
    criado_por uuid REFERENCES auth.users(id),
    despachado_por uuid REFERENCES auth.users(id),
    observacoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TRIGGER set_os_number
    BEFORE INSERT ON public.ordens_servico
    FOR EACH ROW WHEN (NEW.numero_os IS NULL)
    EXECUTE FUNCTION public.generate_os_number();

CREATE TRIGGER update_ordens_servico_updated_at
    BEFORE UPDATE ON public.ordens_servico
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ordens_servico"
    ON public.ordens_servico FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert ordens_servico"
    ON public.ordens_servico FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update ordens_servico"
    ON public.ordens_servico FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete ordens_servico"
    ON public.ordens_servico FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Checklists (Vehicle Inspection Forms - replaces console.log)
CREATE TABLE public.checklists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE SET NULL,
    motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
    placa text,
    nome_motorista text,
    data date NOT NULL DEFAULT CURRENT_DATE,
    km numeric(10,0),
    items jsonb NOT NULL DEFAULT '[]',
    observacoes text,
    criado_por uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view checklists"
    ON public.checklists FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert checklists"
    ON public.checklists FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update checklists"
    ON public.checklists FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete checklists"
    ON public.checklists FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Tabela de Precos (Pricing Table)
CREATE TABLE public.tabela_precos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa text,
    tipo_veiculo text NOT NULL,
    cidade_origem text NOT NULL,
    cidade_destino text NOT NULL,
    valor_base numeric(10,2) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (empresa, tipo_veiculo, cidade_origem, cidade_destino)
);

ALTER TABLE public.tabela_precos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view tabela_precos"
    ON public.tabela_precos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tabela_precos"
    ON public.tabela_precos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tabela_precos"
    ON public.tabela_precos FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete tabela_precos"
    ON public.tabela_precos FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_tabela_precos_updated_at
    BEFORE UPDATE ON public.tabela_precos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
