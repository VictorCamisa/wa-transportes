
-- Corrigir a data do último serviço de 11/05/2025 para 11/01/2025
UPDATE public.servicos 
SET data_servico = '2025-01-11'
WHERE data_servico = '2025-05-11' 
AND ct_e = '9955' 
AND nf = '71768/69/70/71/72';
