
-- Enable Row Level Security on custos_maio table
ALTER TABLE public.custos_maio ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on servicos_maio table  
ALTER TABLE public.servicos_maio ENABLE ROW LEVEL SECURITY;

-- Create policies for custos_maio table
-- Allow authenticated users to view all costs (basic access)
CREATE POLICY "Authenticated users can view costs" 
  ON public.custos_maio 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow admins to insert costs
CREATE POLICY "Admins can insert costs" 
  ON public.custos_maio 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

-- Allow admins to update costs
CREATE POLICY "Admins can update costs" 
  ON public.custos_maio 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin());

-- Allow admins to delete costs
CREATE POLICY "Admins can delete costs" 
  ON public.custos_maio 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- Create policies for servicos_maio table
-- Allow authenticated users to view all services (basic access)
CREATE POLICY "Authenticated users can view services" 
  ON public.servicos_maio 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow admins to insert services
CREATE POLICY "Admins can insert services" 
  ON public.servicos_maio 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

-- Allow admins to update services
CREATE POLICY "Admins can update services" 
  ON public.servicos_maio 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin());

-- Allow admins to delete services
CREATE POLICY "Admins can delete services" 
  ON public.servicos_maio 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());
