
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileJson, Database, Loader2 } from 'lucide-react';
import { exportTableToCSV, exportTableToJSON, exportAllTables, getTableCount } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';

interface TableInfo {
  name: string;
  label: string;
  description: string;
  count: number;
}

const Backup = () => {
  const { user, loading: authLoading } = useAuth();
  const [tables, setTables] = useState<TableInfo[]>([
    { name: 'custos_maio', label: 'Custos', description: 'Todos os custos registrados', count: 0 },
    { name: 'servicos', label: 'Serviços', description: 'Todos os serviços prestados', count: 0 },
    { name: 'profiles', label: 'Perfis', description: 'Perfis de usuários', count: 0 },
    { name: 'user_permissions', label: 'Permissões', description: 'Permissões de usuários', count: 0 },
  ]);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingCounts(true);
      const updatedTables = await Promise.all(
        tables.map(async (table) => ({
          ...table,
          count: await getTableCount(table.name),
        }))
      );
      setTables(updatedTables);
      setLoadingCounts(false);
    };

    if (user) {
      fetchCounts();
    }
  }, [user]);

  const handleExport = async (tableName: string, format: 'csv' | 'json') => {
    setLoading(`${tableName}-${format}`);
    try {
      const exportFn = format === 'csv' ? exportTableToCSV : exportTableToJSON;
      const result = await exportFn(tableName);

      if (result.success) {
        toast({
          title: 'Exportação concluída!',
          description: `${result.count} registros exportados com sucesso.`,
        });
      } else {
        toast({
          title: 'Erro na exportação',
          description: result.error || 'Nenhum dado encontrado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os dados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleExportAll = async (format: 'csv' | 'json') => {
    setLoading(`all-${format}`);
    try {
      const result = await exportAllTables(format);

      if (result.success) {
        const totalCount = Object.values(result.results).reduce((sum, r) => sum + r.count, 0);
        toast({
          title: 'Backup completo realizado!',
          description: `${totalCount} registros exportados de ${Object.keys(result.results).length} tabelas.`,
        });
      } else {
        toast({
          title: 'Erro no backup',
          description: 'Nenhum dado foi exportado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro no backup',
        description: 'Ocorreu um erro ao realizar o backup.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab="backup" onTabChange={() => {}} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Backup de Dados</h1>
              <p className="text-muted-foreground">Exporte seus dados para CSV ou JSON</p>
            </div>
          </div>

          {/* Exportar Tudo */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Exportar Todas as Tabelas
              </CardTitle>
              <CardDescription>
                Faça backup completo de todos os dados do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleExportAll('csv')}
                disabled={loading !== null}
                className="flex items-center gap-2"
              >
                {loading === 'all-csv' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Exportar Tudo (CSV)
              </Button>
              <Button
                onClick={() => handleExportAll('json')}
                disabled={loading !== null}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading === 'all-json' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileJson className="h-4 w-4" />
                )}
                Exportar Tudo (JSON)
              </Button>
            </CardContent>
          </Card>

          {/* Tabelas Individuais */}
          <div className="grid gap-4 md:grid-cols-2">
            {tables.map((table) => (
              <Card key={table.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{table.label}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {loadingCounts ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `${table.count} registros`
                      )}
                    </span>
                  </CardTitle>
                  <CardDescription>{table.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleExport(table.name, 'csv')}
                    disabled={loading !== null || table.count === 0}
                    className="flex items-center gap-2"
                  >
                    {loading === `${table.name}-csv` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4" />
                    )}
                    CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport(table.name, 'json')}
                    disabled={loading !== null || table.count === 0}
                    className="flex items-center gap-2"
                  >
                    {loading === `${table.name}-json` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileJson className="h-4 w-4" />
                    )}
                    JSON
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Informações */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informações sobre o Backup</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Os arquivos são nomeados com a data atual (ex: custos_maio_2025-12-22.csv)</p>
              <p>• CSV: Ideal para abrir no Excel ou Google Sheets</p>
              <p>• JSON: Ideal para migração de banco de dados</p>
              <p>• Os arquivos são baixados automaticamente para seu computador</p>
              <p>• Senhas de usuários não são exportadas por segurança</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Backup;
