import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { validateTextInput, sanitizeInput } from '@/utils/inputValidation';
import ProtectedComponent from '@/components/ProtectedComponent';

interface UserFormProps {
  onClose: () => void;
  onUserCreated?: () => void;
}

const availablePermissions = [
  { id: 'dashboard_view', label: 'Visualizar Dashboard', description: 'Permite ver o dashboard principal' },
  { id: 'services_create', label: 'Criar Serviços', description: 'Permite lançar novos serviços' },
  { id: 'services_view', label: 'Visualizar Serviços', description: 'Permite ver a lista de serviços' },
  { id: 'costs_create', label: 'Criar Custos', description: 'Permite cadastrar novos custos' },
  { id: 'costs_view', label: 'Visualizar Custos', description: 'Permite ver a lista de custos' },
  { id: 'checklist_access', label: 'Acessar Checklist', description: 'Permite acessar o checklist' },
  { id: 'users_manage', label: 'Gerenciar Usuários', description: 'Permite criar e gerenciar usuários' },
];

const UserForm = ({ onClose, onUserCreated }: UserFormProps) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    const usernameValidation = validateTextInput(formData.username, 50);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error!;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const username = sanitizeInput(formData.username.trim());

      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          username,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
          permissions: selectedPermissions,
        },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao criar usuário');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Usuário criado com sucesso!",
        description: `Usuário ${username} foi criado com email ${formData.email}.`,
      });

      setFormData({ username: '', email: '', password: '', role: 'user' });
      setSelectedPermissions([]);

      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
      
      onUserCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  return (
    <ProtectedComponent requireAdmin={true}>
      <DialogHeader>
        <DialogTitle>Criar Novo Usuário</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
              placeholder="Ex: joão.silva"
              maxLength={50}
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="usuario@exemplo.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            placeholder="Senha para o usuário"
            minLength={6}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Permissões do Sistema</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor={permission.id} className="text-sm font-medium leading-none cursor-pointer">
                    {permission.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> O usuário será criado no sistema com as permissões selecionadas. 
            Ele poderá fazer login imediatamente usando o email e senha fornecidos.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando usuário...' : 'Criar Usuário'}
          </Button>
        </DialogFooter>
      </form>
    </ProtectedComponent>
  );
};

export default UserForm;
