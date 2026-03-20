
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

    // Validate username
    const usernameValidation = validateTextInput(formData.username, 50);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error!;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validate password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateUniqueUsername = async (baseUsername: string): Promise<string> => {
    let username = sanitizeInput(baseUsername.toLowerCase().replace(/\s+/g, ''));
    let counter = 1;
    
    while (true) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (!existingProfile) {
        return username;
      }
      
      username = `${sanitizeInput(baseUsername.toLowerCase().replace(/\s+/g, ''))}${counter}`;
      counter++;
      
      if (counter > 100) {
        throw new Error('Não foi possível gerar um username único');
      }
    }
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
      console.log('Criando usuário via signup:', formData);

      const uniqueUsername = await generateUniqueUsername(formData.username);
      
      // Configurar URL de redirecionamento segura
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: uniqueUsername,
            role: formData.role
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        
        // Melhor tratamento de erros específicos
        let errorMessage = 'Erro inesperado ao criar usuário';
        if (authError.message.includes('already registered')) {
          errorMessage = 'Este email já está registrado no sistema';
        } else if (authError.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        } else if (authError.message.includes('Password')) {
          errorMessage = 'Senha não atende aos critérios de segurança';
        }
        
        throw new Error(errorMessage);
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado corretamente');
      }

      console.log('Usuário criado:', authData.user);

      await new Promise(resolve => setTimeout(resolve, 1000));

      let profileExists = false;
      for (let i = 0; i < 5; i++) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();
        
        if (existingProfile) {
          profileExists = true;
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!profileExists) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: uniqueUsername,
            email: formData.email,
            role: formData.role
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw new Error(`Erro ao criar perfil: ${profileError.message}`);
        }
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: uniqueUsername,
            role: formData.role
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Erro ao atualizar perfil:', updateError);
        }
      }

      if (selectedPermissions.length > 0) {
        const permissionsData = selectedPermissions.map(permission => ({
          user_id: authData.user.id,
          permission: permission,
          granted_by: currentUser.id
        }));

        const { error: permissionsError } = await supabase
          .from('user_permissions')
          .insert(permissionsData);

        if (permissionsError) {
          console.error('Erro ao adicionar permissões:', permissionsError);
          toast({
            title: "Usuário criado com aviso",
            description: `Usuário ${uniqueUsername} foi criado, mas houve erro ao adicionar algumas permissões.`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Usuário criado com sucesso!",
        description: `Usuário ${uniqueUsername} foi criado com email ${formData.email}.`,
      });

      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
      setSelectedPermissions([]);

      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
      
      onUserCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Erro completo:', error);
      
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
              )}
              <p className="text-xs text-gray-500">
                O sistema gerará automaticamente um username único se necessário
              </p>
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
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
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
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              O usuário poderá fazer login com esta senha
            </p>
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
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {permission.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {permission.description}
                    </p>
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
      </DialogContent>
    </ProtectedComponent>
  );
};

export default UserForm;
