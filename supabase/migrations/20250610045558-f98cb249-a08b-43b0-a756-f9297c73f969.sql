
-- Adicionar coluna data na tabela servicos_maio
ALTER TABLE public.servicos_maio 
ADD COLUMN data_servico DATE;

-- Atualizar todos os registros existentes para maio de 2024
UPDATE public.servicos_maio 
SET data_servico = '2024-05-01'
WHERE data_servico IS NULL;

-- Tornar a coluna obrigatória após atualizar os dados existentes
ALTER TABLE public.servicos_maio 
ALTER COLUMN data_servico SET NOT NULL;

-- Definir valor padrão para novos registros
ALTER TABLE public.servicos_maio 
ALTER COLUMN data_servico SET DEFAULT CURRENT_DATE;
