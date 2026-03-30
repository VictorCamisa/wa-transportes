
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, X, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedDashboardFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    empresa: string;
    tipoCusto: string;
    cidade: string;
    mes: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const EnhancedDashboardFilters = ({ filters, onFiltersChange, onClearFilters }: EnhancedDashboardFiltersProps) => {
  // Buscar empresas únicas
  const { data: empresas } = useQuery({
    queryKey: ['empresas-list'],
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

  // Buscar cidades únicas
  const { data: cidades } = useQuery({
    queryKey: ['cidades-dashboard'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('servicos' as any)
        .select('cidade')
        .order('cidade') as any);
      
      if (error) throw error;
      
      const uniqueCidades = [...new Set((data as any[]).map((item: any) => item.cidade).filter(Boolean))];
      return uniqueCidades as string[];
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'all');

  const meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros Avançados do Dashboard
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters} 
              className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Todos os Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Filtro por Mês */}
          <div className="space-y-2">
            <Label htmlFor="mes" className="text-sm font-medium text-gray-700">Mês</Label>
            <Select value={filters.mes || 'all'} onValueChange={(value) => handleFilterChange('mes', value)}>
              <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="all">Todos os meses</SelectItem>
                {meses.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Inicial */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="h-10 bg-white border-gray-300 focus:border-blue-500"
            />
          </div>
          
          {/* Data Final */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="h-10 bg-white border-gray-300 focus:border-blue-500"
            />
          </div>
          
          {/* Empresa */}
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-sm font-medium text-gray-700">Empresa</Label>
            <Select value={filters.empresa || 'all'} onValueChange={(value) => handleFilterChange('empresa', value)}>
              <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50 max-h-48 overflow-y-auto">
                <SelectItem value="all">Todas as empresas</SelectItem>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa} value={empresa}>
                    {empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Cidade */}
          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">Cidade</Label>
            <Select value={filters.cidade || 'all'} onValueChange={(value) => handleFilterChange('cidade', value)}>
              <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50 max-h-48 overflow-y-auto">
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cidades?.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tipo de Custo */}
          <div className="space-y-2">
            <Label htmlFor="tipoCusto" className="text-sm font-medium text-gray-700">Tipo de Custo</Label>
            <Select value={filters.tipoCusto || 'all'} onValueChange={(value) => handleFilterChange('tipoCusto', value)}>
              <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Tipo de custo" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Fixo">Custos Fixos</SelectItem>
                <SelectItem value="Variável">Custos Variáveis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              📊 Filtros ativos: {Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all').length} filtro(s) aplicado(s)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardFilters;
