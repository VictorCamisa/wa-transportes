import { supabase } from '@/integrations/supabase/client';
import { parseCurrencyToNumber } from './costCalculations';

export const fixServiceDataConsistency = async () => {
  try {
    // Buscar todos os registros de serviços
    const { data: services, error: fetchError } = await (supabase
      .from('servicos_maio' as any)
      .select('*') as any);

    if (fetchError) {
      console.error('Erro ao buscar serviços:', fetchError);
      return { success: false, message: 'Erro ao buscar dados dos serviços' };
    }

    if (!services || services.length === 0) {
      return { success: true, message: 'Nenhum serviço encontrado' };
    }

    let updatedCount = 0;
    const updates = [];

    // Verificar cada serviço
    for (const service of services) {
      const valorFromText = parseCurrencyToNumber(service.valor_texto);
      const currentValueNumerico = Number(service.valor_numerico) || 0;

      // Verificar se há inconsistência
      if (Math.abs(valorFromText - currentValueNumerico) > 0.01) {
        console.log(`Serviço ${service.id}: valor_texto="${service.valor_texto}" -> ${valorFromText}, valor_numerico atual=${currentValueNumerico}`);
        
        updates.push({
          id: service.id,
          valor_numerico: valorFromText
        });
        updatedCount++;
      }
    }

    // Atualizar registros inconsistentes
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await (supabase
          .from('servicos_maio' as any)
          .update({ valor_numerico: update.valor_numerico })
          .eq('id', update.id) as any);

        if (updateError) {
          console.error('Erro ao atualizar serviço:', updateError);
          return { success: false, message: `Erro ao atualizar serviço ${update.id}` };
        }
      }
    }

    const message = updatedCount > 0 
      ? `${updatedCount} serviço(s) corrigido(s) com sucesso` 
      : 'Todos os dados dos serviços já estão consistentes';

    return { success: true, message };

  } catch (error) {
    console.error('Erro na correção de dados dos serviços:', error);
    return { success: false, message: 'Erro interno na correção de dados' };
  }
};