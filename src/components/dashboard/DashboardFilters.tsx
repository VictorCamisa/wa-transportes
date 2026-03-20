
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

interface DashboardFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    empresa: string;
    tipoCusto: string;
    cidade: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const DashboardFilters = ({ filters, onFiltersChange, onClearFilters }: DashboardFiltersProps) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">Filtros</CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-xs sm:text-sm">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-xs sm:text-sm">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-xs sm:text-sm">Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nome da empresa"
              value={filters.empresa}
              onChange={(e) => handleFilterChange('empresa', e.target.value)}
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipoCusto" className="text-xs sm:text-sm">Tipo de Custo</Label>
            <Select value={filters.tipoCusto} onValueChange={(value) => handleFilterChange('tipoCusto', value)}>
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Fixo">Fixo</SelectItem>
                <SelectItem value="Variável">Variável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-xs sm:text-sm">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Nome da cidade"
              value={filters.cidade}
              onChange={(e) => handleFilterChange('cidade', e.target.value)}
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
