
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, ClipboardList, ChevronRight, Truck, User } from 'lucide-react';
import { formatCurrencyInput } from '@/utils/currencyUtils';
import { parseCurrencyToNumber } from '@/utils/costCalculations';

interface OrdemServico {
  id: string;
  numero_os: string | null;
  empresa: string | null;
  descricao: string | null;
  cidade_origem: string | null;
  cidade_destino: string | null;
  valor_frete: number | null;
  status: string;
  motorista_id: string | null;
  veiculo_id: string | null;
  data_criacao: string | null;
  created_at: string;
}

const STATUS_FLOW: Record<string, { next: string; label: string; color: string }> = {
  criada:      { next: 'despachada',    label: 'Criada',       color: 'bg-gray-100 text-gray-800' },
  despachada:  { next: 'aceita',        label: 'Despachada',   color: 'bg-blue-100 text-blue-800' },
  aceita:      { next: 'em_execucao',   label: 'Aceita',       color: 'bg-indigo-100 text-indigo-800' },
  em_execucao: { next: 'concluida',     label: 'Em Execução',  color: 'bg-yellow-100 text-yellow-800' },
  concluida:   { next: '',             label: 'Concluída',    color: 'bg-green-100 text-green-800' },
  cancelada:   { next: '',             label: 'Cancelada',    color: 'bg-red-100 text-red-800' },
};

const NEXT_LABELS: Record<string, string> = {
  despachada: 'Despachar',
  aceita: 'Confirmar Aceite',
  em_execucao: 'Iniciar Execução',
  concluida: 'Concluir',
};

const emptyForm = {
  empresa: '',
  descricao: '',
  cidade_origem: '',
  cidade_destino: '',
  valor_frete_texto: '',
  motorista_id: '',
  veiculo_id: '',
};

const OrdensServicoTab = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ['ordens_servico', statusFilter],
    queryFn: async () => {
      let query = (supabase.from('ordens_servico' as any).select('*').order('created_at', { ascending: false }) as any);
      if (statusFilter) query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data as OrdemServico[];
    },
  });

  const { data: motoristas = [] } = useQuery({
    queryKey: ['motoristas-select'],
    queryFn: async () => {
      const { data } = await (supabase.from('motoristas' as any).select('id, nome').eq('status', 'ativo').order('nome') as any);
      return (data || []) as { id: string; nome: string }[];
    },
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ['veiculos-select'],
    queryFn: async () => {
      const { data } = await (supabase.from('veiculos' as any).select('id, placa, tipo').eq('status', 'disponivel').order('placa') as any);
      return (data || []) as { id: string; placa: string; tipo: string }[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        empresa: form.empresa || null,
        descricao: form.descricao || null,
        cidade_origem: form.cidade_origem || null,
        cidade_destino: form.cidade_destino || null,
        valor_frete: form.valor_frete_texto ? parseCurrencyToNumber(form.valor_frete_texto) : null,
        motorista_id: form.motorista_id || null,
        veiculo_id: form.veiculo_id || null,
        criado_por: user?.id || null,
        status: 'criada',
      };
      const { error } = await (supabase.from('ordens_servico' as any).insert([payload]) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens_servico'] });
      toast({ title: 'Ordem de Serviço criada!' });
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const advanceMutation = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: string }) => {
      const now = new Date().toISOString();
      const timestampField: Record<string, string> = {
        despachada: 'data_despacho',
        aceita: 'data_aceite',
        em_execucao: 'data_inicio_execucao',
        concluida: 'data_conclusao',
      };
      const update: Record<string, string> = { status: nextStatus };
      if (timestampField[nextStatus]) update[timestampField[nextStatus]] = now;
      const { error } = await (supabase.from('ordens_servico' as any).update(update).eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens_servico'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('ordens_servico' as any).update({ status: 'cancelada' }).eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens_servico'] });
      toast({ title: 'OS cancelada.' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Ordens de Serviço</h2>
          <p className="text-gray-500">{ordens.length} OS encontrada(s)</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Todos os status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {Object.entries(STATUS_FLOW).map(([val, { label }]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Nova OS</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Nova Ordem de Serviço</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label>Empresa</Label>
                    <Input value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="Nome da empresa" />
                  </div>
                  <div className="space-y-1">
                    <Label>Cidade Origem</Label>
                    <Input value={form.cidade_origem} onChange={e => setForm(p => ({ ...p, cidade_origem: e.target.value }))} placeholder="Origem" />
                  </div>
                  <div className="space-y-1">
                    <Label>Cidade Destino</Label>
                    <Input value={form.cidade_destino} onChange={e => setForm(p => ({ ...p, cidade_destino: e.target.value }))} placeholder="Destino" />
                  </div>
                  <div className="space-y-1">
                    <Label>Valor do Frete</Label>
                    <Input value={form.valor_frete_texto} onChange={e => setForm(p => ({ ...p, valor_frete_texto: formatCurrencyInput(e.target.value) }))} placeholder="R$ 0,00" />
                  </div>
                  <div className="space-y-1">
                    <Label>Motorista</Label>
                    <Select value={form.motorista_id} onValueChange={v => setForm(p => ({ ...p, motorista_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {motoristas.map(m => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Veículo</Label>
                    <Select value={form.veiculo_id} onValueChange={v => setForm(p => ({ ...p, veiculo_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {veiculos.map(v => <SelectItem key={v.id} value={v.id}>{v.placa} — {v.tipo}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Descrição</Label>
                    <Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descrição do serviço..." rows={2} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Criando...' : 'Criar OS'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : ordens.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma ordem de serviço encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ordens.map(os => {
            const info = STATUS_FLOW[os.status] || STATUS_FLOW.criada;
            const canAdvance = !!info.next;
            return (
              <Card key={os.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-blue-700">{os.numero_os || 'OS-...'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${info.color}`}>{info.label}</span>
                        {os.empresa && <span className="text-sm font-medium">{os.empresa}</span>}
                      </div>
                      {os.descricao && <p className="text-sm text-gray-600 mt-1 truncate">{os.descricao}</p>}
                      <div className="flex gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                        {os.cidade_origem && os.cidade_destino && (
                          <span>{os.cidade_origem} → {os.cidade_destino}</span>
                        )}
                        {os.valor_frete && (
                          <span className="font-medium text-green-700">R$ {os.valor_frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        )}
                        <span>{os.data_criacao ? new Date(os.data_criacao).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {canAdvance && os.status !== 'cancelada' && (
                        <Button
                          size="sm"
                          onClick={() => advanceMutation.mutate({ id: os.id, nextStatus: info.next })}
                          disabled={advanceMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ChevronRight className="h-3 w-3 mr-1" />
                          {NEXT_LABELS[info.next] || info.next}
                        </Button>
                      )}
                      {os.status !== 'concluida' && os.status !== 'cancelada' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelMutation.mutate(os.id)}
                          disabled={cancelMutation.isPending}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdensServicoTab;
