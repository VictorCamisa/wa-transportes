
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateCostTotals, parseCurrencyToNumber } from '@/utils/costCalculations';

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

interface RevenueByClientData {
  empresa: string;
  receita: number;
}

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
  created_at: string;
}

interface DashboardFilters {
  startDate: string;
  endDate: string;
  empresa: string;
  tipoCusto: string;
  cidade: string;
  mes: string;
}

const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const fetchAllServices = async (filters?: DashboardFilters) => {
  let allServices: any[] = [];
  let hasMore = true;
  let offset = 0;
  const pageSize = 1000;

  console.log('useServicesKPI: Iniciando busca de TODOS os serviços com filtros:', filters);

  while (hasMore) {
    let servicesQuery = (supabase
      .from('servicos_maio' as any)
      .select('*')
      .range(offset, offset + pageSize - 1)) as any;

    // Aplicar filtros se fornecidos
    if (filters?.startDate) {
      servicesQuery = servicesQuery.gte('data_servico', filters.startDate);
    }
    if (filters?.endDate) {
      servicesQuery = servicesQuery.lte('data_servico', filters.endDate);
    }
    if (filters?.empresa && filters.empresa !== 'all') {
      servicesQuery = servicesQuery.eq('empresa', filters.empresa);
    }
    if (filters?.cidade && filters.cidade !== 'all') {
      servicesQuery = servicesQuery.eq('cidade', filters.cidade);
    }
    
    // Corrigir filtro de mês para usar datas válidas
    if (filters?.mes && filters.mes !== 'all') {
      const currentYear = new Date().getFullYear();
      const monthNum = parseInt(filters.mes);
      const lastDay = getLastDayOfMonth(currentYear, monthNum);
      
      const startDate = `${currentYear}-${monthNum.toString().padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${monthNum.toString().padStart(2, '0')}-${lastDay}`;
      
      console.log(`Filtro de mês: ${filters.mes} -> ${startDate} até ${endDate}`);
      
      servicesQuery = servicesQuery.gte('data_servico', startDate).lte('data_servico', endDate);
    }

    const { data, error } = await servicesQuery;
    
    if (error) {
      console.error('useServicesKPI: Erro ao buscar serviços:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allServices = [...allServices, ...data];
      console.log(`useServicesKPI: Carregados ${data.length} serviços (offset: ${offset}). Total acumulado: ${allServices.length}`);
      
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        offset += pageSize;
      }
    } else {
      hasMore = false;
    }
  }

  console.log(`useServicesKPI: BUSCA COMPLETA! Total de serviços carregados: ${allServices.length}`);
  return allServices;
};

export const useServicesKPI = (filters?: DashboardFilters) => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [revenueByClient, setRevenueByClient] = useState<RevenueByClientData[] | null>(null);
  const [recentServices, setRecentServices] = useState<ServiceData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);

        // Buscar TODOS os dados dos serviços
        const servicesData = await fetchAllServices(filters);

        // Buscar dados dos custos com filtros corrigidos
        let costQuery = (supabase
          .from('custos_maio') as any)
          .select('*');

        if (filters?.startDate) {
          costQuery = costQuery.gte('data_vencimento', filters.startDate);
        }
        if (filters?.endDate) {
          costQuery = costQuery.lte('data_vencimento', filters.endDate);
        }
        if (filters?.tipoCusto && filters.tipoCusto !== 'all') {
          costQuery = costQuery.eq('tipo', filters.tipoCusto);
        }

        // Aplicar filtro de mês nos custos também
        if (filters?.mes && filters.mes !== 'all') {
          const currentYear = new Date().getFullYear();
          const monthNum = parseInt(filters.mes);
          const lastDay = getLastDayOfMonth(currentYear, monthNum);
          
          const startDate = `${currentYear}-${monthNum.toString().padStart(2, '0')}-01`;
          const endDate = `${currentYear}-${monthNum.toString().padStart(2, '0')}-${lastDay}`;
          
          costQuery = costQuery.gte('data_vencimento', startDate).lte('data_vencimento', endDate);
        }

        const { data: costsData, error: costsError } = await costQuery;
        if (costsError) throw costsError;

        // Calcular KPIs usando valor_texto para garantir precisão
        const receita_total = servicesData?.reduce((sum, service) => sum + parseCurrencyToNumber(service.valor_texto || ''), 0) || 0;
        const total_servicos = servicesData?.length || 0;
        const ticket_medio = total_servicos > 0 ? receita_total / total_servicos : 0;

        console.log(`useServicesKPI: CÁLCULOS FINAIS - Total de serviços: ${total_servicos}, Receita total: R$ ${receita_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

        // Encontrar principal cliente usando valor_texto
        const clienteRevenue = servicesData?.reduce((acc, service) => {
          const valor = parseCurrencyToNumber(service.valor_texto || '');
          acc[service.empresa] = (acc[service.empresa] || 0) + valor;
          return acc;
        }, {} as Record<string, number>) || {};

        const principal_cliente = Object.keys(clienteRevenue).length > 0 
          ? Object.keys(clienteRevenue).reduce((a, b) => clienteRevenue[a] > clienteRevenue[b] ? a : b)
          : 'N/A';

        // Encontrar principal cidade
        const cidadeCount = servicesData?.reduce((acc, service) => {
          if (service.cidade) {
            acc[service.cidade] = (acc[service.cidade] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>) || {};

        const principal_cidade = Object.keys(cidadeCount).length > 0
          ? Object.keys(cidadeCount).reduce((a, b) => cidadeCount[a] > cidadeCount[b] ? a : b)
          : 'N/A';

        // Calcular custos usando a função utilitária para consistência
        const { total: total_custos, totalFixo: custos_fixos, totalVariavel: custos_variaveis } = calculateCostTotals(costsData || []);

        const lucro_bruto = receita_total - total_custos;
        const margem_lucro = receita_total > 0 ? (lucro_bruto / receita_total) * 100 : 0;

        console.log('useServicesKPI: KPIs CORRETOS calculados', {
          receita_total: `R$ ${receita_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          total_servicos,
          ticket_medio: `R$ ${ticket_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          principal_cliente,
          principal_cidade,
          total_custos: `R$ ${total_custos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        });

        setKpiData({
          receita_total,
          total_servicos,
          ticket_medio,
          principal_cliente,
          principal_cidade,
          total_custos,
          lucro_bruto,
          margem_lucro,
          custos_fixos,
          custos_variaveis
        });

        // Preparar dados de receita por cliente
        const revenueByClientArray = Object.entries(clienteRevenue)
          .map(([empresa, receita]) => ({ empresa, receita: Number(receita) }))
          .sort((a, b) => b.receita - a.receita)
          .slice(0, 10);

        setRevenueByClient(revenueByClientArray);

        // Preparar serviços recentes - limitados a 10 apenas para o dashboard
        const recentServicesData = servicesData
          ?.sort((a, b) => new Date(b.data_servico).getTime() - new Date(a.data_servico).getTime())
          .slice(0, 10)
          .map(service => ({
            id: service.id,
            data_servico: service.data_servico,
            ct_e: service.ct_e || '',
            nf: service.nf || '',
            empresa: service.empresa,
            solicitante: service.solicitante || '',
            servico: service.servico || '',
            cidade: service.cidade || '',
            tipo_veiculo: service.tipo_veiculo || '',
            veiculo: service.veiculo || '',
            motorista: service.motorista || '',
            valor_texto: service.valor_texto,
            valor_numerico: Number(service.valor_numerico) || 0,
            created_at: service.created_at
          })) || [];

        setRecentServices(recentServicesData);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setKpiData({
          receita_total: 0,
          total_servicos: 0,
          ticket_medio: 0,
          principal_cliente: 'N/A',
          principal_cidade: 'N/A',
          total_custos: 0,
          lucro_bruto: 0,
          margem_lucro: 0,
          custos_fixos: 0,
          custos_variaveis: 0
        });
        setRevenueByClient([]);
        setRecentServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, [filters]);

  return {
    kpiData,
    revenueByClient,
    recentServices,
    loading
  };
};
