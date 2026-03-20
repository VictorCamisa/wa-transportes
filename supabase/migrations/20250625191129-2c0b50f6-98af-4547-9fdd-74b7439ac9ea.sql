
-- Adicionar coluna 'frete' na tabela servicos
ALTER TABLE public.servicos 
ADD COLUMN frete text;

-- Adicionar comentário na coluna para documentação
COMMENT ON COLUMN public.servicos.frete IS 'Informações sobre o frete do serviço';
