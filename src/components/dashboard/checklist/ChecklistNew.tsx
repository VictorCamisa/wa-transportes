import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, CheckCircle2, XCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

interface ChecklistItem {
  item: string;
  status: 'funciona' | 'nao_funciona' | '';
  observacao: string;
}

const DEFAULT_ITEMS = [
  'Freio de mão',
  'Freio de pé',
  'Luzes dianteiras',
  'Luzes traseiras',
  'Setas / Pisca-alerta',
  'Pneus (estado geral)',
  'Estepe',
  'Nível de água',
  'Nível de óleo',
  'Limpador de para-brisa',
  'Espelhos retrovisores',
  'Cinto de segurança',
  'Extintor de incêndio',
  'Triângulo de sinalização',
  'Buzina',
  'Painel de instrumentos',
  'Direção hidráulica',
  'Suspensão',
  'Carroceria / Baú',
  'Documentação do veículo',
];

interface ChecklistNewProps {
  onSuccess?: () => void;
}

const ChecklistNew = ({ onSuccess }: ChecklistNewProps) => {
  const { user } = useAuth();
  const [selectedVeiculo, setSelectedVeiculo] = useState('');
  const [motorista, setMotorista] = useState('');
  const [km, setKm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    DEFAULT_ITEMS.map(item => ({ item, status: '', observacao: '' }))
  );

  const { data: veiculos } = useQuery({
    queryKey: ['veiculos-checklist'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('veiculos' as any)
        .select('*')
        .eq('status', 'disponivel')
        .order('placa') as any);
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: motoristas } = useQuery({
    queryKey: ['motoristas-checklist'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('motoristas' as any)
        .select('*')
        .eq('status', 'ativo')
        .order('nome') as any);
      if (error) throw error;
      return data as any[];
    },
  });

  const updateItem = (index: number, field: keyof ChecklistItem, value: string) => {
    setChecklist(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSelectVeiculo = (id: string) => {
    setSelectedVeiculo(id);
  };

  const handleSubmit = async () => {
    const veiculo = veiculos?.find((v: any) => v.id === selectedVeiculo);
    if (!selectedVeiculo || !motorista) {
      toast({ title: 'Preencha veículo e motorista', variant: 'destructive' });
      return;
    }

    const incomplete = checklist.some(i => !i.status);
    if (incomplete) {
      toast({ title: 'Marque todos os itens do checklist', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase.from('checklists' as any).insert([{
        placa: veiculo?.placa || selectedVeiculo,
        nome_motorista: motoristas?.find((m: any) => m.id === motorista)?.nome || motorista,
        data: format(new Date(), 'yyyy-MM-dd'),
        km: km ? Number(km) : null,
        items: checklist.map(i => ({ item: i.item, status: i.status, observacao: i.observacao })),
        criado_por: user?.id || null,
      }]) as any);

      if (error) throw error;

      toast({ title: 'Checklist salvo com sucesso!' });
      // Reset
      setSelectedVeiculo('');
      setMotorista('');
      setKm('');
      setChecklist(DEFAULT_ITEMS.map(item => ({ item, status: '', observacao: '' })));
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const answered = checklist.filter(i => i.status).length;
  const issues = checklist.filter(i => i.status === 'nao_funciona').length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Vehicle Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Informações do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Veículo</Label>
              <Select value={selectedVeiculo} onValueChange={handleSelectVeiculo}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {veiculos?.map((v: any) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.placa} - {v.modelo || v.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Motorista</Label>
              <Select value={motorista} onValueChange={setMotorista}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {motoristas?.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">KM Atual</Label>
              <Input type="number" value={km} onChange={e => setKm(e.target.value)} placeholder="0" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Data</Label>
              <Input value={format(new Date(), 'dd/MM/yyyy')} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{answered}/{checklist.length} respondidos</span>
        {issues > 0 && (
          <span className="text-destructive font-medium">{issues} problema(s) encontrado(s)</span>
        )}
      </div>

      {/* Checklist Items */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {checklist.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{item.item}</span>
                </div>

                <RadioGroup
                  value={item.status}
                  onValueChange={(val) => updateItem(index, 'status', val)}
                  className="flex gap-3"
                >
                  <label
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                      item.status === 'funciona'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <RadioGroupItem value="funciona" className="sr-only" />
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    OK
                  </label>
                  <label
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                      item.status === 'nao_funciona'
                        ? 'bg-destructive/10 border-destructive text-destructive'
                        : 'border-border text-muted-foreground hover:border-destructive/40'
                    }`}
                  >
                    <RadioGroupItem value="nao_funciona" className="sr-only" />
                    <XCircle className="h-3.5 w-3.5" />
                    Problema
                  </label>
                </RadioGroup>

                <Textarea
                  value={item.observacao}
                  onChange={e => updateItem(index, 'observacao', e.target.value)}
                  placeholder="Observação (opcional)"
                  className="min-h-[36px] h-9 text-xs sm:max-w-[200px] resize-none"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Send className="h-4 w-4" />
          {submitting ? 'Salvando...' : 'Enviar Checklist'}
        </Button>
      </div>
    </div>
  );
};

export default ChecklistNew;
