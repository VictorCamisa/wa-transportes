
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UsersList = () => {
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users-with-permissions'],
    queryFn: async () => {
      console.log('Buscando usuários e permissões...');
      
      // Buscar perfis de usuários com suas permissões - especificando o relacionamento correto
      const { data: profiles, error: profilesError } = await (supabase
        .from('profiles') as any)
        .select(`
          id,
          username,
          email,
          created_at,
          user_permissions (
            permission
          )
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        throw profilesError;
      }

      console.log('Perfis encontrados:', profiles);
      return profiles;
    }
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPermissionName = (permission: string) => {
    const permissionMap: { [key: string]: string } = {
      'dashboard_view': 'Dashboard',
      'services_create': 'Criar Serviços',
      'services_view': 'Ver Serviços',
      'costs_create': 'Criar Custos',
      'costs_view': 'Ver Custos',
      'checklist_access': 'Checklist',
      'users_manage': 'Gerenciar Usuários'
    };
    return permissionMap[permission] || permission;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        {users && users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome de Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">
                      Usuário
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.user_permissions && user.user_permissions.length > 0 ? (
                        user.user_permissions.map((perm, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {formatPermissionName(perm.permission)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Nenhuma permissão</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Ativo
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center p-4">Nenhum usuário encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
