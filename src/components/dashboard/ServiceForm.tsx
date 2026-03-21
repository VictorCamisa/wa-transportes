
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateMonetaryValue, validateDate, validateTextInput, sanitizeInput } from '@/utils/inputValidation';
import { getCurrentDateForInput, formatDateForDatabase } from '@/utils/dateUtils';
import { formatCurrencyInput } from '@/utils/currencyUtils';

interface ServiceData {
  empresa: string;
  solicitante: string;
  servico: string;
  cidade: string;
  tipo_veiculo: string;
  veiculo: string;
  motorista: string;
  valor_texto: string;
  data_servico: string;
  tem_cte: boolean;
  ct_e: string;
  nf: string;
  frete: string;
  seguro: string;
}

const ServiceForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<ServiceData>({
    empresa: '',
    solicitante: '',
    servico: '',
    cidade: '',
    tipo_veiculo: '',
    veiculo: '',
    motorista: '',
    valor_texto: '',
    data_servico: getCurrentDateForInput(),
    tem_cte: false,
    ct_e: '',
    nf: '',
    frete: '',
    seguro: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ServiceData>>({});

  const vehicleTypes = ['MOTO', 'CARRO', 'VUC', '3/4', 'TRUCK', 'CARRETA', 'CAM'];
  const freteTypes = ['Frete Fracionado', 'Frete Integral'];

  const handleInputChange = (field: keyof ServiceData, value: string) => {
    const sanitizedValue = ['empresa', 'solicitante', 'servico', 'cidade', 'veiculo', 'motorista', 'frete'].includes(field) 
      ? sanitizeInput(value) 
      : value;
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceData> = {};

    // Validate empresa (required)
    const empresaValidation = validateTextInput(formData.empresa, 100);
    if (!empresaValidation.isValid) {
      newErrors.empresa = empresaValidation.error;
    }

    // Validate valor_texto (required)
    const valueValidation = validateMonetaryValue(formData.valor_texto);
    if (!valueValidation.isValid) {
      newErrors.valor_texto = valueValidation.error;
    }

    // Validate data_servico (required)
    const dateValidation = validateDate(formData.data_servico);
    if (!dateValidation.isValid) {
      newErrors.data_servico = dateValidation.error;
    }

    // Validate optional text fields
    if (formData.solicitante) {
      const solicitanteValidation = validateTextInput(formData.solicitante, 100);
      if (!solicitanteValidation.isValid) {
        newErrors.solicitante = solicitanteValidation.error;
      }
    }

    if (formData.servico) {
      const servicoValidation = validateTextInput(formData.servico, 500);
      if (!servicoValidation.isValid) {
        newErrors.servico = servicoValidation.error;
      }
    }

    if (formData.cidade) {
      const cidadeValidation = validateTextInput(formData.cidade, 100);
      if (!cidadeValidation.isValid) {
        newErrors.cidade = cidadeValidation.error;
      }
    }

    if (formData.frete) {
      const freteValidation = validateTextInput(formData.frete, 200);
      if (!freteValidation.isValid) {
        newErrors.frete = freteValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const processedData = {
        empresa: formData.empresa,
        solicitante: formData.solicitante || null,
        servico: formData.servico || null,
        cidade: formData.cidade || null,
        tipo_veiculo: formData.tipo_veiculo || null,
        veiculo: formData.veiculo || null,
        motorista: formData.motorista || null,
        valor_texto: formData.valor_texto,
        data_servico: formatDateForDatabase(formData.data_servico),
        ct_e: formData.ct_e || null,
        nf: formData.nf || null,
        frete: formData.frete || null,
        seguro: formData.seguro || null
      };

      const { error } = await (supabase
        .from('servicos' as any)
        .insert([processedData]) as any);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Serviço cadastrado com sucesso.",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o serviço. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
        <DialogDescription>
          Preencha os dados do serviço a ser cadastrado
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_servico">Data do Serviço *</Label>
            <Input
              id="data_servico"
              type="date"
              value={formData.data_servico}
              onChange={(e) => handleInputChange('data_servico', e.target.value)}
              required
            />
            {errors.data_servico && (
              <p className="text-sm text-red-600">{errors.data_servico}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              placeholder="Nome da empresa"
              maxLength={100}
              required
            />
            {errors.empresa && (
              <p className="text-sm text-red-600">{errors.empresa}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ct_e">CT-e</Label>
            <Input
              id="ct_e"
              value={formData.ct_e}
              onChange={(e) => handleInputChange('ct_e', e.target.value)}
              placeholder="Número do CT-e"
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nf">NF</Label>
            <Input
              id="nf"
              value={formData.nf}
              onChange={(e) => handleInputChange('nf', e.target.value)}
              placeholder="Número da NF"
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solicitante">Solicitante</Label>
            <Input
              id="solicitante"
              value={formData.solicitante}
              onChange={(e) => handleInputChange('solicitante', e.target.value)}
              placeholder="Nome do solicitante"
              maxLength={100}
            />
            {errors.solicitante && (
              <p className="text-sm text-red-600">{errors.solicitante}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              placeholder="Cidade de destino"
              maxLength={100}
            />
            {errors.cidade && (
              <p className="text-sm text-red-600">{errors.cidade}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipo_veiculo">Tipo de Veículo</Label>
            <Select value={formData.tipo_veiculo} onValueChange={(value) => handleInputChange('tipo_veiculo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="veiculo">Veículo</Label>
            <Input
              id="veiculo"
              value={formData.veiculo}
              onChange={(e) => handleInputChange('veiculo', e.target.value)}
              placeholder="Identificação do veículo"
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motorista">Motorista</Label>
            <Input
              id="motorista"
              value={formData.motorista}
              onChange={(e) => handleInputChange('motorista', e.target.value)}
              placeholder="Nome do motorista"
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              value={formData.valor_texto}
              onChange={(e) => {
                const formattedValue = formatCurrencyInput(e.target.value);
                handleInputChange('valor_texto', formattedValue);
              }}
              placeholder="R$ 0,00"
              required
            />
            {errors.valor_texto && (
              <p className="text-sm text-red-600">{errors.valor_texto}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frete">Frete</Label>
            <Select value={formData.frete} onValueChange={(value) => handleInputChange('frete', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de frete" />
              </SelectTrigger>
              <SelectContent>
                {freteTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seguro">Seguro</Label>
            <Input
              id="seguro"
              value={formData.seguro}
              onChange={(e) => handleInputChange('seguro', e.target.value)}
              placeholder="Informações sobre o seguro"
              maxLength={200}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="servico">Descrição do Serviço</Label>
          <Textarea
            id="servico"
            value={formData.servico}
            onChange={(e) => handleInputChange('servico', e.target.value)}
            placeholder="Descrição detalhada do serviço"
            maxLength={500}
            rows={3}
          />
          {errors.servico && (
            <p className="text-sm text-red-600">{errors.servico}</p>
          )}
        </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 border-t bg-background p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Serviço'}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default ServiceForm;
