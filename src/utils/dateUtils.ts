/**
 * Utilitários para manipulação de datas que evitam problemas de timezone
 */

/**
 * Converte uma data para o formato YYYY-MM-DD garantindo que não haja problema de timezone
 * @param date Data a ser convertida
 * @returns String no formato YYYY-MM-DD
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converte uma string de data (YYYY-MM-DD) para uma data local sem problemas de timezone
 * @param dateString String no formato YYYY-MM-DD
 * @returns Data local
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Converte uma data para formato de banco garantindo timezone local
 * Esta função corrige o problema do input date que pode causar shift de timezone
 * @param dateString String no formato YYYY-MM-DD do input
 * @returns String no formato YYYY-MM-DD garantindo que seja a data correta
 */
export const formatDateForDatabase = (dateString: string): string => {
  if (!dateString) return '';
  
  // Para inputs do tipo date, às vezes temos problema de timezone
  // Vamos garantir que a data seja interpretada como local
  const [year, month, day] = dateString.split('-');
  
  // Criar uma nova data garantindo que seja local (meio-dia para evitar problemas de timezone)
  const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
  
  // Retornar no formato correto para o banco
  const correctedYear = localDate.getFullYear();
  const correctedMonth = String(localDate.getMonth() + 1).padStart(2, '0');
  const correctedDay = String(localDate.getDate()).padStart(2, '0');
  
  return `${correctedYear}-${correctedMonth}-${correctedDay}`;
};

/**
 * Formata uma data vinda do banco para exibição, garantindo que seja local
 * @param dateString String de data vinda do banco
 * @returns String formatada para exibição (DD/MM/YYYY)
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Se a data vem no formato YYYY-MM-DD do banco, tratamos como data local
    // Para evitar problemas de timezone, vamos processar diretamente a string
    const dateParts = dateString.split('T')[0].split('-'); // Remove hora se tiver e separa por -
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    
    return dateString;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
};

/**
 * Retorna a data atual no formato para input (YYYY-MM-DD)
 */
export const getCurrentDateForInput = (): string => {
  return formatDateForInput(new Date());
};