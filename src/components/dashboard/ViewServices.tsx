
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import ServicesTable from './ServicesTable';
import ServiceForm from './ServiceForm';

const fetchAllServicesWithFilters = async (searchTerm: string, selectedEmpresa: string, selectedMes: string) => {
  let allServices: any[] = [];
  let hasMore = true;
  let offset = 0;
  const pageSize = 1000;

  console.log('ViewServices: Iniciando busca de TODOS os serviços com filtros...');

  while (hasMore) {
    let query = (supabase
      .from('servicos' as any)
      .select('*')
      .order('data_servico', { ascending: false })
      .range(offset, offset + pageSize - 1)) as any;

    if (searchTerm) {
      query = query.or(`empresa.ilike.%${searchTerm}%,solicitante.ilike.%${searchTerm}%,servico.ilike.%${searchTerm}%,cidade.ilike.%${searchTerm}%`);
    }

    if (selectedEmpresa) {
      query = query.eq('empresa', selectedEmpresa);
    }

    if (selectedMes) {
      const year = new Date().getFullYear();
      const startDate = `${year}-${selectedMes.padStart(2, '0')}-01`;
      const endDate = `${selectedMes === '2' ? year : year}-${selectedMes.padStart(2, '0')}-${selectedMes === '2' ? '28' : '31'}`;
      query = query.gte('data_servico', startDate).lte('data_servico', endDate);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('ViewServices: Erro ao buscar serviços:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allServices = [...allServices, ...data];
      console.log(`ViewServices: Carregados ${data.length} serviços (offset: ${offset}). Total acumulado: ${allServices.length}`);
      
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        offset += pageSize;
      }
    } else {
      hasMore = false;
    }
  }

  console.log(`ViewServices: BUSCA COMPLETA! Total de serviços carregados: ${allServices.length}`);
  return allServices;
};

const ViewServices = () => {
  const { profile } = useAuth();
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedMes, setSelectedMes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Buscar todos os serviços sem limite
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services', searchTerm, selectedEmpresa, selectedMes],
    queryFn: async () => {
      console.log('ViewServices: Buscando serviços com filtros:', { searchTerm, selectedEmpresa, selectedMes });
      return await fetchAllServicesWithFilters(searchTerm, selectedEmpresa, selectedMes);
    }
  });

  // Buscar contagem total sem filtros
  const { data: totalCount } = useQuery({
    queryKey: ['services-total-count'],
    queryFn: async () => {
      const { count, error } = await (supabase
        .from('servicos' as any)
        .select('*', { count: 'exact', head: true }) as any);
      
      if (error) throw error;
      console.log(`ViewServices: Contagem total de serviços no banco: ${count}`);
      return count;
    }
  });

  const { data: empresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('servicos' as any)
        .select('empresa')
        .order('empresa') as any);
      
      if (error) throw error;
      
      const uniqueEmpresas = [...new Set((data as any[]).map((item: any) => item.empresa))];
      return uniqueEmpresas;
    }
  });

  const handleServiceAdded = () => {
    refetch();
    setDialogOpen(false);
  };

  // LÓGICA CORRIGIDA: Admin OU usuário com permissão pode criar serviços
  const canCreateService = hasPermission('services_create');

  console.log('ViewServices - canCreateService:', canCreateService, 'profile:', profile);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ver Serviços</h1>
          <p className="text-gray-600">
            {totalCount && `Total no banco: ${totalCount.toLocaleString('pt-BR')} serviços | `}
            Visualizando: {services?.length.toLocaleString('pt-BR') || 0} serviços
            {(searchTerm || selectedEmpresa || selectedMes) && ' (filtrados)'}
          </p>
        </div>
        {canCreateService && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ServiceForm onClose={handleServiceAdded} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por empresa, solicitante, serviço ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <select
                id="empresa"
                value={selectedEmpresa}
                onChange={(e) => setSelectedEmpresa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas as empresas</option>
                {empresas?.map((empresa) => (
                  <option key={empresa} value={empresa}>
                    {empresa}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="mes">Mês</Label>
              <select
                id="mes"
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos os meses</option>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
          </div>
          
          {(searchTerm || selectedEmpresa || selectedMes) && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEmpresa('');
                  setSelectedMes('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Serviços */}
      <ServicesTable data={services} loading={isLoading} onRefresh={refetch} />
    </div>
  );
};

export default ViewServices;
