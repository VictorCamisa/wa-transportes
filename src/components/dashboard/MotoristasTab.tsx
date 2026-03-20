
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, User, Phone, IdCard } from 'lucide-react';

interface Motorista {
  id: string;
  nome: string;
  cnh: string;
  categoria_cnh: string;
  vencimento_cnh: string;
  telefone: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-gray-100 text-gray-800',
  ferias: 'bg-blue-100 text-blue-800',
  afastado: 'bg-yellow-100 text-yellow-800',
};

const emptyForm = {
  nome: '',
  cnh: '',
  categoria_cnh: '',
  vencimento_cnh: '',
  telefone: '',
  status: 'ativo',
};

const MotoristasTab = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: motoristas = [], isLoading } = useQuery({
    queryKey: ['motoristas'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('motoristas' as any).select('*').order('nome') as any);
      if (error) throw error;
      return data as Motorista[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await (supabase.from('motoristas' as any).update(form).eq('id', editingId) as any);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('motoristas' as any).insert([form]) as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
      toast({ title: editingId ? 'Motorista atualizado!' : 'Motorista cadastrado!' });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (e: any) => {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('motoristas' as any).delete().eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
      toast({ title: 'Motorista removido.' });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao remover', description: e.message, variant: 'destructive' });
    },
  });

  const openEdit = (m: Motorista) => {
    setForm({
      nome: m.nome,
      cnh: m.cnh,
      categoria_cnh: m.categoria_cnh,
      vencimento_cnh: m.vencimento_cnh,
      telefone: m.telefone || '',
      status: m.status,
    });
    setEditingId(m.id);
    setDialogOpen(true);
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cnh || !form.categoria_cnh || !form.vencimento_cnh) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha nome, CNH, categoria e vencimento.', variant: 'destructive' });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Motoristas</h2>
          <p className="text-gray-500">{motoristas.length} motorista(s) cadastrado(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Motorista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Motorista' : 'Novo Motorista'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <Label>Nome *</Label>
                  <Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="Nome completo" />
                </div>
                <div className="space-y-1">
                  <Label>CNH *</Label>
                  <Input value={form.cnh} onChange={e => setForm(p => ({ ...p, cnh: e.target.value }))} placeholder="Número da CNH" />
                </div>
                <div className="space-y-1">
                  <Label>Categoria *</Label>
                  <Select value={form.categoria_cnh} onValueChange={v => setForm(p => ({ ...p, categoria_cnh: v }))}>
                    <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Vencimento CNH *</Label>
                  <Input type="date" value={form.vencimento_cnh} onChange={e => setForm(p => ({ ...p, vencimento_cnh: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={e => setForm(p => ({ ...p, telefone: e.target.value }))} placeholder="(11) 99999-9999" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="afastado">Afastado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : motoristas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum motorista cadastrado.</p>
            <Button className="mt-4" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Cadastrar primeiro motorista</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {motoristas.map(m => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{m.nome}</CardTitle>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[m.status] || 'bg-gray-100'}`}>
                    {m.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1"><IdCard className="h-3 w-3" /> CNH {m.cnh} — Cat. {m.categoria_cnh}</div>
                <div>Vence: {new Date(m.vencimento_cnh + 'T12:00:00').toLocaleDateString('pt-BR')}</div>
                {m.telefone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{m.telefone}</div>}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil className="h-3 w-3 mr-1" />Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(m.id)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-3 w-3 mr-1" />Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MotoristasTab;
