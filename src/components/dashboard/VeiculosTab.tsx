
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Truck } from 'lucide-react';

interface Veiculo {
  id: string;
  placa: string;
  tipo: string;
  marca: string | null;
  modelo: string | null;
  ano: number | null;
  capacidade_kg: number | null;
  seguro_vencimento: string | null;
  crlv_vencimento: string | null;
  status: string;
  motorista_id: string | null;
}

const statusColors: Record<string, string> = {
  disponivel: 'bg-green-100 text-green-800',
  em_servico: 'bg-blue-100 text-blue-800',
  manutencao: 'bg-yellow-100 text-yellow-800',
  inativo: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  disponivel: 'Disponível',
  em_servico: 'Em Serviço',
  manutencao: 'Manutenção',
  inativo: 'Inativo',
};

const tiposVeiculo = ['MOTO', 'CARRO', 'VUC', '3/4', 'TRUCK', 'CARRETA', 'CAM'];

const emptyForm = {
  placa: '',
  tipo: '',
  marca: '',
  modelo: '',
  ano: '',
  capacidade_kg: '',
  seguro_vencimento: '',
  crlv_vencimento: '',
  status: 'disponivel',
  motorista_id: '',
};

const VeiculosTab = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: veiculos = [], isLoading } = useQuery({
    queryKey: ['veiculos'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('veiculos' as any).select('*').order('placa') as any);
      if (error) throw error;
      return data as Veiculo[];
    },
  });

  const { data: motoristas = [] } = useQuery({
    queryKey: ['motoristas'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('motoristas' as any).select('id, nome').eq('status', 'ativo').order('nome') as any);
      if (error) throw error;
      return data as { id: string; nome: string }[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        placa: form.placa.toUpperCase(),
        tipo: form.tipo,
        marca: form.marca || null,
        modelo: form.modelo || null,
        ano: form.ano ? Number(form.ano) : null,
        capacidade_kg: form.capacidade_kg ? Number(form.capacidade_kg) : null,
        seguro_vencimento: form.seguro_vencimento || null,
        crlv_vencimento: form.crlv_vencimento || null,
        status: form.status,
        motorista_id: form.motorista_id || null,
      };
      if (editingId) {
        const { error } = await (supabase.from('veiculos' as any).update(payload).eq('id', editingId) as any);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('veiculos' as any).insert([payload]) as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos'] });
      toast({ title: editingId ? 'Veículo atualizado!' : 'Veículo cadastrado!' });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('veiculos' as any).delete().eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos'] });
      toast({ title: 'Veículo removido.' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const openEdit = (v: Veiculo) => {
    setForm({
      placa: v.placa,
      tipo: v.tipo,
      marca: v.marca || '',
      modelo: v.modelo || '',
      ano: v.ano ? String(v.ano) : '',
      capacidade_kg: v.capacidade_kg ? String(v.capacidade_kg) : '',
      seguro_vencimento: v.seguro_vencimento || '',
      crlv_vencimento: v.crlv_vencimento || '',
      status: v.status,
      motorista_id: v.motorista_id || '',
    });
    setEditingId(v.id);
    setDialogOpen(true);
  };

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.placa || !form.tipo) {
      toast({ title: 'Placa e tipo são obrigatórios.', variant: 'destructive' });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Veículos</h2>
          <p className="text-gray-500">{veiculos.length} veículo(s) cadastrado(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Placa *</Label>
                  <Input value={form.placa} onChange={e => setForm(p => ({ ...p, placa: e.target.value.toUpperCase() }))} placeholder="ABC-1234" maxLength={8} />
                </div>
                <div className="space-y-1">
                  <Label>Tipo *</Label>
                  <Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>{tiposVeiculo.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Marca</Label>
                  <Input value={form.marca} onChange={e => setForm(p => ({ ...p, marca: e.target.value }))} placeholder="Ex: Volkswagen" />
                </div>
                <div className="space-y-1">
                  <Label>Modelo</Label>
                  <Input value={form.modelo} onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))} placeholder="Ex: Delivery" />
                </div>
                <div className="space-y-1">
                  <Label>Ano</Label>
                  <Input type="number" value={form.ano} onChange={e => setForm(p => ({ ...p, ano: e.target.value }))} placeholder="2020" min={1990} max={2030} />
                </div>
                <div className="space-y-1">
                  <Label>Capacidade (kg)</Label>
                  <Input type="number" value={form.capacidade_kg} onChange={e => setForm(p => ({ ...p, capacidade_kg: e.target.value }))} placeholder="1000" />
                </div>
                <div className="space-y-1">
                  <Label>Venc. Seguro</Label>
                  <Input type="date" value={form.seguro_vencimento} onChange={e => setForm(p => ({ ...p, seguro_vencimento: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Venc. CRLV</Label>
                  <Input type="date" value={form.crlv_vencimento} onChange={e => setForm(p => ({ ...p, crlv_vencimento: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([val, lbl]) => <SelectItem key={val} value={val}>{lbl}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Motorista</Label>
                  <Select value={form.motorista_id} onValueChange={v => setForm(p => ({ ...p, motorista_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Sem motorista" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem motorista</SelectItem>
                      {motoristas.map(m => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : veiculos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum veículo cadastrado.</p>
            <Button className="mt-4" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Cadastrar primeiro veículo</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {veiculos.map(v => (
            <Card key={v.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-mono">{v.placa}</CardTitle>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[v.status] || 'bg-gray-100'}`}>
                    {statusLabels[v.status] || v.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-600">
                <div className="font-medium text-gray-800">{v.tipo}{v.marca ? ` — ${v.marca}` : ''}{v.modelo ? ` ${v.modelo}` : ''}{v.ano ? ` (${v.ano})` : ''}</div>
                {v.capacidade_kg && <div>Capacidade: {v.capacidade_kg.toLocaleString('pt-BR')} kg</div>}
                {v.crlv_vencimento && <div>CRLV: {new Date(v.crlv_vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}</div>}
                {v.seguro_vencimento && <div>Seguro: {new Date(v.seguro_vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}</div>}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(v)}><Pencil className="h-3 w-3 mr-1" />Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(v.id)} disabled={deleteMutation.isPending}><Trash2 className="h-3 w-3 mr-1" />Remover</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VeiculosTab;
