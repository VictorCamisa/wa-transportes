import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface RecentServicesListProps {
  showValues: boolean;
}

const RecentServicesList = ({ showValues }: RecentServicesListProps) => {
  const { data: recentServices, isLoading } = useQuery({
    queryKey: ['recent-services'],
    queryFn: async () => {
      console.log('RecentServicesList: Buscando últimos 10 serviços...');
      const { data, error } = await (supabase
        .from('servicos_maio' as any)
        .select('*')
        .order('data_servico', { ascending: false })
        .limit(10) as any);
      
      if (error) {
        console.error('RecentServicesList: Erro ao buscar serviços:', error);
        throw error;
      }
      
      console.log(`RecentServicesList: Encontrados ${data?.length || 0} serviços recentes`);
      return data;
    }
  });

  // Buscar contagem total real
  const { data: totalCount } = useQuery({
    queryKey: ['total-services-count-real'],
    queryFn: async () => {
      console.log('RecentServicesList: Buscando contagem total REAL...');
      const { count, error } = await (supabase
        .from('servicos_maio' as any)
        .select('*', { count: 'exact', head: true }) as any);
      
      if (error) {
        console.error('RecentServicesList: Erro ao buscar contagem:', error);
        throw error;
      }
      
      console.log(`RecentServicesList: TOTAL REAL de serviços no banco: ${count}`);
      return count;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Últimos Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Últimos 10 Serviços
          {totalCount && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Total no banco: {totalCount.toLocaleString('pt-BR')} serviços)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentServices && recentServices.length > 0 ? (
          <ScrollArea className="h-[400px] sm:h-[500px]">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Data</TableHead>
                    <TableHead className="text-xs sm:text-sm">Empresa</TableHead>
                    <TableHead className="text-xs sm:text-sm">Serviço</TableHead>
                    <TableHead className="text-xs sm:text-sm">Cidade</TableHead>
                    <TableHead className="text-xs sm:text-sm">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="text-xs sm:text-sm">
                        {formatDateForDisplay(service.data_servico)}
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm">{service.empresa}</TableCell>
                      <TableCell className="text-xs sm:text-sm max-w-[150px] truncate" title={service.servico}>
                        {service.servico || '-'}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{service.cidade || '-'}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">
                        {showValues ? service.valor_texto : '***'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-3 p-4">
              {recentServices.map((service) => (
                <div key={service.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{service.empresa}</h4>
                    <span className="text-xs text-green-600 font-medium">
                      {showValues ? service.valor_texto : '***'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Data: {formatDateForDisplay(service.data_servico)}
                  </p>
                  {service.servico && (
                    <p className="text-xs text-gray-600">Serviço: {service.servico}</p>
                  )}
                  {service.cidade && (
                    <p className="text-xs text-gray-600">Cidade: {service.cidade}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-center p-8 text-sm">Nenhum serviço encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentServicesList;
