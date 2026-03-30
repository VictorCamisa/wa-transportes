import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface KPIData {
  custos_fixos: number;
  custos_variaveis: number;
}

interface CostChartProps {
  data: KPIData | null;
  loading: boolean;
}

const CostChart = ({ data, loading }: CostChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Custos</CardTitle>
          <CardDescription>Proporção entre custos fixos e variáveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || (data.custos_fixos === 0 && data.custos_variaveis === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Custos</CardTitle>
          <CardDescription>Proporção entre custos fixos e variáveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Nenhum dado encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Custos Fixos',
      value: data.custos_fixos,
      color: '#f59e0b'
    },
    {
      name: 'Custos Variáveis',
      value: data.custos_variaveis,
      color: '#3b82f6'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Custos</CardTitle>
        <CardDescription>Proporção entre custos fixos e variáveis em maio</CardDescription>
      </CardHeader>
      <CardContent>
        {showValues ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelStyle={{ color: '#000' }}
              />
              <Legend 
                formatter={(value, entry: any) => `${value}: ${formatCurrency(entry.payload.value)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500 text-lg">Valores ocultos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostChart;
