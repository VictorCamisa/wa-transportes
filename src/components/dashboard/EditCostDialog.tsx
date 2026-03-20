
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDateForDatabase } from '@/utils/dateUtils';

interface CostData {
  id: string;
  descricao: string;
  data_vencimento: string;
  valor_texto: string;
  forma_pagamento: string;
  tipo: string;
  categoria?: string;
}

interface EditCostDialogProps {
  cost: CostData;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCostDialog = ({ cost, open, onClose, onUpdate }: EditCostDialogProps) => {
  const [formData, setFormData] = useState<CostData>(cost);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(cost);
  }, [cost]);

  const handleInputChange = (field: keyof CostData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const parseValueToNumber = (valueText: string): number => {
    const cleanValue = valueText.replace(/[R$\s]/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await (supabase
        .from('custos_maio' as any)
        .update({
          descricao: formData.descricao,
          data_vencimento: formatDateForDatabase(formData.data_vencimento),
          valor_texto: formData.valor_texto,
          valor_numerico: parseValueToNumber(formData.valor_texto),
          forma_pagamento: formData.forma_pagamento,
          tipo: formData.tipo,
          categoria: formData.categoria
        })
        .eq('id', cost.id) as any);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Custo atualizado com sucesso.",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar custo:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o custo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Custo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) => handleInputChange('data_vencimento', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor_texto">Valor</Label>
              <Input
                id="valor_texto"
                value={formData.valor_texto}
                onChange={(e) => handleInputChange('valor_texto', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
              <Input
                id="forma_pagamento"
                value={formData.forma_pagamento}
                onChange={(e) => handleInputChange('forma_pagamento', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixo">Fixo</SelectItem>
                  <SelectItem value="Variável">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria || ''} onValueChange={(value) => handleInputChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WA">WA (Empresa)</SelectItem>
                  <SelectItem value="CASA">CASA (Pessoal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCostDialog;
