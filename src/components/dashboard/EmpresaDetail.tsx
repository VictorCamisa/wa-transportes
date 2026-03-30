import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, FileText, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ServicesTable from './ServicesTable';

interface Props {
  empresaId: string;
  empresaNome: string;
  onBack: () => void;
}

const EmpresaDetail = ({ empresaId, empresaNome, onBack }: Props) => {
  const [activeTab, setActiveTab] = useState('resumo');

  // Fetch services for this company
  const { data: servicos = [], isLoading: loadingServicos } = useQuery({
    queryKey: ['empresa-servicos', empresaNome],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('servicos' as any)
        .select('*')
        .eq('empresa', empresaNome)
        .order('data_servico', { ascending: false })) as any;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch costs for this company (by descricao matching)
  const { data: custos = [], isLoading: loadingCustos } = useQuery({
    queryKey: ['empresa-custos', empresaNome],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('custos' as any)
        .select('*')
        .ilike('descricao', `%${empresaNome}%`)
        .order('data_vencimento', { ascending: false })) as any;
      if (error) throw error;
      return data || [];
    },
  });

  const totalReceita = servicos.reduce((sum: number, s: any) => sum + (s.valor_numerico || 0), 0);
  const totalCustos = custos.reduce((sum: number, c: any) => sum + (c.valor_numerico || 0), 0);
  const totalServicos = servicos.length;
  const lucro = totalReceita - totalCustos;

  // Group services by month for fechamento
  const servicesByMonth: Record<string, any[]> = {};
  servicos.forEach((s: any) => {
    const month = s.data_servico?.substring(0, 7); // YYYY-MM
    if (!servicesByMonth[month]) servicesByMonth[month] = [];
    servicesByMonth[month].push(s);
  });

  const sortedMonths = Object.keys(servicesByMonth).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{empresaNome}</h2>
            <p className="text-sm text-slate-500">{totalServicos} serviços registrados</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Serviços</p>
                <p className="text-xl font-bold text-slate-800">{totalServicos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Receita Total</p>
                <p className="text-xl font-bold text-green-700">
                  {totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Custos Associados</p>
                <p className="text-xl font-bold text-red-700">
                  {totalCustos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Resultado</p>
                <p className={`text-xl font-bold ${lucro >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="fechamento">Fechamento</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        {/* Resumo */}
        <TabsContent value="resumo" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimos Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingServicos ? (
                <p className="text-sm text-slate-400">Carregando...</p>
              ) : servicos.length === 0 ? (
                <p className="text-sm text-slate-400">Nenhum serviço registrado para esta empresa.</p>
              ) : (
                <div className="space-y-2">
                  {servicos.slice(0, 10).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{s.servico || 'Serviço'}</p>
                        <p className="text-xs text-slate-400">
                          {s.data_servico ? new Date(s.data_servico + 'T12:00:00').toLocaleDateString('pt-BR') : '-'} · {s.cidade || '-'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {(s.valor_numerico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Serviços (full table) */}
        <TabsContent value="servicos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Todos os Serviços — {empresaNome}</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingServicos ? (
                <p className="text-sm text-slate-400">Carregando...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-slate-500">
                        <th className="pb-2 pr-4">Data</th>
                        <th className="pb-2 pr-4">Serviço</th>
                        <th className="pb-2 pr-4">Cidade</th>
                        <th className="pb-2 pr-4">Veículo</th>
                        <th className="pb-2 pr-4">Motorista</th>
                        <th className="pb-2 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicos.map((s: any) => (
                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-2 pr-4 whitespace-nowrap">
                            {s.data_servico ? new Date(s.data_servico + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="py-2 pr-4">{s.servico || '-'}</td>
                          <td className="py-2 pr-4">{s.cidade || '-'}</td>
                          <td className="py-2 pr-4">{s.veiculo || '-'}</td>
                          <td className="py-2 pr-4">{s.motorista || '-'}</td>
                          <td className="py-2 text-right font-medium">
                            {(s.valor_numerico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {servicos.length === 0 && (
                    <p className="text-center py-8 text-slate-400">Nenhum serviço encontrado.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fechamento by month */}
        <TabsContent value="fechamento" className="mt-4 space-y-4">
          {sortedMonths.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-400">
                Nenhum fechamento disponível.
              </CardContent>
            </Card>
          ) : (
            sortedMonths.map((month) => {
              const items = servicesByMonth[month];
              const monthTotal = items.reduce((s: number, i: any) => s + (i.valor_numerico || 0), 0);
              const [y, m] = month.split('-');
              const monthLabel = format(new Date(parseInt(y), parseInt(m) - 1), 'MMMM yyyy', { locale: ptBR });
              return (
                <Card key={month}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">{monthLabel}</CardTitle>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{items.length} serviço(s)</p>
                        <p className="text-sm font-bold text-green-700">
                          {monthTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {items.map((s: any) => (
                        <div key={s.id} className="flex items-center justify-between py-1.5 text-sm border-b border-slate-50 last:border-0">
                          <div className="flex gap-4">
                            <span className="text-slate-400 w-20">
                              {s.data_servico ? new Date(s.data_servico + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}
                            </span>
                            <span className="text-slate-700">{s.servico || 'Serviço'}</span>
                          </div>
                          <span className="font-medium">
                            {(s.valor_numerico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financeiro" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receitas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedMonths.length === 0 ? (
                  <p className="text-sm text-slate-400">Sem dados.</p>
                ) : (
                  <div className="space-y-2">
                    {sortedMonths.map((month) => {
                      const items = servicesByMonth[month];
                      const total = items.reduce((s: number, i: any) => s + (i.valor_numerico || 0), 0);
                      const [y, m] = month.split('-');
                      const label = format(new Date(parseInt(y), parseInt(m) - 1), 'MMM/yy', { locale: ptBR });
                      const maxVal = Math.max(...sortedMonths.map(mo =>
                        servicesByMonth[mo].reduce((s: number, i: any) => s + (i.valor_numerico || 0), 0)
                      ));
                      const pct = maxVal > 0 ? (total / maxVal) * 100 : 0;
                      return (
                        <div key={month}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 capitalize">{label}</span>
                            <span className="font-medium">
                              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custos Associados</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingCustos ? (
                  <p className="text-sm text-slate-400">Carregando...</p>
                ) : custos.length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhum custo associado a esta empresa.</p>
                ) : (
                  <div className="space-y-2">
                    {custos.slice(0, 15).map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between py-1.5 text-sm border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-slate-700">{c.descricao}</p>
                          <p className="text-xs text-slate-400">{c.tipo} · {c.forma_pagamento}</p>
                        </div>
                        <span className="font-medium text-red-600">
                          {(c.valor_numerico || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmpresaDetail;
