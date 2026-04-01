import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import EditCostDialog from './EditCostDialog';
import CostFiltersAndPDF from './CostFiltersAndPDF';
import CostForm from './CostForm';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface CostData {
  id: string;
  descricao: string;
  data_vencimento: string;
  valor_texto: string;
  valor_numerico: number;
  forma_pagamento: string;
  tipo: string;
  categoria?: string;
  created_at: string;
}

const ViewCosts = () => {
  const { profile } = useAuth();
  const { isAdmin, hasPermission } = usePermissions();
  const [editingCost, setEditingCost] = useState<CostData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCostFormOpen, setIsCostFormOpen] = useState(false);

  const { data: costs, isLoading, refetch } = useQuery({
    queryKey: ['costs'],
    queryFn: async () => {
      console.log('Buscando custos...');
      const { data, error } = await (supabase
        .from('custos' as any)
        .select('*')
        .order('data_vencimento', { ascending: false }) as any);

      if (error) {
        console.error('Erro ao buscar custos:', error);
        throw error;
      }

      console.log('Custos encontrados:', data);
      return data as CostData[];
    }
  });

  const handleEdit = (cost: CostData) => {
    setEditingCost(cost);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (costId: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) return;

    try {
      const { error } = await (supabase
        .from('custos' as any)
        .delete()
        .eq('id', costId) as any);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Custo excluído com sucesso.",
      });

      refetch();
    } catch (error) {
      console.error('Erro ao excluir custo:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o custo.",
        variant: "destructive"
      });
    }
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingCost(null);
  };

  const handleEditUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custos</CardTitle>
          <CardDescription>Lista de todos os custos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!costs || costs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custos</CardTitle>
          <CardDescription>Lista de todos os custos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Nenhum custo encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString);
  };

  const getTypeBadge = (tipo: string) => {
    return tipo === 'Fixo' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
  };

  const getCategoryBadge = (categoria?: string) => {
    if (!categoria) return 'bg-gray-100 text-gray-800';
    return categoria === 'WA' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão de ação */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Custos</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie os custos da empresa</p>
        </div>
        {(isAdmin || hasPermission('costs_create')) && (
          <Button onClick={() => setIsCostFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Custo
          </Button>
        )}
      </div>

      {/* Filtros e Relatório PDF */}
      <CostFiltersAndPDF />
      
      {/* Lista de todos os custos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Custos ({costs?.length || 0})</CardTitle>
          <CardDescription>Lista completa de todos os custos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                     <TableHead className="text-right">Valor</TableHead>
                     <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs?.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">
                      {formatDate(cost.data_vencimento)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={cost.descricao}>
                      {cost.descricao}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(cost.tipo)}>
                        {cost.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cost.categoria && (
                        <Badge className={getCategoryBadge(cost.categoria)}>
                          {cost.categoria}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{cost.forma_pagamento}</TableCell>
                    <TableCell className="text-right font-medium">
                      {cost.valor_texto}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cost)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cost.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingCost && (
        <EditCostDialog
          cost={editingCost}
          open={isEditDialogOpen}
          onClose={handleEditClose}
          onUpdate={handleEditUpdate}
        />
      )}

      <Dialog open={isCostFormOpen} onOpenChange={setIsCostFormOpen}>
        {isCostFormOpen && (
          <CostForm onClose={() => { setIsCostFormOpen(false); refetch(); }} />
        )}
      </Dialog>
    </div>
  );
};

export default ViewCosts;
