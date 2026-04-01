import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2, Save, Shield, Lock,
  Eye, EyeOff, CheckCircle
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Configurações</h2>
        <p className="text-sm text-slate-500 mt-0.5">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="empresa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="empresa" className="text-xs sm:text-sm gap-1">
            <Building2 className="h-3.5 w-3.5" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="text-xs sm:text-sm gap-1">
            <Shield className="h-3.5 w-3.5" /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <CompanySettings />
        </TabsContent>
        <TabsContent value="seguranca">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ─── Company Settings ───
const CompanySettings = () => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('company_settings') as any)
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const [form, setForm] = useState<any>(null);

  React.useEffect(() => {
    if (settings && !form) {
      setForm({ ...settings });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!form || !settings) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from('company_settings') as any)
        .update({
          name: form.name,
          cnpj: form.cnpj,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
        })
        .eq('id', settings.id);
      if (error) throw error;
      toast({ title: 'Dados da empresa atualizados!' });
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !form) {
    return <Card><CardContent className="p-6"><p className="text-slate-500">Carregando...</p></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados da Empresa</CardTitle>
        <CardDescription>Informações cadastrais da empresa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input value={form.cnpj || ''} onChange={e => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Rua, número, bairro" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Input value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="SP" />
          </div>
          <div className="space-y-2">
            <Label>CEP</Label>
            <Input value={form.zip_code || ''} onChange={e => setForm({ ...form, zip_code: e.target.value })} placeholder="00000-000" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Security Settings ───
const SecuritySettings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Senhas não coincidem', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: 'Erro ao alterar senha', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Segurança</CardTitle>
        <CardDescription>Altere sua senha e gerencie a segurança da conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <Label>Alterar Senha</Label>
            <Button variant="ghost" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Nova Senha</Label>
              <Input 
                type={showPasswords ? 'text' : 'password'} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Nova senha"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Confirmar Nova Senha</Label>
              <Input 
                type={showPasswords ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>
          <Button onClick={handleChangePassword} disabled={saving || !newPassword}>
            <Lock className="h-4 w-4 mr-2" />
            {saving ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">Sessão ativa</p>
              <p className="text-xs text-slate-500">Conectado como {user?.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default SettingsPage;
