export const parseCurrencyToNumber = (valueText: string): number => {
  // Remove R$ e espaços
  let cleanValue = valueText.replace(/[R$\s]/g, '');
  
  // Se temos ponto e vírgula, o ponto é separador de milhar e vírgula é decimal
  if (cleanValue.includes('.') && cleanValue.includes(',')) {
    // Remove pontos (separadores de milhar) e substitui vírgula por ponto (decimal)
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  }
  // Se temos apenas vírgula, ela é o separador decimal
  else if (cleanValue.includes(',') && !cleanValue.includes('.')) {
    cleanValue = cleanValue.replace(',', '.');
  }
  // Se temos apenas ponto, pode ser separador decimal (se houver 1 ou 2 dígitos após)
  // ou separador de milhar (se houver 3 dígitos após)
  else if (cleanValue.includes('.')) {
    const parts = cleanValue.split('.');
    const lastPart = parts[parts.length - 1];
    // Se a última parte tem 1 ou 2 dígitos, é separador decimal
    if (lastPart.length <= 2) {
      // Mantém como está (ponto como decimal)
    } else {
      // Remove todos os pontos (são separadores de milhar)
      cleanValue = cleanValue.replace(/\./g, '');
    }
  }
  
  return parseFloat(cleanValue) || 0;
};

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateCostTotals = (costs: any[]) => {
  // Sempre recalcular com base no valor_texto para garantir precisão
  const costsWithCorrectNumbers = costs.map(cost => ({
    ...cost,
    valor_numerico_calculado: parseCurrencyToNumber(cost.valor_texto)
  }));

  const total = costsWithCorrectNumbers.reduce((acc, cost) => acc + cost.valor_numerico_calculado, 0);
  const totalFixo = costsWithCorrectNumbers.filter(c => c.tipo === 'Fixo').reduce((acc, cost) => acc + cost.valor_numerico_calculado, 0);
  const totalVariavel = costsWithCorrectNumbers.filter(c => c.tipo === 'Variável').reduce((acc, cost) => acc + cost.valor_numerico_calculado, 0);

  return {
    total,
    totalFixo,
    totalVariavel,
    costsWithCorrectNumbers
  };
};