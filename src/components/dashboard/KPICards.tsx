import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Target, TrendingDown, Calculator, PiggyBank, CreditCard } from 'lucide-react';

interface KPIData {
  receita_total: number;
  total_servicos: number;
  ticket_medio: number;
  principal_cliente: string;
  principal_cidade: string;
  total_custos: number;
  lucro_bruto: number;
  margem_lucro: number;
  custos_fixos: number;
  custos_variaveis: number;
}

interface KPICardsProps {
  data: KPIData | null;
  loading: boolean;
}

const KPICards = ({ data, loading }: KPICardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-3 bg-muted rounded w-20 mb-3" />
              <div className="h-7 bg-muted rounded w-28 mb-1" />
              <div className="h-2.5 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const kpis = [
    { title: 'Receita Total', value: fmt(data?.receita_total || 0), icon: DollarSign, positive: true },
    { title: 'Total de Custos', value: fmt(data?.total_custos || 0), icon: TrendingDown, positive: false },
    { title: 'Lucro Bruto', value: fmt(data?.lucro_bruto || 0), icon: TrendingUp, positive: (data?.lucro_bruto || 0) >= 0 },
    { title: 'Margem de Lucro', value: `${(data?.margem_lucro || 0).toFixed(1)}%`, icon: Target, positive: (data?.margem_lucro || 0) >= 0 },
    { title: 'Total de Serviços', value: (data?.total_servicos || 0).toString(), icon: Users, positive: true },
    { title: 'Ticket Médio', value: fmt(data?.ticket_medio || 0), icon: Calculator, positive: true },
    { title: 'Custos Fixos', value: fmt(data?.custos_fixos || 0), icon: PiggyBank, positive: false },
    { title: 'Custos Variáveis', value: fmt(data?.custos_variaveis || 0), icon: CreditCard, positive: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <Card key={i} className="border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{kpi.title}</span>
                <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
              </div>
              <p className={`text-lg font-bold tracking-tight ${kpi.positive ? 'text-foreground' : 'text-destructive'}`}>
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
