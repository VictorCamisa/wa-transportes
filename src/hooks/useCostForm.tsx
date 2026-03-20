
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateMonetaryValue, validateDate, validateTextInput, sanitizeInput } from '@/utils/inputValidation';
import { getCurrentDateForInput, formatDateForDatabase } from '@/utils/dateUtils';
import { parseCurrencyToNumber } from '@/utils/costCalculations';

interface CostData {
  descricao: string;
  data_vencimento: string;
  valor_texto: string;
  forma_pagamento: string;
  tipo: string;
  categoria: string;
}

export const useCostForm = (onClose: () => void) => {
  const [formData, setFormData] = useState<CostData>({
    descricao: '',
    data_vencimento: getCurrentDateForInput(),
    valor_texto: '',
    forma_pagamento: '',
    tipo: '',
    categoria: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CostData>>({});

  const handleInputChange = (field: keyof CostData, value: string) => {
    // Only sanitize on submit, not on every change to allow normal typing
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CostData> = {};

    // Validate description
    const descValidation = validateTextInput(formData.descricao, 200);
    if (!descValidation.isValid) {
      newErrors.descricao = descValidation.error;
    }

    // Validate monetary value
    const valueValidation = validateMonetaryValue(formData.valor_texto);
    if (!valueValidation.isValid) {
      newErrors.valor_texto = valueValidation.error;
    }

    // Validate date
    const dateValidation = validateDate(formData.data_vencimento);
    if (!dateValidation.isValid) {
      newErrors.data_vencimento = dateValidation.error;
    }

    // Validate required fields
    if (!formData.forma_pagamento) {
      newErrors.forma_pagamento = 'Forma de pagamento é obrigatória';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseValueToNumber = (valueText: string): number => {
    return parseCurrencyToNumber(valueText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Tentando inserir custo...');
      
      // Agora incluindo a categoria que foi adicionada na tabela
      const insertData = {
        descricao: sanitizeInput(formData.descricao),
        data_vencimento: formatDateForDatabase(formData.data_vencimento),
        valor_texto: formData.valor_texto,
        valor_numerico: parseValueToNumber(formData.valor_texto),
        forma_pagamento: formData.forma_pagamento,
        tipo: formData.tipo,
        categoria: formData.categoria || null
      };

      console.log('Dados a serem inseridos:', insertData);

      const { data, error } = await (supabase
        .from('custos' as any)
        .insert([insertData])
        .select() as any);

      if (error) {
        console.error('Erro detalhado ao inserir custo:', error);
        toast({
          title: "Erro ao salvar",
          description: `Erro: ${error.message}. Código: ${error.code}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Custo inserido com sucesso:', data);

      toast({
        title: "Custo cadastrado com sucesso!",
        description: "O novo custo foi cadastrado no sistema.",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};
