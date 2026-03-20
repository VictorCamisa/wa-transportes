
-- Verificar e ajustar as políticas RLS para custos_maio
-- Primeiro, vamos garantir que usuários autenticados possam inserir custos
DROP POLICY IF EXISTS "Authenticated users can insert costs" ON public.custos_maio;
DROP POLICY IF EXISTS "Admins can insert costs" ON public.custos_maio;

-- Criar política mais permissiva para inserção de custos
CREATE POLICY "Authenticated users can insert costs" 
  ON public.custos_maio 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Garantir que usuários autenticados possam atualizar custos
DROP POLICY IF EXISTS "Authenticated users can update costs" ON public.custos_maio;
DROP POLICY IF EXISTS "Admins can update costs" ON public.custos_maio;

CREATE POLICY "Authenticated users can update costs" 
  ON public.custos_maio 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Garantir que usuários autenticados possam deletar custos  
DROP POLICY IF EXISTS "Authenticated users can delete costs" ON public.custos_maio;
DROP POLICY IF EXISTS "Admins can delete costs" ON public.custos_maio;

CREATE POLICY "Authenticated users can delete costs" 
  ON public.custos_maio 
  FOR DELETE 
  TO authenticated 
  USING (true);
