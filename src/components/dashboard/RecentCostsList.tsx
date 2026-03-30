import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateForDisplay } from '@/utils/dateUtils';

const RecentCostsList = () => {
  const { data: recentCosts, isLoading } = useQuery({
    queryKey: ['recent-costs'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('custos' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10) as any);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Últimos 10 Custos</CardTitle>
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
        <CardTitle className="text-lg sm:text-xl">Últimos 10 Custos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentCosts && recentCosts.length > 0 ? (
          <ScrollArea className="h-[400px] sm:h-[500px]">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Descrição</TableHead>
                    <TableHead className="text-xs sm:text-sm">Valor</TableHead>
                    <TableHead className="text-xs sm:text-sm">Tipo</TableHead>
                    <TableHead className="text-xs sm:text-sm">Forma de Pagamento</TableHead>
                    <TableHead className="text-xs sm:text-sm">Data de Vencimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCosts.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{cost.descricao}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {cost.valor_texto}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cost.tipo === 'Fixo' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {cost.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{cost.forma_pagamento}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {formatDateForDisplay(cost.data_vencimento)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-3 p-4">
              {recentCosts.map((cost) => (
                <div key={cost.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{cost.descricao}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cost.tipo === 'Fixo' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {cost.tipo}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-green-600">
                    Valor: {showValues ? cost.valor_texto : '***'}
                  </p>
                  <p className="text-xs text-gray-600">Pagamento: {cost.forma_pagamento}</p>
                  {cost.data_vencimento && (
                    <p className="text-xs text-gray-600">
                      Vencimento: {formatDateForDisplay(cost.data_vencimento)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-center p-8 text-sm">Nenhum custo encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCostsList;
