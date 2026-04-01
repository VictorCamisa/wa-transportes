
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    queryKey: ['empresas-names-filter'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('empresas' as any)
        .select('nome')
        .eq('ativa', true)
        .order('nome') as any);
      
      if (error) throw error;
      return (data as any[]).map((item: any) => item.nome) as string[];
    }
  });

  const handleServiceAdded = () => {
    refetch();
    setDialogOpen(false);
  };

  // LÓGICA CORRIGIDA: Admin OU usuário com permissão pode criar serviços
  const canCreateService = hasPermission('services_create');

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Serviços</h1>
          <p className="text-sm text-slate-500">
            {totalCount ? `${totalCount.toLocaleString('pt-BR')} serviços no total` : ''}
            {(searchTerm || selectedEmpresa || selectedMes) && ` · ${(services || []).length} filtrados`}
          </p>
        </div>
        {canCreateService && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <ServiceForm onClose={handleServiceAdded} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-xs text-slate-500 mb-1 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Empresa, solicitante, cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Empresa</Label>
              <Select value={selectedEmpresa || '__all__'} onValueChange={(v) => setSelectedEmpresa(v === '__all__' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as empresas</SelectItem>
                  {(empresas || []).map((empresa) => (
                    <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Mês</Label>
              <Select value={selectedMes || '__all__'} onValueChange={(v) => setSelectedMes(v === '__all__' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos os meses</SelectItem>
                  {['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((m, i) => (
                    <SelectItem key={i+1} value={String(i+1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || selectedEmpresa || selectedMes) && (
            <div className="mt-3">
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedEmpresa(''); setSelectedMes(''); }}>
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
