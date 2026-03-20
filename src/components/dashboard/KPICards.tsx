import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  showValues: boolean;
}

const KPICards = ({ data, loading, showValues }: KPICardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const kpis = [
    {
      title: "Receita Total",
      value: formatCurrency(data?.receita_total || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Receita total dos serviços"
    },
    {
      title: "Total de Custos",
      value: formatCurrency(data?.total_custos || 0),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Soma de todos os custos"
    },
    {
      title: "Lucro Bruto",
      value: formatCurrency(data?.lucro_bruto || 0),
      icon: TrendingUp,
      color: data && data.lucro_bruto >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data && data.lucro_bruto >= 0 ? "bg-green-50" : "bg-red-50",
      description: "Receita - Custos"
    },
    {
      title: "Margem de Lucro",
      value: formatPercentage(data?.margem_lucro || 0),
      icon: Target,
      color: data && data.margem_lucro >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data && data.margem_lucro >= 0 ? "bg-green-50" : "bg-red-50",
      description: "Percentual de lucratividade"
    },
    {
      title: "Total de Serviços",
      value: (data?.total_servicos || 0).toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Quantidade de serviços realizados"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(data?.ticket_medio || 0),
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Valor médio por serviço"
    },
    {
      title: "Custos Fixos",
      value: formatCurrency(data?.custos_fixos || 0),
      icon: PiggyBank,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Custos que não variam"
    },
    {
      title: "Custos Variáveis",
      value: formatCurrency(data?.custos_variaveis || 0),
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Custos que variam conforme produção"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color} mb-1`}>
                {showValues ? kpi.value : '***'}
              </div>
              <p className="text-xs text-gray-500">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
