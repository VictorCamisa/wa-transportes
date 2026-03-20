import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByClientData {
  empresa: string;
  receita: number;
}

interface RevenueChartProps {
  data: RevenueByClientData[] | null;
  loading: boolean;
  showValues: boolean;
}

const RevenueChart = ({ data, loading, showValues }: RevenueChartProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Receita por Cliente</CardTitle>
          <CardDescription>Top 10 clientes por faturamento em maio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Receita por Cliente</CardTitle>
          <CardDescription>Top 10 clientes por faturamento em maio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Nenhum dado encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    if (!showValues) return '***';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Cliente</CardTitle>
        <CardDescription>Top 10 clientes por faturamento em maio</CardDescription>
      </CardHeader>
      <CardContent>
        {showValues ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="empresa" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Receita']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="receita" fill="#3b82f6" />
            </BarChart>
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

export default RevenueChart;
