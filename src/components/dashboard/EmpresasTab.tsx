import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, ExternalLink, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import EmpresaDetail from './EmpresaDetail';

const EmpresasTab = () => {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<{ id: string; nome: string } | null>(null);
  const { isAdmin } = usePermissions();
  const queryClient = useQueryClient();

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('empresas').select('*').order('nome');
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase.from('empresas').insert({ nome: nome.trim().toUpperCase() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setCreateOpen(false);
      setNewName('');
      toast({ title: 'Empresa criada com sucesso!' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao criar empresa', description: err.message, variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: string; ativa: boolean }) => {
      const { error } = await supabase.from('empresas').update({ ativa }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({ title: 'Status atualizado!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('empresas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({ title: 'Empresa excluída com sucesso!' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao excluir empresa', description: err.message, variant: 'destructive' });
    },
  });

  const filtered = empresas.filter((e: any) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  // If a company is selected, show its detail page
  if (selectedEmpresa) {
    return (
      <EmpresaDetail
        empresaId={selectedEmpresa.id}
        empresaNome={selectedEmpresa.nome}
        onBack={() => setSelectedEmpresa(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Empresas</h2>
          <p className="text-sm text-slate-500">{empresas.length} empresas cadastradas</p>
        </div>
        {isAdmin && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Empresa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input
                  placeholder="Nome da empresa"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newName.trim() && createMutation.mutate(newName)}
                />
                <Button
                  className="w-full"
                  disabled={!newName.trim() || createMutation.isPending}
                  onClick={() => createMutation.mutate(newName)}
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Empresa'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((empresa: any) => (
            <Card
              key={empresa.id}
              className={`group hover:shadow-md transition-all cursor-pointer border ${
                empresa.ativa ? 'border-slate-200' : 'border-slate-100 opacity-60'
              }`}
              onClick={() => setSelectedEmpresa({ id: empresa.id, nome: empresa.nome })}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge variant={empresa.ativa ? 'default' : 'secondary'} className="text-xs">
                    {empresa.ativa ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-800 truncate">{empresa.nome}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400">
                    Desde {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMutation.mutate({ id: empresa.id, ativa: !empresa.ativa });
                    }}
                  >
                    {empresa.ativa ? (
                      <><ToggleRight className="h-3.5 w-3.5 mr-1" /> Desativar</>
                    ) : (
                      <><ToggleLeft className="h-3.5 w-3.5 mr-1" /> Ativar</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              Nenhuma empresa encontrada.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmpresasTab;
