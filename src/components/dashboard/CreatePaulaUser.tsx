
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

const CreatePaulaUser = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const createPaulaUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    
    try {
      console.log('Criando usuário Paula...');

      // Criar usuário via signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'paula@watransportes.com',
        password: 'Wa@2025',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            username: 'paula',
            role: 'user'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado corretamente');
      }

      console.log('Usuário Paula criado:', authData.user);

      // Aguardar um momento para o perfil ser criado
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se o perfil foi criado, senão criar manualmente
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
            username: 'paula',
            email: 'paula@watransportes.com',
            role: 'user'
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw new Error(`Erro ao criar perfil: ${profileError.message}`);
        }
      }

      // Adicionar permissões específicas para Paula
      const permissionsData = [
        {
          user_id: authData.user.id,
          permission: 'services_view',
          granted_by: currentUser.id
        },
        {
          user_id: authData.user.id,
          permission: 'services_create',
          granted_by: currentUser.id
        }
      ];

      const { error: permissionsError } = await supabase
        .from('user_permissions')
        .insert(permissionsData);

      if (permissionsError) {
        console.error('Erro ao adicionar permissões:', permissionsError);
        toast({
          title: "Usuário criado com aviso",
          description: "Usuário Paula foi criado, mas houve erro ao adicionar algumas permissões.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Usuário Paula criado com sucesso!",
          description: "Email: paula@watransportes.com | Senha: Wa@2025 | Acesso: Somente Serviços",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
      
    } catch (error: any) {
      console.error('Erro completo:', error);
      
      toast({
        title: "Erro ao criar usuário Paula",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Criar Usuário Paula</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Criar usuário específico: paula@watransportes.com com acesso limitado apenas aos serviços.
        </p>
        <Button 
          onClick={createPaulaUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Criando usuário Paula...' : 'Criar Usuário Paula'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreatePaulaUser;
