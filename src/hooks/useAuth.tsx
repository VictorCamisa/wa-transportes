
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');
    
    // Verificar se o usuário está logado
    const getInitialAuth = async () => {
      console.log('Verificando autenticação inicial...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return;
        }
        
        console.log('Sessão inicial:', session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Erro na verificação inicial de auth:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialAuth();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Usar setTimeout para evitar problemas de concorrência
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil do usuário:', userId);
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        // Se não encontrar o perfil, vamos tentar criar um básico
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando perfil básico...');
          
          // Obter o email do usuário autenticado
          const { data: { user } } = await supabase.auth.getUser();
          const userEmail = user?.email || `user-${userId}@sistema.local`;
          
          const { data: newProfile, error: insertError } = await (supabase
            .from('profiles') as any)
            .insert([
              {
                id: userId,
                username: 'Usuario',
                email: userEmail
              }
            ])
            .select()
            .single();
          
          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
          } else {
            console.log('Perfil criado:', newProfile);
            setProfile(newProfile);
          }
        }
        return;
      }

      console.log('Perfil carregado:', data);
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Iniciando processo de login...');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erro no signIn:', error);
      // Log detalhado para debugging
      console.log('Detalhes do erro:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
    } else {
      console.log('SignIn realizado com sucesso');
    }

    return { error };
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    setLoading(true);
    
    try {
      // Limpar estados locais primeiro
      setUser(null);
      setProfile(null);
      
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
        // Mesmo com erro, manter os estados limpos
      } else {
        console.log('Logout realizado com sucesso');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = React.useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signOut
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
