import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserPermission {
  permission: string;
}

// Lista de usuários com acesso total
const FULL_ACCESS_USERS = [
  'mayte@watransportes.com',
  'victor@watransportes.com', 
  'paula@watransportes.com'
];

export const usePermissions = () => {
  const { user, profile } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !profile) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      console.log('usePermissions - Iniciando busca para:', profile.email);

      // Admin ou usuários com acesso total têm todas as permissões
      if (profile.role === 'admin' || FULL_ACCESS_USERS.includes(profile.email)) {
        console.log('Usuário com acesso total detectado');
        setPermissions([
          'dashboard_view',
          'services_create',
          'services_view', 
          'costs_create',
          'costs_view',
          'checklist_access',
          'users_manage'
        ]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando permissões para usuário:', user.id, profile.email);
        
        const { data, error } = await supabase
          .from('user_permissions')
          .select('permission')
          .eq('user_id', user.id);

        console.log('Permissões encontradas:', data, 'Erro:', error);

        if (error) {
          console.error('Erro ao buscar permissões:', error);
          setPermissions([]);
        } else {
          const userPermissions = data?.map(p => p.permission) || [];
          console.log('Permissões do usuário:', userPermissions);
          setPermissions(userPermissions);
        }
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user, profile]);

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    if (profile.role === 'admin' || FULL_ACCESS_USERS.includes(profile.email)) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    isAdmin: profile?.role === 'admin' || (profile ? FULL_ACCESS_USERS.includes(profile.email) : false)
  };
};