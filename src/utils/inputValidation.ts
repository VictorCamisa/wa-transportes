
export const validateMonetaryValue = (value: string): { isValid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Valor é obrigatório' };
  }

  // Remove R$ and spaces, replace comma with dot
  const cleanValue = value.replace(/[R$\s]/g, '').replace(',', '.');
  const numericValue = parseFloat(cleanValue);

  if (isNaN(numericValue)) {
    return { isValid: false, error: 'Valor deve ser um número válido' };
  }

  if (numericValue < 0) {
    return { isValid: false, error: 'Valor não pode ser negativo' };
  }

  if (numericValue > 999999.99) {
    return { isValid: false, error: 'Valor muito alto (máximo: R$ 999.999,99)' };
  }

  return { isValid: true };
};

export const validateDate = (dateString: string): { isValid: boolean; error?: string } => {
  if (!dateString) {
    return { isValid: false, error: 'Data é obrigatória' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }

  const now = new Date();
  const minDate = new Date(2020, 0, 1); // January 1, 2020
  const maxDate = new Date(now.getFullYear() + 10, 11, 31); // 10 years from now

  if (date < minDate) {
    return { isValid: false, error: 'Data muito antiga (mínimo: 01/01/2020)' };
  }

  if (date > maxDate) {
    return { isValid: false, error: 'Data muito distante no futuro' };
  }

  return { isValid: true };
};

export const validateTextInput = (text: string, maxLength: number = 255): { isValid: boolean; error?: string } => {
  if (!text || text.trim() === '') {
    return { isValid: false, error: 'Campo é obrigatório' };
  }

  if (text.length > maxLength) {
    return { isValid: false, error: `Texto muito longo (máximo: ${maxLength} caracteres)` };
  }

  // Basic XSS prevention - check for suspicious patterns
  const suspiciousPatterns = /<script|javascript:|on\w+\s*=/i;
  if (suspiciousPatterns.test(text)) {
    return { isValid: false, error: 'Conteúdo inválido detectado' };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
    .substring(0, 255); // Limit length
};
