
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDateForDatabase } from '@/utils/dateUtils';

interface ServiceData {
  id: string;
  empresa: string;
  solicitante: string;
  servico: string;
  cidade: string;
  tipo_veiculo: string;
  veiculo: string;
  motorista: string;
  valor_texto: string;
  data_servico: string;
  ct_e: string;
  nf: string;
  frete: string;
  seguro: string;
}

interface EditServiceDialogProps {
  service: ServiceData;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditServiceDialog = ({ service, open, onClose, onUpdate }: EditServiceDialogProps) => {
  const [formData, setFormData] = useState<ServiceData>(service);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleTypes = ['MOTO', 'CARRO', 'VUC', '3/4', 'TRUCK', 'CARRETA', 'CAM'];
  const freteTypes = ['Frete Fracionado', 'Frete Integral'];

  useEffect(() => {
    setFormData(service);
  }, [service]);

  const handleInputChange = (field: keyof ServiceData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await (supabase
        .from('servicos' as any)
        .update({
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
        })
        .eq('id', service.id) as any);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Serviço atualizado com sucesso.",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o serviço.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_servico">Data do Serviço</Label>
                <Input
                  id="data_servico"
                  type="date"
                  value={formData.data_servico}
                  onChange={(e) => handleInputChange('data_servico', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ct_e">CT-e</Label>
                <Input
                  id="ct_e"
                  value={formData.ct_e}
                  onChange={(e) => handleInputChange('ct_e', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nf">NF</Label>
                <Input
                  id="nf"
                  value={formData.nf}
                  onChange={(e) => handleInputChange('nf', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="solicitante">Solicitante</Label>
                <Input
                  id="solicitante"
                  value={formData.solicitante}
                  onChange={(e) => handleInputChange('solicitante', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                />
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motorista">Motorista</Label>
                <Input
                  id="motorista"
                  value={formData.motorista}
                  onChange={(e) => handleInputChange('motorista', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  value={formData.valor_texto}
                  onChange={(e) => handleInputChange('valor_texto', e.target.value)}
                  required
                />
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
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="servico">Descrição do Serviço</Label>
              <Textarea
                id="servico"
                value={formData.servico}
                onChange={(e) => handleInputChange('servico', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 border-t bg-background p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
