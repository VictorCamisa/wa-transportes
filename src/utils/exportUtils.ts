
import { supabase } from '@/integrations/supabase/client';

// Função para converter dados para CSV
export const convertToCSV = (data: any[], headers?: Record<string, string>): string => {
  if (!data || data.length === 0) return '';

  const keys = Object.keys(data[0]);
  const headerRow = headers 
    ? keys.map(key => headers[key] || key).join(',')
    : keys.join(',');

  const rows = data.map(row => {
    return keys.map(key => {
      const value = row[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
};

// Função para fazer download de arquivo
export const downloadFile = (content: string, filename: string, type: string) => {
  const BOM = '\uFEFF'; // UTF-8 BOM para suportar caracteres especiais
  const blob = new Blob([BOM + content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Headers em português para cada tabela
const tableHeaders: Record<string, Record<string, string>> = {
  custos: {
    id: 'ID',
    description: 'Descrição',
    value: 'Valor',
    date: 'Data',
    category: 'Categoria',
    payment_method: 'Forma de Pagamento',
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    user_id: 'ID do Usuário'
  },
  servicos: {
    id: 'ID',
    cliente: 'Cliente',
    tipo_servico: 'Tipo de Serviço',
    valor: 'Valor',
    forma_pagamento: 'Forma de Pagamento',
    data: 'Data',
    observacoes: 'Observações',
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    user_id: 'ID do Usuário',
    status: 'Status'
  },
  profiles: {
    id: 'ID',
    username: 'Nome de Usuário',
    role: 'Função',
    created_at: 'Criado em',
    updated_at: 'Atualizado em'
  },
  user_permissions: {
    id: 'ID',
    user_id: 'ID do Usuário',
    permission: 'Permissão',
    created_at: 'Criado em'
  }
};

// Exportar tabela para CSV
export const exportTableToCSV = async (tableName: string): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) {
      return { success: false, count: 0, error: 'Nenhum dado encontrado' };
    }

    const csv = convertToCSV(data, tableHeaders[tableName]);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(csv, `${tableName}_${date}.csv`, 'text/csv');

    return { success: true, count: data.length };
  } catch (error: any) {
    console.error(`Erro ao exportar ${tableName}:`, error);
    return { success: false, count: 0, error: error.message };
  }
};

// Exportar tabela para JSON
export const exportTableToJSON = async (tableName: string): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) {
      return { success: false, count: 0, error: 'Nenhum dado encontrado' };
    }

    const json = JSON.stringify(data, null, 2);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(json, `${tableName}_${date}.json`, 'application/json');

    return { success: true, count: data.length };
  } catch (error: any) {
    console.error(`Erro ao exportar ${tableName}:`, error);
    return { success: false, count: 0, error: error.message };
  }
};

// Buscar contagem de registros de uma tabela
export const getTableCount = async (tableName: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`Erro ao contar registros de ${tableName}:`, error);
    return 0;
  }
};

// Exportar todas as tabelas
export const exportAllTables = async (format: 'csv' | 'json'): Promise<{ success: boolean; results: Record<string, { count: number; error?: string }> }> => {
  const tables = ['custos', 'servicos', 'profiles', 'user_permissions'];
  const results: Record<string, { count: number; error?: string }> = {};

  for (const table of tables) {
    const exportFn = format === 'csv' ? exportTableToCSV : exportTableToJSON;
    const result = await exportFn(table);
    results[table] = { count: result.count, error: result.error };
  }

  const hasSuccess = Object.values(results).some(r => r.count > 0);
  return { success: hasSuccess, results };
};
