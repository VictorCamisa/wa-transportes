
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrencyInput } from '@/utils/currencyUtils';

interface CostData {
  descricao: string;
  data_vencimento: string;
  valor_texto: string;
  forma_pagamento: string;
  tipo: string;
  categoria: string;
}

interface CostFormFieldsProps {
  formData: CostData;
  errors: Partial<CostData>;
  onInputChange: (field: keyof CostData, value: string) => void;
}

const CostFormFields = ({ formData, errors, onInputChange }: CostFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Input
          id="descricao"
          value={formData.descricao}
          onChange={(e) => onInputChange('descricao', e.target.value)}
          placeholder="Digite a descrição do custo"
          maxLength={200}
        />
        {errors.descricao && (
          <p className="text-sm text-red-600">{errors.descricao}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
        <Input
          id="data_vencimento"
          type="date"
          value={formData.data_vencimento}
          onChange={(e) => onInputChange('data_vencimento', e.target.value)}
        />
        {errors.data_vencimento && (
          <p className="text-sm text-red-600">{errors.data_vencimento}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_texto">Valor *</Label>
        <Input
          id="valor_texto"
          value={formData.valor_texto}
          onChange={(e) => {
            const formattedValue = formatCurrencyInput(e.target.value);
            onInputChange('valor_texto', formattedValue);
          }}
          placeholder="R$ 0,00"
        />
        {errors.valor_texto && (
          <p className="text-sm text-red-600">{errors.valor_texto}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
        <Select value={formData.forma_pagamento} onValueChange={(value) => onInputChange('forma_pagamento', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a forma de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pix">Pix</SelectItem>
            <SelectItem value="Boleto">Boleto</SelectItem>
            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
            <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
            <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
            <SelectItem value="Cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
        {errors.forma_pagamento && (
          <p className="text-sm text-red-600">{errors.forma_pagamento}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo *</Label>
        <Select value={formData.tipo} onValueChange={(value) => onInputChange('tipo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fixo">Fixo</SelectItem>
            <SelectItem value="Variável">Variável</SelectItem>
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm text-red-600">{errors.tipo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={formData.categoria} onValueChange={(value) => onInputChange('categoria', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WA">WA (Empresa)</SelectItem>
            <SelectItem value="CASA">CASA (Pessoal)</SelectItem>
          </SelectContent>
        </Select>
        {errors.categoria && (
          <p className="text-sm text-red-600">{errors.categoria}</p>
        )}
      </div>
    </div>
  );
};

export default CostFormFields;
