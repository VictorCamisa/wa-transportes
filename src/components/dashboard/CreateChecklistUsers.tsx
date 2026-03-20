import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const CreateChecklistUsers = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createUsers = async () => {
    setLoading(true);
    
    try {
      const users = [
        { email: 'fico@watransportes.com', password: 'Wa@2025', username: 'fico' },
        { email: 'oxinho@watransportes.com', password: 'Wa@2025', username: 'oxinho' }
      ];

      for (const userData of users) {
        console.log(`Criando usuário: ${userData.email}`);

        // Primeiro, tentar deletar o usuário se já existir (só funciona para o auth)
        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userData.email)
            .single();

          if (existingProfile) {
            console.log(`Deletando perfil existente para: ${userData.email}`);
            await supabase
              .from('profiles')
              .delete()
              .eq('email', userData.email);
          }
        } catch (error) {
          console.log('Usuário não existe ainda, continuando...');
        }

        // Criar novo usuário
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              username: userData.username,
              role: 'user'
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            console.log(`Usuário ${userData.email} já existe, tentando fazer login para atualizar perfil`);
            
            // Se já existe, vamos apenas atualizar o perfil
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: userData.password
            });

            if (signInError) {
              console.error(`Erro ao fazer login com ${userData.email}:`, signInError);
              continue;
            }

            // Verificar se o perfil existe, se não, criar
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', signInData.user.id)
              .single();

            if (profileError || !profile) {
              console.log(`Criando perfil para usuário existente: ${userData.email}`);
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: signInData.user.id,
                  username: userData.username,
                  email: userData.email,
                  role: 'user'
                });

              if (insertError) {
                console.error(`Erro ao criar perfil para ${userData.email}:`, insertError);
              }
            }

            await supabase.auth.signOut();
            toast.success(`Usuário ${userData.email} atualizado com sucesso!`);
          } else {
            console.error(`Erro ao criar usuário ${userData.email}:`, error);
            toast.error(`Erro ao criar ${userData.email}: ${error.message}`);
          }
        } else {
          console.log(`Usuário criado com sucesso: ${userData.email}`);
          toast.success(`Usuário ${userData.email} criado com sucesso!`);
        }
      }

      // Invalidar queries para atualizar a lista de usuários
      queryClient.invalidateQueries();
      
      toast.success('Processo de criação de usuários concluído!');
    } catch (error) {
      console.error('Erro geral:', error);
      toast.error('Erro ao criar usuários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Usuários Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Criará os usuários Fico e Oxinho com acesso ao checklist.
        </p>
        <Button 
          onClick={createUsers} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Criando...' : 'Criar Usuários'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateChecklistUsers;