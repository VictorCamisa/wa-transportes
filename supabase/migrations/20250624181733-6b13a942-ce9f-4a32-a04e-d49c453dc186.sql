
-- Criar tabela de serviços
CREATE TABLE public.servicos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_servico date NOT NULL,
  ct_e text,
  nf text,
  empresa text NOT NULL,
  solicitante text,
  servico text,
  cidade text,
  tipo_veiculo text,
  veiculo text,
  motorista text,
  valor_texto text NOT NULL,
  valor_numerico numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS) para garantir segurança
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- Criar política que permite acesso completo para usuários autenticados
CREATE POLICY "Usuários autenticados podem acessar serviços" 
  ON public.servicos 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Inserir todos os dados fornecidos
INSERT INTO public.servicos (data_servico, ct_e, nf, empresa, solicitante, servico, cidade, tipo_veiculo, veiculo, motorista, valor_texto, valor_numerico) VALUES
('2025-01-02', '', '', 'ACTA', 'VILMEI', 'ROTAS DE QUINTA', 'SJCAMPOS', 'MOTO', 'MOTO', 'FICO', 'R$ 295,00', 295.00),
('2025-01-02', '', '', 'HYDROSTEC', 'JOÃO', 'CHAVEIRO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-02', '9899', '966364', 'IFF', 'ANDRÉ LUIZ', 'COLETA: NIKKEYPAR / PO: 4701001903', 'SJCAMPOS', 'MOTO', 'ECM6A48', 'GILBERTO', 'R$ 150,00', 150.00),
('2025-01-02', '9900', '9738', 'MUBEA', 'ANDRÉ MOREIRA', 'COLETA: ECAL', 'SÃO PAULO', 'MOTO', 'MOTO', 'RAY', 'R$ 250,00', 250.00),
('2025-01-02', '9898', '71530/31/32/33/34', 'AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 176,07', 'VARZEA P.STA', 'VUC', 'ECM6A48', 'GILBERTO', 'R$ 1.826,07', 1826.07),
('2025-01-02', '', '', 'AUTOLIV', 'WILLIAM', 'CLÍNICA LIDA', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-02', '9897', '126204', 'GV', 'LUCAS', 'ENTREGA: FB LOCAÇÃO / 450+SEGURO: 857,50', 'GUARAREMA', 'CARRO', 'DSS3C00', 'TIAGO', 'R$ 1.307,50', 1307.50),
('2025-01-02', '9896', '14278', 'GV', 'LUCAS', 'COLETA: B. GODOY / 988+SEGURO: 300,00', 'SANTA BÁRBARA', 'CARRO', 'RFK1E19', 'DANIEL', 'R$ 1.288,00', 1288.00),
('2025-01-02', '9901', '76700', 'GV', 'FABIANA', 'COLETA: NEOLUBES', 'SJCAMPOS', '3/4', 'ODH6B66', 'DANIEL', 'R$ 950,00', 950.00),
('2025-01-03', '', '', 'ACTA', 'VILMEI', 'ROTAS DE SEXTA', 'SJCAMPOS', 'MOTO', 'MOTO', 'FICO', 'R$ 295,00', 295.00),
('2025-01-03', '9906', '68542', 'TAMPAS', 'IGOR', 'COLETA: KORETECH / 470+SEGURO: 10,06', 'BARUERI', 'CARRO', 'ECM6A48', 'GILBERTO', 'R$ 480,06', 480.06),
('2025-01-03', '9909', '1981855', 'RESINAS', 'BRUNA', 'COLETA: RADIAL / 230+SEGURO: 2,13', 'SÃO PAULO', 'MOTO', 'MOTO', 'IGOR', 'R$ 232,13', 232.13),
('2025-01-03', '', '', 'CAMPO LIMPO', 'RH', 'CHAVEIRO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-03', '', '', 'HYDROSTEC', 'GUSTAVO', 'CORREIO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-03', '9907', '71557/558/559/560', 'AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 188,89', 'VARZEA P.STA', 'VUC', 'ECM6A48', 'GILBERTO', 'R$ 1.838,89', 1838.89),
('2025-01-03', '9903', '166222/166224', 'GV', 'LUCAS', 'ENTREGA FRACIONADA: ALUGATEC / 295+seguro: 361,68', 'S B DO CAMPO', 'CARRO', 'DSS3C00', 'OXINHO', 'R$ 656,68', 656.68),
('2025-01-03', '9905', '147/152/153/154/155', 'LUGAB', 'JUNIOR', 'ENTREGA: GV / 600 JÁ COM SEGURO.', 'SP / PINDA', 'CARRO', 'DSS3C00', 'TIAGO', 'R$ 600,00', 600.00),
('2025-01-03', '9904', '209308', 'PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES / MANHÃ', 'GUARULHOS', 'CARRO', 'CARRO', 'CÉSAR', 'R$ 400,00', 400.00),
('2025-01-03', '9908', '209355', 'PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES / TARDE', 'GUARULHOS', 'CARRO', 'CARRO', 'CÉSAR', 'R$ 400,00', 400.00),
('2025-01-03', '9911', '7364', 'PLASCAR', 'MARCELO', 'COLETA: QUALIVED', 'JACAREÍ', 'MOTO', '', '', 'R$ 130,00', 130.00),
('2025-01-04', '9910', '71574/71575', 'AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 65,93', 'VARZEA P.STA', 'VUC', 'ECM6A48', 'GILBERTO', 'R$ 1.715,93', 1715.93),
('2025-01-06', '9912', '79000', 'RECICLAGEM', 'DOUGLAS', 'ENTREGA: ANSELMO / 1.250+SEGURO: 500,00', 'TAB DA SERRA', '3/4', 'ODH6B66', 'MICHEL', 'R$ 1.750,00', 1750.00),
('2025-01-06', '9913', '79001', 'RECICLAGEM', 'DOUGLAS', 'ENTREGA: JHM / 810+SEGURO: 100,00 - FOI DIA 07/01', 'SANTA BÁRBARA', 'CARRO', 'ECM6A48', 'GILBERTO', 'R$ 910,00', 910.00),
('2025-01-06', '9917', '32128', 'RECICLAGEM', 'IGOR', 'COLETA FRAC: HIDRÁS / 84+SEGURO: 8,36', 'SÃO PAULO', 'CARRO', 'DSS3C00', 'OXINHO', 'R$ 92,36', 92.36),
('2025-01-06', '9920', '19142', 'RECICLAGEM', 'BRUNA', 'COLETA: A TOP / 380+SEGURO: 38,29', 'SÃO PAULO', 'CARRO', 'DSS3C00', 'OXINHO', 'R$ 418,29', 418.29),
('2025-01-06', '9914', '24029', 'TAMPAS', 'DOUGLAS', 'ENTREGA/DESLOCAMENTO: NORMA / 850+SEGURO: 75,00', 'C L PAULISTA', '3/4', 'ODH6B66', 'MICHEL', 'R$ 925,00', 925.00),
('2025-01-06', '9916', '32129', 'TAMPAS', 'IGOR', 'COLETA FRAC: HIDRÁS / 84+SEGURO: 296,94', 'SÃO PAULO', 'CARRO', 'DSS3C00', 'OXINHO', 'R$ 380,94', 380.94),
('2025-01-06', '', '', 'CAMPO LIMPO', 'DOUGLAS', 'CHAVEIRO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-06', '', '', 'CAMPO LIMPO', 'GABRIELA', 'LOGO TIPOS', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-06', '', '', 'ANSELMO', 'PARTICULAR', 'ENTREGA: ANHANGUERA', 'ANHANGUERA', '3/4', 'ODH6B66', 'MICHEL', 'R$ 300,00', 300.00),
('2025-01-06', '', '', 'HYDROSTEC', 'JOÃO', 'VELLOSO - IDA E VOLTA / UNIVERSO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 45,00', 45.00),
('2025-01-06', '', '', 'MUBEA', 'REGINA', 'CORREIO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-06', '9915', '71580/81/82/83/84', 'AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 152,47', 'VARZEA P.STA', 'VUC', 'ECM6A48', 'GILBERTO', 'R$ 1.802,47', 1802.47),
('2025-01-06', '', '', 'AUTOLIV', 'WILLIAM', 'CLÍNICA LIDA', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-06', '', '', 'AUTOLIV', 'LUCIANA', 'CORREIO', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 15,00', 15.00),
('2025-01-06', '9921', '142959', 'PISANI', 'EDUARDO', 'ENTREGA: MEC-Q', 'TAUBATÉ', 'MOTO', 'MOTO', 'FICO', 'R$ 95,00', 95.00),
('2025-01-06', '9918', '209537', 'PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'CARRO', 'DSS3C00', 'OXINHO', 'R$ 400,00', 400.00);

-- Adicionar função para extrair valor numérico do campo valor_texto se necessário
CREATE OR REPLACE FUNCTION update_valor_numerico()
RETURNS trigger AS $$
BEGIN
  NEW.valor_numerico := public.extract_numeric_value(NEW.valor_texto);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar automaticamente o valor numérico
CREATE TRIGGER trigger_update_valor_numerico
  BEFORE INSERT OR UPDATE ON public.servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_valor_numerico();
