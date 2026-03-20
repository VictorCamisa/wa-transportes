import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatDateForDisplay, formatDateForDatabase } from '@/utils/dateUtils';
import { calculateCostTotals, formatCurrency as formatCurrencyUtil } from '@/utils/costCalculations';
import { fixCostDataConsistency } from '@/utils/fixCostData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CostData {
  id: string;
  descricao: string;
  data_vencimento: string;
  valor_texto: string;
  valor_numerico: number;
  forma_pagamento: string;
  tipo: string;
  categoria?: string;
  created_at: string;
}

const CostFiltersAndPDF = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [costs, setCosts] = useState<CostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFixingData, setIsFixingData] = useState(false);

  // Função para corrigir inconsistências nos dados
  const handleFixData = async () => {
    setIsFixingData(true);
    try {
      const result = await fixCostDataConsistency();
      if (result.success) {
        toast({
          title: "Dados corrigidos!",
          description: result.message,
        });
        // Refazer a busca se houver dados filtrados
        if (hasSearched) {
          handleSearch();
        }
      } else {
        toast({
          title: "Erro na correção",
          description: "Ocorreu um erro ao corrigir os dados.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao corrigir dados:', error);
      toast({
        title: "Erro na correção",
        description: "Ocorreu um erro inesperado ao corrigir os dados.",
        variant: "destructive"
      });
    } finally {
      setIsFixingData(false);
    }
  };

  const handleSearch = async () => {
    console.log('=== DEBUG CUSTOS FILTROS ===');
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('selectedCategoria:', selectedCategoria);
    
    if (!startDate || !endDate) {
      toast({
        title: "Filtros obrigatórios",
        description: "Por favor, preencha o período.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const formattedStartDate = formatDateForDatabase(startDate);
      const formattedEndDate = formatDateForDatabase(endDate);
      
      console.log('Data inicial formatada:', formattedStartDate);
      console.log('Data final formatada:', formattedEndDate);

      let query = (supabase
        .from('custos') as any)
        .select('*')
        .gte('data_vencimento', formattedStartDate)
        .lte('data_vencimento', formattedEndDate)
        .order('data_vencimento', { ascending: true });

      // Aplicar filtro de categoria se selecionado
      if (selectedCategoria && selectedCategoria !== 'ALL') {
        if (selectedCategoria === 'SEM_CATEGORIA') {
          query = query.is('categoria', null);
        } else {
          query = query.eq('categoria', selectedCategoria);
        }
      }

      const { data, error } = await query;

      console.log('Resultado da busca:', { data, error });
      console.log('Quantidade de registros:', data?.length || 0);

      if (error) throw error;

      setCosts(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Não foram encontrados custos para os filtros selecionados.",
        });
      } else {
        toast({
          title: "Busca concluída",
          description: `Encontrados ${data.length} custo(s).`,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar custos:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os custos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (costs.length === 0) {
      toast({
        title: "Nenhum dado",
        description: "Não há custos para exportar.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF('landscape');
    
    // Título
    doc.setFontSize(16);
    doc.text('Relatório de Custos', 14, 15);
    
    // Informações do relatório
    doc.setFontSize(10);
    doc.text(`Período: ${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}`, 14, 25);
    if (selectedCategoria && selectedCategoria !== 'ALL') {
      const categoriaLabel = selectedCategoria === 'SEM_CATEGORIA' ? 'Sem Categoria' : selectedCategoria;
      doc.text(`Categoria: ${categoriaLabel}`, 14, 30);
    } else {
      doc.text('Categoria: Todas', 14, 30);
    }
    doc.text(`Gerado em: ${formatDateForDisplay(new Date().toISOString().split('T')[0])}`, 14, 35);

    // Preparar dados para a tabela
    const tableData = costs.map(cost => [
      formatDateForDisplay(cost.data_vencimento),
      cost.descricao.length > 40 ? cost.descricao.substring(0, 40) + '...' : cost.descricao,
      cost.tipo,
      cost.categoria || 'Sem categoria',
      cost.forma_pagamento,
      cost.valor_texto
    ]);

    // Calcular totais usando função utilitária que garante valores corretos
    const { total, totalFixo, totalVariavel } = calculateCostTotals(costs);

    // Gerar tabela
    autoTable(doc, {
      head: [['Data Vencimento', 'Descrição', 'Tipo', 'Categoria', 'Forma Pagamento', 'Valor']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [239, 68, 68] }, // Cor vermelha para custos
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 60 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25, halign: 'right' }
      }
    });

    // Adicionar totais
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total Geral: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 10);
    doc.text(`Total Fixo: R$ ${totalFixo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 20);
    doc.text(`Total Variável: R$ ${totalVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 30);
    doc.text(`Quantidade de custos: ${costs.length}`, 14, finalY + 40);

    // Salvar PDF
    const categoriaFileName = selectedCategoria && selectedCategoria !== 'ALL' ? `_${selectedCategoria.replace(/\s+/g, '_')}` : '_todas_categorias';
    const fileName = `custos${categoriaFileName}_${startDate}_${endDate}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF gerado!",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  // Usar função utilitária para cálculos corretos
  const { total: totalValue, totalFixo, totalVariavel } = calculateCostTotals(costs);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Custos</span>
          </CardTitle>
          <CardDescription>
            Selecione o período e categoria para filtrar e gerar relatório em PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria (Opcional)</Label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as categorias</SelectItem>
                  <SelectItem value="WA">WA (Empresa)</SelectItem>
                  <SelectItem value="CASA">CASA (Pessoal)</SelectItem>
                  <SelectItem value="SEM_CATEGORIA">Sem categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSearch} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            
            <Button 
              onClick={handleFixData} 
              disabled={isFixingData} 
              variant="outline" 
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFixingData ? 'animate-spin' : ''}`} />
              {isFixingData ? 'Corrigindo...' : 'Corrigir Dados'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>
                  {costs.length} custo(s) encontrado(s) • {formatCurrencyUtil(totalValue)}
                  {costs.length > 0 && (
                    <span className="block text-sm mt-1">
                      Fixos: {formatCurrencyUtil(totalFixo)} • Variáveis: {formatCurrencyUtil(totalVariavel)}
                    </span>
                  )}
                </CardDescription>
              </div>
              {costs.length > 0 && (
                <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : costs.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Nenhum custo encontrado para os filtros selecionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Data Vencimento</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Descrição</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Categoria</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Forma Pagamento</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map((cost) => (
                      <tr key={cost.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {formatDateForDisplay(cost.data_vencimento)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 max-w-xs truncate" title={cost.descricao}>
                          {cost.descricao}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            cost.tipo === 'Fixo' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {cost.tipo}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {cost.categoria ? (
                            <span className={`px-2 py-1 rounded text-xs ${
                              cost.categoria === 'WA' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {cost.categoria}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{cost.forma_pagamento}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                          {cost.valor_texto}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-red-100 font-bold">
                      <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">
                        Total Geral:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrencyUtil(totalValue)}
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right text-sm">
                        Total Fixos:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {formatCurrencyUtil(totalFixo)}
                      </td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right text-sm">
                        Total Variáveis:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {formatCurrencyUtil(totalVariavel)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostFiltersAndPDF;