
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
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { formatCurrencyInput } from '@/utils/currencyUtils';
import { parseCurrencyToNumber } from '@/utils/costCalculations';

interface TabelaPreco {
  id: string;
  empresa: string | null;
  tipo_veiculo: string;
  cidade_origem: string;
  cidade_destino: string;
  valor_base: number;
  ativo: boolean;
}

const tiposVeiculo = ['MOTO', 'CARRO', 'VUC', '3/4', 'TRUCK', 'CARRETA', 'CAM'];

const emptyForm = {
  empresa: '',
  tipo_veiculo: '',
  cidade_origem: '',
  cidade_destino: '',
  valor_base_texto: '',
  ativo: true,
};

const TabelaPrecosTab = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const { data: precos = [], isLoading } = useQuery({
    queryKey: ['tabela_precos'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('tabela_precos' as any).select('*').order('cidade_origem').order('cidade_destino') as any);
      if (error) throw error;
      return data as TabelaPreco[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        empresa: form.empresa || null,
        tipo_veiculo: form.tipo_veiculo,
        cidade_origem: form.cidade_origem,
        cidade_destino: form.cidade_destino,
        valor_base: parseCurrencyToNumber(form.valor_base_texto),
        ativo: form.ativo,
      };
      if (editingId) {
        const { error } = await (supabase.from('tabela_precos' as any).update(payload).eq('id', editingId) as any);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('tabela_precos' as any).insert([payload]) as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabela_precos'] });
      toast({ title: editingId ? 'Preço atualizado!' : 'Preço cadastrado!' });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('tabela_precos' as any).delete().eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabela_precos'] });
      toast({ title: 'Registro removido.' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const openEdit = (p: TabelaPreco) => {
    setForm({
      empresa: p.empresa || '',
      tipo_veiculo: p.tipo_veiculo,
      cidade_origem: p.cidade_origem,
      cidade_destino: p.cidade_destino,
      valor_base_texto: `R$ ${p.valor_base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      ativo: p.ativo,
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo_veiculo || !form.cidade_origem || !form.cidade_destino || !form.valor_base_texto) {
      toast({ title: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }
    saveMutation.mutate();
  };

  const filtered = precos.filter(p =>
    !search ||
    p.cidade_origem.toLowerCase().includes(search.toLowerCase()) ||
    p.cidade_destino.toLowerCase().includes(search.toLowerCase()) ||
    (p.empresa || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Tabela de Preços</h2>
          <p className="text-gray-500">{precos.length} regra(s) de preço cadastrada(s)</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Buscar por cidade ou empresa..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Preço</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingId ? 'Editar Preço' : 'Novo Preço'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label>Empresa (deixe vazio para regra global)</Label>
                    <Input value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="Nome da empresa ou vazio para todas" />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo de Veículo *</Label>
                    <Select value={form.tipo_veiculo} onValueChange={v => setForm(p => ({ ...p, tipo_veiculo: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                      <SelectContent>{tiposVeiculo.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Valor Base (R$) *</Label>
                    <Input
                      value={form.valor_base_texto}
                      onChange={e => setForm(p => ({ ...p, valor_base_texto: formatCurrencyInput(e.target.value) }))}
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Cidade Origem *</Label>
                    <Input value={form.cidade_origem} onChange={e => setForm(p => ({ ...p, cidade_origem: e.target.value }))} placeholder="Cidade de origem" />
                  </div>
                  <div className="space-y-1">
                    <Label>Cidade Destino *</Label>
                    <Input value={form.cidade_destino} onChange={e => setForm(p => ({ ...p, cidade_destino: e.target.value }))} placeholder="Cidade de destino" />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="ativo" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} />
                    <Label htmlFor="ativo">Regra ativa</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{search ? 'Nenhum resultado para a busca.' : 'Nenhuma regra de preço cadastrada.'}</p>
            {!search && <Button className="mt-4" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Cadastrar primeiro preço</Button>}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">Empresa</th>
                    <th className="text-left p-3 font-medium text-gray-600">Veículo</th>
                    <th className="text-left p-3 font-medium text-gray-600">Origem</th>
                    <th className="text-left p-3 font-medium text-gray-600">Destino</th>
                    <th className="text-right p-3 font-medium text-gray-600">Valor Base</th>
                    <th className="text-center p-3 font-medium text-gray-600">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">{p.empresa || <span className="text-gray-400 italic">Global</span>}</td>
                      <td className="p-3"><span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{p.tipo_veiculo}</span></td>
                      <td className="p-3">{p.cidade_origem}</td>
                      <td className="p-3">{p.cidade_destino}</td>
                      <td className="p-3 text-right font-medium text-green-700">R$ {p.valor_base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                          {p.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TabelaPrecosTab;
