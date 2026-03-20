export const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (!numbers) return '';
  
  // Converte para centavos
  const cents = parseInt(numbers);
  
  // Converte para reais
  const reais = cents / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(reais);
};

export const parseCurrencyToNumber = (value: string): number => {
  // Remove caracteres não numéricos exceto vírgula
  const numbers = value.replace(/[^\d,]/g, '');
  
  // Substitui vírgula por ponto para conversão
  const normalizedValue = numbers.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};