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
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import EditServiceDialog from './EditServiceDialog';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface ServiceData {
  id: string;
  data_servico: string;
  ct_e: string;
  nf: string;
  empresa: string;
  solicitante: string;
  servico: string;
  cidade: string;
  tipo_veiculo: string;
  veiculo: string;
  motorista: string;
  valor_texto: string;
  valor_numerico: number;
  frete: string;
  seguro: string;
  created_at: string;
}

interface ServicesTableProps {
  data: ServiceData[] | null;
  loading: boolean;
  onRefresh?: () => void;
}

const ServicesTable = ({ data, loading, onRefresh }: ServicesTableProps) => {
  const { profile } = useAuth();
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (service: ServiceData) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await (supabase
        .from('servicos_maio' as any)
        .delete()
        .eq('id', serviceId) as any);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Serviço excluído com sucesso.",
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o serviço.",
        variant: "destructive"
      });
    }
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingService(null);
  };

  const handleEditUpdate = () => {
    if (onRefresh) onRefresh();
  };

  // Todos os usuários autenticados podem editar/excluir serviços
  const canEditDelete = true;

  console.log('ServicesTable - canEditDelete:', canEditDelete, 'profile:', profile);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
          <CardDescription>Lista de todos os serviços registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
          <CardDescription>Lista de todos os serviços registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Nenhum serviço encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString);
  };

  const getVehicleTypeBadge = (tipo: string) => {
    const colors = {
      'MOTO': 'bg-blue-100 text-blue-800',
      'CARRO': 'bg-green-100 text-green-800',
      'VUC': 'bg-orange-100 text-orange-800',
      '3/4': 'bg-purple-100 text-purple-800',
      'TRUCK': 'bg-red-100 text-red-800',
      'CARRETA': 'bg-gray-100 text-gray-800',
      'CAM': 'bg-yellow-100 text-yellow-800',
    };
    
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Serviços ({data.length})</CardTitle>
          <CardDescription>Lista de todos os serviços registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Data</TableHead>
                  <TableHead>CT-e</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="max-w-[200px]">Serviço</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Tipo Veículo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Frete</TableHead>
                  <TableHead>Seguro</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  {canEditDelete && (
                    <TableHead className="text-center">Ações</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {formatDate(service.data_servico)}
                    </TableCell>
                    <TableCell>
                      {service.ct_e && (
                        <Badge variant="outline" className="text-xs">
                          {service.ct_e}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{service.empresa}</TableCell>
                    <TableCell>{service.solicitante || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={service.servico}>
                      {service.servico || '-'}
                    </TableCell>
                    <TableCell>{service.cidade || '-'}</TableCell>
                    <TableCell>
                      {service.tipo_veiculo && (
                        <Badge className={getVehicleTypeBadge(service.tipo_veiculo)}>
                          {service.tipo_veiculo}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{service.motorista || '-'}</TableCell>
                    <TableCell>{service.frete || '-'}</TableCell>
                    <TableCell>{service.seguro || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {service.valor_texto}
                    </TableCell>
                    {canEditDelete && (
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingService && (
        <EditServiceDialog
          service={editingService}
          open={isEditDialogOpen}
          onClose={handleEditClose}
          onUpdate={handleEditUpdate}
        />
      )}
    </>
  );
};

export default ServicesTable;
