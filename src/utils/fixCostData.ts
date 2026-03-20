import { supabase } from '@/integrations/supabase/client';
import { parseCurrencyToNumber } from './costCalculations';

export const fixCostDataConsistency = async () => {
  try {
    console.log('Iniciando correção dos dados de custos...');
    
    // Buscar todos os custos
    const { data: costs, error: fetchError } = await (supabase
      .from('custos_maio' as any)
      .select('id, valor_texto, valor_numerico') as any);

    if (fetchError) {
      console.error('Erro ao buscar custos:', fetchError);
      return { success: false, error: fetchError };
    }

    if (!costs || costs.length === 0) {
      console.log('Nenhum custo encontrado');
      return { success: true, message: 'Nenhum custo para corrigir' };
    }

    const updates = [];
    
    for (const cost of costs) {
      const correctNumericValue = parseCurrencyToNumber(cost.valor_texto);
      
      // Verificar se o valor numérico está diferente
      if (Math.abs(correctNumericValue - (cost.valor_numerico || 0)) > 0.01) {
        updates.push({
          id: cost.id,
          valor_numerico: correctNumericValue
        });
      }
    }

    console.log(`Encontrados ${updates.length} registros para atualizar`);

    if (updates.length > 0) {
      // Atualizar em lotes
      for (const update of updates) {
        const { error: updateError } = await (supabase
          .from('custos_maio' as any)
          .update({ valor_numerico: update.valor_numerico })
          .eq('id', update.id) as any);

        if (updateError) {
          console.error('Erro ao atualizar custo:', updateError);
        }
      }
      
      console.log('Dados corrigidos com sucesso!');
      return { 
        success: true, 
        message: `${updates.length} registros foram atualizados com sucesso` 
      };
    } else {
      console.log('Todos os dados já estão consistentes');
      return { 
        success: true, 
        message: 'Todos os dados já estão consistentes' 
      };
    }
  } catch (error) {
    console.error('Erro inesperado na correção:', error);
    return { success: false, error };
  }
};