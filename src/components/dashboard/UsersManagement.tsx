import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Search, Plus, UserCog, Mail, Calendar, Shield, 
  MoreHorizontal, ChevronRight, Users, UserCheck, UserX, Trash2 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserForm from '@/components/dashboard/UserForm';
import EmployeeProfile from '@/components/dashboard/EmployeeProfile';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/hooks/use-toast';

interface UserWithPermissions {
  id: string;
  username: string;
  email: string;
  created_at: string;
  status?: string;
  phone?: string;
  position?: string;
  avatar_url?: string;
  user_permissions: { permission: string }[];
  user_roles?: { role: string }[];
}

const UsersManagement = () => {
  const { isAdmin } = usePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, username, email, created_at, status, phone, position, avatar_url,
          user_permissions ( permission ),
          user_roles ( role )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as UserWithPermissions[];
    }
  });

  const filteredUsers = users?.filter(u => {
    const matchSearch = !search || 
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchSearch && matchStatus;
  }) || [];

  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => (u.status || 'active') === 'active').length || 0,
    inactive: users?.filter(u => u.status === 'inactive').length || 0,
    admins: users?.filter(u => u.user_roles?.some(r => r.role === 'admin')).length || 0,
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase.from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);
    
    if (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } else {
      toast({ title: `Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'}` });
      refetch();
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: deleteUserId },
      });
      if (error || data?.error) {
        toast({ title: data?.error || 'Erro ao excluir usuário', variant: 'destructive' });
      } else {
        toast({ title: 'Usuário excluído com sucesso' });
        refetch();
      }
    } catch {
      toast({ title: 'Erro ao excluir usuário', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  const getRoleBadge = (user: UserWithPermissions) => {
    const isAdminUser = user.user_roles?.some(r => r.role === 'admin');
    if (isAdminUser) return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Admin</Badge>;
    return <Badge variant="secondary" className="text-xs">Usuário</Badge>;
  };

  if (selectedUserId) {
    return (
      <EmployeeProfile 
        userId={selectedUserId} 
        onBack={() => setSelectedUserId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Equipe</h2>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie funcionários, permissões e documentos</p>
        </div>
        {isAdmin && (
          <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <UserForm onClose={() => { setIsUserFormOpen(false); refetch(); }} onUserCreated={() => refetch()} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Ativos', value: stats.active, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Inativos', value: stats.inactive, icon: UserX, color: 'text-slate-500 bg-slate-50' },
          { label: 'Admins', value: stats.admins, icon: Shield, color: 'text-amber-600 bg-amber-50' },
        ].map(stat => (
          <Card key={stat.label} className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, email ou cargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'Todos' : s === 'active' ? 'Ativos' : 'Inativos'}
            </Button>
          ))}
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum funcionário encontrado</p>
            <p className="text-sm text-slate-400 mt-1">Ajuste os filtros ou cadastre um novo</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map(user => {
            const userStatus = user.status || 'active';
            return (
              <Card 
                key={user.id} 
                className={`border-slate-200 hover:border-slate-300 transition-colors cursor-pointer ${
                  userStatus === 'inactive' ? 'opacity-60' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-700">
                        {(user.username || user.email)?.[0]?.toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800 truncate">{user.username || 'Sem nome'}</p>
                        {getRoleBadge(user)}
                        <Badge 
                          variant="outline" 
                          className={userStatus === 'active' 
                            ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
                            : 'text-slate-500 border-slate-200'
                          }
                        >
                          {userStatus === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        {user.position && (
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <UserCog className="h-3 w-3" />
                            {user.position}
                          </span>
                        )}
                        <span className="text-sm text-slate-400 flex items-center gap-1 hidden md:flex">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Permissions count */}
                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                      <Shield className="h-4 w-4" />
                      {user.user_permissions?.length || 0} permissões
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); setSelectedUserId(user.id); }}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Ver perfil completo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); handleToggleStatus(user.id, userStatus); }}>
                              {userStatus === 'active' ? (
                                <><UserX className="h-4 w-4 mr-2" />Desativar</>
                              ) : (
                                <><UserCheck className="h-4 w-4 mr-2" />Ativar</>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
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

export default UsersManagement;
