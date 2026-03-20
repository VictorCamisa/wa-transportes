import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetOxinhoPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    
    try {
      console.log('Iniciando reset de senha para oxinho@watransportes.com');

      // Enviar email de reset de senha
      const { error } = await supabase.auth.resetPasswordForEmail(
        'oxinho@watransportes.com',
        {
          redirectTo: `${window.location.origin}/dashboard`
        }
      );

      if (error) {
        console.error('Erro ao enviar reset de senha:', error);
        toast.error(`Erro ao enviar reset de senha: ${error.message}`);
      } else {
        console.log('Email de reset enviado com sucesso');
        toast.success('Email de reset de senha enviado para oxinho@watransportes.com');
      }
    } catch (error) {
      console.error('Erro geral:', error);
      toast.error('Erro ao processar reset de senha');
    } finally {
      setLoading(false);
    }
  };

  const recreateUser = async () => {
    setLoading(true);
    
    try {
      console.log('Recriando usuário oxinho@watransportes.com');

      // Primeiro, deletar o perfil existente
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', 'oxinho@watransportes.com');

      if (deleteError) {
        console.error('Erro ao deletar perfil:', deleteError);
      }

      // Criar novo usuário
      const { data, error } = await supabase.auth.signUp({
        email: 'oxinho@watransportes.com',
        password: 'Wa@2025',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            username: 'oxinho',
            role: 'user'
          }
        }
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        toast.error(`Erro ao criar usuário: ${error.message}`);
      } else {
        console.log('Usuário criado com sucesso:', data);
        toast.success('Usuário Oxinho recriado com sucesso!');
      }
    } catch (error) {
      console.error('Erro geral:', error);
      toast.error('Erro ao recriar usuário');
    } finally {
      setLoading(false);
    }
  };

  const tryLogin = async () => {
    setLoading(true);
    
    try {
      console.log('Tentando login direto com oxinho@watransportes.com');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'oxinho@watransportes.com',
        password: 'Wa@2025'
      });

      if (error) {
        console.error('Erro no login:', error);
        toast.error(`Erro no login: ${error.message}`);
      } else {
        console.log('Login realizado com sucesso:', data);
        toast.success('Login realizado com sucesso!');
        
        // Fazer logout para não interferir na sessão atual
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Erro geral no login:', error);
      toast.error('Erro ao tentar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Debug Usuário Oxinho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ferramentas para resolver problema do Oxinho
        </p>
        
        <Button 
          onClick={tryLogin} 
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? 'Testando...' : 'Testar Login Oxinho'}
        </Button>
        
        <Button 
          onClick={recreateUser} 
          disabled={loading}
          className="w-full"
          variant="destructive"
        >
          {loading ? 'Recriando...' : 'Recriar Usuário Oxinho'}
        </Button>
        
        <Button 
          onClick={resetPassword} 
          disabled={loading}
          className="w-full"
          variant="secondary"
        >
          {loading ? 'Enviando...' : 'Reset Senha Oxinho'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResetOxinhoPassword;