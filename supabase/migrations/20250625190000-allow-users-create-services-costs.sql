
-- Permitir que usuários autenticados criem serviços
CREATE POLICY "Authenticated users can insert services" 
  ON public.servicos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Permitir que usuários autenticados atualizem serviços
CREATE POLICY "Authenticated users can update services" 
  ON public.servicos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Permitir que usuários autenticados deletem serviços
CREATE POLICY "Authenticated users can delete services" 
  ON public.servicos 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Permitir que usuários autenticados criem custos
CREATE POLICY "Authenticated users can insert costs" 
  ON public.custos_maio 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Permitir que usuários autenticados atualizem custos
CREATE POLICY "Authenticated users can update costs" 
  ON public.custos_maio 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Permitir que usuários autenticados deletem custos
CREATE POLICY "Authenticated users can delete costs" 
  ON public.custos_maio 
  FOR DELETE 
  TO authenticated 
  USING (true);
