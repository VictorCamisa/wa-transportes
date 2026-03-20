import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatDateForDisplay, formatDateForDatabase } from '@/utils/dateUtils';
import { parseCurrencyToNumber } from '@/utils/costCalculations';
import { fixServiceDataConsistency } from '@/utils/fixServiceData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ServiceData {
  id: string;
  data_servico: string;
  ct_e: string;
  nf: string;
  empresa: string;
  solicitante: string;
  servico: string;
  cidade: string;
  tipo_veiculo: string;
  veiculo: string;
  motorista: string;
  valor_texto: string;
  valor_numerico: number;
  frete: string;
  seguro: string;
  created_at: string;
}

const FechamentoTab = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFixingData, setIsFixingData] = useState(false);

  // Carregar empresas disponíveis
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const { data, error } = await (supabase
          .from('servicos' as any)
          .select('empresa')
          .order('empresa') as any);

        if (error) throw error;

        const uniqueEmpresas = [...new Set((data as any[]).map((item: any) => item.empresa))].filter(Boolean);
        setEmpresas(uniqueEmpresas);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  const handleFixData = async () => {
    setIsFixingData(true);
    
    try {
      const result = await fixServiceDataConsistency();
      
      toast({
        title: result.success ? "Dados corrigidos!" : "Erro na correção",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      // Se teve busca anterior, refazer a busca para mostrar dados atualizados
      if (hasSearched) {
        handleSearch();
      }
    } catch (error) {
      console.error('Erro ao corrigir dados:', error);
      toast({
        title: "Erro na correção",
        description: "Ocorreu um erro ao corrigir os dados.",
        variant: "destructive"
      });
    } finally {
      setIsFixingData(false);
    }
  };

  const handleSearch = async () => {
    console.log('=== DEBUG FECHAMENTO ===');
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('selectedEmpresa:', selectedEmpresa);
    
    if (!startDate || !endDate || !selectedEmpresa) {
      toast({
        title: "Filtros obrigatórios",
        description: "Por favor, preencha o período e selecione uma empresa.",
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

      const { data, error } = await (supabase
        .from('servicos' as any)
        .select('*')
        .eq('empresa', selectedEmpresa)
        .gte('data_servico', formattedStartDate)
        .lte('data_servico', formattedEndDate)
        .order('data_servico', { ascending: true }) as any);

      console.log('Resultado da busca:', { data, error });
      console.log('Quantidade de registros:', data?.length || 0);

      if (error) throw error;

      setServices(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Não foram encontrados serviços para os filtros selecionados.",
        });
      } else {
        toast({
          title: "Busca concluída",
          description: `Encontrados ${data.length} serviço(s).`,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os serviços.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (services.length === 0) {
      toast({
        title: "Nenhum dado",
        description: "Não há serviços para exportar.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF('landscape'); // Usar orientação paisagem para mais espaço
    
    // Título
    doc.setFontSize(16);
    doc.text('Fechamento de Serviços', 14, 15);
    
    // Informações do relatório
    doc.setFontSize(10);
    doc.text(`Empresa: ${selectedEmpresa}`, 14, 25);
    doc.text(`Período: ${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}`, 14, 30);
    doc.text(`Gerado em: ${formatDateForDisplay(new Date().toISOString().split('T')[0])}`, 14, 35);

    // Preparar dados para a tabela
    const tableData = services.map(service => [
      formatDateForDisplay(service.data_servico),
      service.ct_e || '-',
      service.nf || '-',
      service.solicitante || '-',
      service.servico ? (service.servico.length > 30 ? service.servico.substring(0, 30) + '...' : service.servico) : '-',
      service.cidade || '-',
      service.tipo_veiculo || '-',
      service.motorista || '-',
      service.frete || '-',
      service.seguro || '-',
      service.valor_texto
    ]);

    // Calcular total usando valor_texto para garantir precisão
    const total = services.reduce((acc, service) => acc + parseCurrencyToNumber(service.valor_texto), 0);

    // Gerar tabela
    autoTable(doc, {
      head: [['Data', 'CT-e', 'NF', 'Solicitante', 'Serviço', 'Cidade', 'Veículo', 'Motorista', 'Frete', 'Seguro', 'Valor']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 22 },
        6: { cellWidth: 18 },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 },
        9: { cellWidth: 20 },
        10: { cellWidth: 25, halign: 'right' }
      }
    });

    // Adicionar total
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 10);
    doc.text(`Quantidade de serviços: ${services.length}`, 14, finalY + 20);

    // Salvar PDF
    const fileName = `fechamento_${selectedEmpresa.replace(/\s+/g, '_')}_${startDate}_${endDate}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF gerado!",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalValue = services.reduce((acc, service) => acc + parseCurrencyToNumber(service.valor_texto), 0);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Fechamento de Serviços</span>
          </CardTitle>
          <CardDescription>
            Selecione o período e a empresa para gerar o fechamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa} value={empresa}>
                      {empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button 
                onClick={handleFixData} 
                disabled={isFixingData}
                variant="outline"
              >
                {isFixingData ? 'Corrigindo...' : 'Corrigir Dados'}
              </Button>
            </div>
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
                  {services.length} serviço(s) encontrado(s) • {formatCurrency(totalValue)}
                </CardDescription>
              </div>
              {services.length > 0 && (
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Nenhum serviço encontrado para os filtros selecionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Data</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">CT-e</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">NF</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Solicitante</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Serviço</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cidade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Veículo</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Motorista</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Frete</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Seguro</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {formatDateForDisplay(service.data_servico)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{service.ct_e || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.nf || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.solicitante || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2 max-w-xs truncate" title={service.servico}>
                          {service.servico || '-'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{service.cidade || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.tipo_veiculo || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.motorista || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.frete || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.seguro || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                          {service.valor_texto}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={10} className="border border-gray-300 px-4 py-2 text-right">
                        Total:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrency(totalValue)}
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

export default FechamentoTab;