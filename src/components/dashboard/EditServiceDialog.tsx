import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDateForDatabase } from '@/utils/dateUtils';
import { Plus } from 'lucide-react';

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
  tem_cte: boolean;
  ct_e: string;
  nf: string;
  frete: string;
  seguro: string;
}

interface EditServiceDialogProps {
  service: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditServiceDialog = ({ service, open, onClose, onUpdate }: EditServiceDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ServiceData>({
    ...service,
    tem_cte: !!service.ct_e,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empresaSearch, setEmpresaSearch] = useState('');
  const [showNovaEmpresa, setShowNovaEmpresa] = useState(false);
  const [novaEmpresa, setNovaEmpresa] = useState('');

  const { data: empresas } = useQuery({
    queryKey: ['empresas-list'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('empresas' as any).select('*').eq('ativa', true).order('nome') as any);
      if (error) throw error;
      return data as { id: string; nome: string }[];
    },
  });

  const vehicleTypes = ['MOTO', 'CARRO', 'VUC', '3/4', 'TRUCK', 'CARRETA', 'CAM'];
  const freteTypes = ['Frete Fracionado', 'Frete Integral'];

  useEffect(() => {
    setFormData({ ...service, tem_cte: !!service.ct_e });
  }, [service]);

  const handleInputChange = (field: keyof ServiceData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEmpresa = async () => {
    if (!novaEmpresa.trim()) return;
    try {
      const { error } = await (supabase.from('empresas' as any).insert({ nome: novaEmpresa.trim().toUpperCase() }) as any);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['empresas-list'] });
      handleInputChange('empresa', novaEmpresa.trim().toUpperCase());
      setNovaEmpresa('');
      setShowNovaEmpresa(false);
      toast({ title: 'Empresa criada!' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
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
          ct_e: formData.tem_cte ? (formData.ct_e || null) : null,
          nf: formData.nf || null,
          frete: formData.frete || null,
          seguro: formData.seguro || null,
        })
        .eq('id', service.id) as any);

      if (error) throw error;

      toast({ title: 'Sucesso!', description: 'Serviço atualizado com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({ title: 'Erro ao atualizar', description: 'Ocorreu um erro ao atualizar o serviço.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>Atualize as informações do serviço</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Serviço</Label>
                <Input type="date" value={formData.data_servico} onChange={(e) => handleInputChange('data_servico', e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Empresa *</Label>
                <Select value={formData.empresa} onValueChange={(value) => {
                  if (value === '__new__') {
                    setShowNovaEmpresa(true);
                  } else {
                    handleInputChange('empresa', value);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <div className="p-2">
                      <Input placeholder="Buscar empresa..." value={empresaSearch} onChange={(e) => setEmpresaSearch(e.target.value)} className="h-8" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} />
                    </div>
                    {(empresas || [])
                      .filter(e => e && e.nome && e.nome.toLowerCase().includes(empresaSearch.toLowerCase()))
                      .map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.nome}>{empresa.nome}</SelectItem>
                      ))}
                    <SelectItem value="__new__" className="text-primary font-medium border-t mt-1">
                      <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> Criar nova empresa</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showNovaEmpresa && (
              <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
                <Input value={novaEmpresa} onChange={(e) => setNovaEmpresa(e.target.value.toUpperCase())} placeholder="Nome da nova empresa" className="flex-1" />
                <Button type="button" size="sm" onClick={handleCreateEmpresa}>Criar</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setShowNovaEmpresa(false)}>Cancelar</Button>
              </div>
            )}

            {/* CT-e Toggle */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Switch checked={formData.tem_cte} onCheckedChange={(checked) => handleInputChange('tem_cte', checked)} />
              <Label>Possui CT-e?</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.tem_cte && (
                <div className="space-y-2">
                  <Label>CT-e</Label>
                  <Input value={formData.ct_e} onChange={(e) => handleInputChange('ct_e', e.target.value)} placeholder="Número do CT-e" />
                </div>
              )}

              <div className="space-y-2">
                <Label>NF</Label>
                <Input value={formData.nf} onChange={(e) => handleInputChange('nf', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Solicitante</Label>
                <Input value={formData.solicitante} onChange={(e) => handleInputChange('solicitante', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={formData.cidade} onChange={(e) => handleInputChange('cidade', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Veículo</Label>
                <Select value={formData.tipo_veiculo || ''} onValueChange={(value) => handleInputChange('tipo_veiculo', value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Veículo</Label>
                <Input value={formData.veiculo} onChange={(e) => handleInputChange('veiculo', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Motorista</Label>
                <Input value={formData.motorista} onChange={(e) => handleInputChange('motorista', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Valor</Label>
                <Input value={formData.valor_texto} onChange={(e) => handleInputChange('valor_texto', e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Frete</Label>
                <Select value={formData.frete || ''} onValueChange={(value) => handleInputChange('frete', value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o frete" /></SelectTrigger>
                  <SelectContent>
                    {freteTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Seguro</Label>
                <Input value={formData.seguro} onChange={(e) => handleInputChange('seguro', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição do Serviço</Label>
              <Textarea value={formData.servico} onChange={(e) => handleInputChange('servico', e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-t bg-background p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
