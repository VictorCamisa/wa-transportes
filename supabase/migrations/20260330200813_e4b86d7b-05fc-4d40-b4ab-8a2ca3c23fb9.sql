
-- 1. Create servicos table (the code expects this, not servicos_maio)
CREATE TABLE IF NOT EXISTS public.servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_servico date NOT NULL DEFAULT CURRENT_DATE,
  ct_e text,
  nf text,
  empresa text NOT NULL,
  solicitante text,
  servico text,
  cidade text,
  tipo_veiculo text,
  veiculo text,
  motorista text,
  valor_texto text,
  valor_numerico numeric,
  frete text,
  seguro text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view servicos" ON public.servicos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert servicos" ON public.servicos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update servicos" ON public.servicos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete servicos" ON public.servicos FOR DELETE TO authenticated USING (true);

-- Migrate existing data from servicos_maio
INSERT INTO public.servicos (data_servico, empresa, solicitante, servico, cidade, valor_texto, valor_numerico, created_at)
SELECT data_servico, empresa, solicitante, servico, cidade, valor_texto, valor_numerico, created_at
FROM public.servicos_maio;

-- 2. Create custos table
CREATE TABLE IF NOT EXISTS public.custos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao text NOT NULL,
  data_vencimento date NOT NULL,
  valor_texto text NOT NULL,
  valor_numerico numeric NOT NULL,
  forma_pagamento text NOT NULL,
  tipo text NOT NULL,
  categoria text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view custos" ON public.custos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert custos" ON public.custos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update custos" ON public.custos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete custos" ON public.custos FOR DELETE TO authenticated USING (true);

-- Migrate existing data from custos_maio
INSERT INTO public.custos (descricao, data_vencimento, valor_texto, valor_numerico, forma_pagamento, tipo, created_at)
SELECT descricao, data_vencimento, valor_texto, valor_numerico, forma_pagamento, tipo, created_at
FROM public.custos_maio;

-- 3. Create motoristas table
CREATE TABLE IF NOT EXISTS public.motoristas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnh text NOT NULL,
  categoria_cnh text NOT NULL,
  vencimento_cnh date NOT NULL,
  telefone text,
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.motoristas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view motoristas" ON public.motoristas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage motoristas" ON public.motoristas FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create veiculos table
CREATE TABLE IF NOT EXISTS public.veiculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placa text NOT NULL,
  tipo text NOT NULL,
  marca text,
  modelo text,
  ano integer,
  capacidade_kg numeric,
  seguro_vencimento date,
  crlv_vencimento date,
  status text NOT NULL DEFAULT 'disponivel',
  motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view veiculos" ON public.veiculos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage veiculos" ON public.veiculos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create ordens_servico table
CREATE TABLE IF NOT EXISTS public.ordens_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_os text UNIQUE DEFAULT ('OS-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 4)),
  empresa text,
  descricao text,
  cidade_origem text,
  cidade_destino text,
  valor_frete numeric,
  status text NOT NULL DEFAULT 'criada',
  motorista_id uuid REFERENCES public.motoristas(id) ON DELETE SET NULL,
  veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE SET NULL,
  criado_por uuid,
  data_criacao timestamptz DEFAULT now(),
  data_despacho timestamptz,
  data_aceite timestamptz,
  data_inicio_execucao timestamptz,
  data_conclusao timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ordens" ON public.ordens_servico FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert ordens" ON public.ordens_servico FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage ordens" ON public.ordens_servico FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create tabela_precos table
CREATE TABLE IF NOT EXISTS public.tabela_precos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa text,
  tipo_veiculo text NOT NULL,
  cidade_origem text NOT NULL,
  cidade_destino text NOT NULL,
  valor_base numeric NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tabela_precos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view precos" ON public.tabela_precos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage precos" ON public.tabela_precos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Create checklists table
CREATE TABLE IF NOT EXISTS public.checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placa text NOT NULL,
  nome_motorista text NOT NULL,
  data date NOT NULL DEFAULT CURRENT_DATE,
  km numeric,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  criado_por uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view checklists" ON public.checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert checklists" ON public.checklists FOR INSERT TO authenticated WITH CHECK (true);

-- 8. Create posicoes_gps table
CREATE TABLE IF NOT EXISTS public.posicoes_gps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motorista_id uuid REFERENCES public.motoristas(id) ON DELETE CASCADE,
  veiculo_id uuid REFERENCES public.veiculos(id) ON DELETE SET NULL,
  ordem_servico_id uuid REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  velocidade double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posicoes_gps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view positions" ON public.posicoes_gps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert positions" ON public.posicoes_gps FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for GPS tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.posicoes_gps;

-- 9. Insert initial company_settings row if none exists
INSERT INTO public.company_settings (name) 
SELECT 'W&A Transportes' 
WHERE NOT EXISTS (SELECT 1 FROM public.company_settings LIMIT 1);
