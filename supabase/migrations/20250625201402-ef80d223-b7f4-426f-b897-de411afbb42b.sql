
-- Adicionar coluna 'categoria' na tabela custos_maio
ALTER TABLE public.custos_maio 
ADD COLUMN categoria text;

-- Adicionar comentário na coluna para documentação
COMMENT ON COLUMN public.custos_maio.categoria IS 'Categoria do custo (WA ou CASA)';
