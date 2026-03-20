
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePermission?: string;
  fallback?: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requireAdmin = false,
  requirePermission,
  fallback = (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta funcionalidade.
        </p>
      </CardContent>
    </Card>
  )
}) => {
  const { user, profile, loading: authLoading } = useAuth();
  const { hasPermission, isAdmin, loading: permissionsLoading } = usePermissions();

  const loading = authLoading || permissionsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return fallback;
  }

  // Verificar se requer admin
  if (requireAdmin && !isAdmin) {
    return fallback;
  }

  // Verificar permissão específica
  if (requirePermission && !hasPermission(requirePermission)) {
    return fallback;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
