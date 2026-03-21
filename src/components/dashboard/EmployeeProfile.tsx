import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, Save, Mail, Phone, UserCog, Calendar, Shield, 
  FileText, Activity, BarChart3, Upload, Trash2, AlertCircle
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const ALL_PERMISSIONS = [
  { id: 'dashboard_view', label: 'Visualizar Dashboard', group: 'Dashboard' },
  { id: 'services_create', label: 'Criar Serviços', group: 'Serviços' },
  { id: 'services_view', label: 'Visualizar Serviços', group: 'Serviços' },
  { id: 'costs_create', label: 'Criar Custos', group: 'Custos' },
  { id: 'costs_view', label: 'Visualizar Custos', group: 'Custos' },
  { id: 'checklist_access', label: 'Acessar Checklist', group: 'Operacional' },
  { id: 'users_manage', label: 'Gerenciar Usuários', group: 'Administração' },
];

interface EmployeeProfileProps {
  userId: string;
  onBack: () => void;
}

const EmployeeProfile = ({ userId, onBack }: EmployeeProfileProps) => {
  const { isAdmin } = usePermissions();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [permissionChanges, setPermissionChanges] = useState<string[] | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['employee-profile', userId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('profiles') as any)
        .select(`
          id, username, email, created_at, updated_at, status, phone, position, avatar_url,
          user_permissions ( id, permission ),
          user_roles ( id, role )
        `)
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: documents } = useQuery({
    queryKey: ['employee-documents', userId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('employee_documents') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: activityLogs } = useQuery({
    queryKey: ['employee-activity', userId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('activity_logs') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: stats } = useQuery({
    queryKey: ['employee-stats', userId],
    queryFn: async () => {
      const [servicos, custos] = await Promise.all([
        (supabase.from('servicos_maio') as any).select('id', { count: 'exact', head: true }),
        (supabase.from('custos_maio') as any).select('id', { count: 'exact', head: true }),
      ]);
      return {
        totalServicos: servicos.count || 0,
        totalCustos: custos.count || 0,
      };
    },
    enabled: !!userId,
  });

  const handleSaveProfile = async () => {
    if (!editData || !isAdmin) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({
          username: editData.username,
          phone: editData.phone,
          position: editData.position,
          status: editData.status,
        })
        .eq('id', userId);

      if (error) throw error;

      // Save permissions if changed
      if (permissionChanges !== null) {
        // Delete existing
        await (supabase.from('user_permissions') as any)
          .delete()
          .eq('user_id', userId);

        // Insert new
        if (permissionChanges.length > 0) {
          const permsToInsert = permissionChanges.map(p => ({
            user_id: userId,
            permission: p,
            granted_by: currentUser?.id,
          }));
          const { error: permError } = await (supabase.from('user_permissions') as any)
            .insert(permsToInsert);
          if (permError) throw permError;
        }
      }

      toast({ title: 'Perfil atualizado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['employee-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      setEditData(null);
      setPermissionChanges(null);
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddDocument = async (type: string, number: string, expiryDate: string) => {
    const { error } = await (supabase.from('employee_documents') as any)
      .insert({ user_id: userId, document_type: type, document_number: number, expiry_date: expiryDate || null });
    if (error) {
      toast({ title: 'Erro ao adicionar documento', variant: 'destructive' });
    } else {
      toast({ title: 'Documento adicionado!' });
      queryClient.invalidateQueries({ queryKey: ['employee-documents', userId] });
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    const { error } = await (supabase.from('employee_documents') as any)
      .delete()
      .eq('id', docId);
    if (error) {
      toast({ title: 'Erro ao remover documento', variant: 'destructive' });
    } else {
      toast({ title: 'Documento removido!' });
      queryClient.invalidateQueries({ queryKey: ['employee-documents', userId] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  const isEditing = editData !== null;
  const currentData = isEditing ? editData : profile;
  const userPerms = permissionChanges !== null 
    ? permissionChanges 
    : (profile.user_permissions?.map((p: any) => p.permission) || []);
  const isAdminUser = profile.user_roles?.some((r: any) => r.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-800">{profile.username || profile.email}</h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdminUser && <Badge className="bg-amber-100 text-amber-800 border-amber-200">Admin</Badge>}
          <Badge variant="outline" className={
            (profile.status || 'active') === 'active' 
              ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
              : 'text-slate-500 border-slate-200'
          }>
            {(profile.status || 'active') === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="dados" className="text-xs sm:text-sm">Dados</TabsTrigger>
          <TabsTrigger value="permissoes" className="text-xs sm:text-sm">Permissões</TabsTrigger>
          <TabsTrigger value="documentos" className="text-xs sm:text-sm">Documentos</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs sm:text-sm">Histórico</TabsTrigger>
          <TabsTrigger value="estatisticas" className="text-xs sm:text-sm">Estatísticas</TabsTrigger>
        </TabsList>

        {/* TAB: Dados Pessoais */}
        <TabsContent value="dados">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Informações do Funcionário</CardTitle>
              {isAdmin && !isEditing && (
                <Button size="sm" variant="outline" onClick={() => setEditData({
                  username: profile.username,
                  phone: profile.phone || '',
                  position: profile.position || '',
                  status: profile.status || 'active',
                })}>
                  Editar
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditData(null); setPermissionChanges(null); }}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  {isEditing ? (
                    <Input value={currentData.username} onChange={e => setEditData({ ...editData, username: e.target.value })} />
                  ) : (
                    <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded">{profile.username || '—'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" /> {profile.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  {isEditing ? (
                    <Input value={currentData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="(11) 99999-9999" />
                  ) : (
                    <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" /> {profile.phone || '—'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  {isEditing ? (
                    <Input value={currentData.position} onChange={e => setEditData({ ...editData, position: e.target.value })} placeholder="Ex: Motorista, Auxiliar" />
                  ) : (
                    <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-slate-400" /> {profile.position || '—'}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Criado em</Label>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Última atualização</Label>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Permissões */}
        <TabsContent value="permissoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Permissões do Sistema</CardTitle>
              {isAdmin && permissionChanges !== null && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPermissionChanges(null)}>Cancelar</Button>
                  <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" /> Salvar
                  </Button>
                </div>
              )}
              {isAdmin && permissionChanges === null && (
                <Button size="sm" variant="outline" onClick={() => {
                  setPermissionChanges(profile.user_permissions?.map((p: any) => p.permission) || []);
                  if (!editData) setEditData({
                    username: profile.username,
                    phone: profile.phone || '',
                    position: profile.position || '',
                    status: profile.status || 'active',
                  });
                }}>
                  Editar Permissões
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isAdminUser && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-700">Este usuário é Administrador e possui acesso total ao sistema.</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_PERMISSIONS.map(perm => {
                  const isActive = userPerms.includes(perm.id);
                  const canEdit = permissionChanges !== null && isAdmin;
                  return (
                    <div
                      key={perm.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isActive ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {canEdit ? (
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPermissionChanges([...(permissionChanges || []), perm.id]);
                            } else {
                              setPermissionChanges((permissionChanges || []).filter(p => p !== perm.id));
                            }
                          }}
                        />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-700">{perm.label}</p>
                        <p className="text-xs text-slate-400">{perm.group}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Documentos */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Documentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin && <DocumentForm onSubmit={handleAddDocument} />}
              {documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc: any) => {
                    const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
                    return (
                      <div key={doc.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isExpired ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}>
                        <FileText className={`h-5 w-5 ${isExpired ? 'text-red-500' : 'text-slate-400'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{doc.document_type}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            {doc.document_number && <span>Nº {doc.document_number}</span>}
                            {doc.expiry_date && (
                              <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                                {isExpired && <AlertCircle className="h-3 w-3 inline mr-1" />}
                                Validade: {new Date(doc.expiry_date).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="h-10 w-10 mx-auto mb-2" />
                  <p>Nenhum documento cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Histórico */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-3">
                  {activityLogs.map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Activity className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{log.action}</p>
                        <p className="text-xs text-slate-400">
                          {log.entity_type} • {new Date(log.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Activity className="h-10 w-10 mx-auto mb-2" />
                  <p>Nenhuma atividade registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Estatísticas */}
        <TabsContent value="estatisticas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800">{stats?.totalServicos || 0}</p>
                  <p className="text-sm text-slate-500">Serviços no sistema</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800">{stats?.totalCustos || 0}</p>
                  <p className="text-sm text-slate-500">Custos no sistema</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sub-component: Document Form
const DocumentForm = ({ onSubmit }: { onSubmit: (type: string, number: string, expiry: string) => void }) => {
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4 mr-2" /> Adicionar Documento
      </Button>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Tipo do Documento</Label>
          <Input value={type} onChange={e => setType(e.target.value)} placeholder="Ex: CNH, RG, CRLV" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Número</Label>
          <Input value={number} onChange={e => setNumber(e.target.value)} placeholder="Número do documento" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Validade</Label>
          <Input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { onSubmit(type, number, expiry); setType(''); setNumber(''); setExpiry(''); setOpen(false); }} disabled={!type}>
          Salvar
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
