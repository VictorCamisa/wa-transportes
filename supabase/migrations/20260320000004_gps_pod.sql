-- Migration: Create GPS tracking and POD (Proof of Delivery) tables for Phase 2

-- GPS Positions (high-write, append-only, real-time tracking)
CREATE TABLE public.posicoes_gps (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    motorista_id uuid REFERENCES public.motoristas(id) ON DELETE CASCADE,
    veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE SET NULL,
    ordem_servico_id uuid REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
    latitude numeric(10,7) NOT NULL,
    longitude numeric(10,7) NOT NULL,
    velocidade numeric(5,1),
    precisao numeric(6,1),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_posicoes_gps_motorista_time
    ON public.posicoes_gps (motorista_id, created_at DESC);

CREATE INDEX idx_posicoes_gps_os
    ON public.posicoes_gps (ordem_servico_id, created_at DESC);

ALTER TABLE public.posicoes_gps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posicoes_gps REPLICA IDENTITY FULL;

CREATE POLICY "Authenticated users can view posicoes_gps"
    ON public.posicoes_gps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert posicoes_gps"
    ON public.posicoes_gps FOR INSERT TO authenticated WITH CHECK (true);

-- Comprovantes de Entrega (Proof of Delivery - POD)
CREATE TABLE public.comprovantes_entrega (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ordem_servico_id uuid REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
    foto_url text,
    assinatura_url text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    nome_recebedor text,
    observacoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.comprovantes_entrega ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comprovantes_entrega"
    ON public.comprovantes_entrega FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert comprovantes_entrega"
    ON public.comprovantes_entrega FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update comprovantes_entrega"
    ON public.comprovantes_entrega FOR UPDATE TO authenticated USING (true);

-- Portal de Clientes (Client Portal Access)
CREATE TABLE public.clientes_portal (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa text NOT NULL UNIQUE,
    token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.clientes_portal ENABLE ROW LEVEL SECURITY;

-- Public access by token (no auth required for portal)
CREATE POLICY "Public can read active portal entries"
    ON public.clientes_portal FOR SELECT
    USING (ativo = true);

CREATE POLICY "Admins can manage clientes_portal"
    ON public.clientes_portal FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Enable Supabase Realtime for GPS and OS tables
ALTER TABLE public.ordens_servico REPLICA IDENTITY FULL;
