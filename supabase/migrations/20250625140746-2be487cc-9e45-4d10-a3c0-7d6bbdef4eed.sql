
-- Alterar todas as datas do mês 5 (maio) para o mês 1 (janeiro) mantendo o mesmo dia e ano
UPDATE public.servicos 
SET data_servico = CONCAT(EXTRACT(YEAR FROM data_servico), '-01-', EXTRACT(DAY FROM data_servico))::date
WHERE EXTRACT(MONTH FROM data_servico) = 5;
