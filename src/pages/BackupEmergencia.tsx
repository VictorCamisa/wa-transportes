import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileJson, Database, Loader2, AlertTriangle } from 'lucide-react';
import { exportTableToCSV, exportTableToJSON, exportAllTables, getTableCount } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// CHAVE DE ACESSO TEMPORÁRIA - REMOVER APÓS USO
const EMERGENCY_KEY = 'backup2024';

interface TableInfo {
  name: string;
  label: string;
  description: string;
  count: number;
}

const BackupEmergencia = () => {
  const { key } = useParams();
  
  const [tables, setTables] = useState<TableInfo[]>([
    { name: 'custos', label: 'Custos', description: 'Todos os custos registrados', count: 0 },
    { name: 'servicos', label: 'Serviços', description: 'Todos os serviços prestados', count: 0 },
    { name: 'profiles', label: 'Perfis', description: 'Perfis de usuários', count: 0 },
    { name: 'user_permissions', label: 'Permissões', description: 'Permissões de usuários', count: 0 },
  ]);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);

  // Verificar chave de acesso
  if (key !== EMERGENCY_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
            <CardDescription>
              Chave de acesso inválida ou ausente.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Acesse com a URL correta: <code className="bg-muted px-1 rounded">/backup-emergencia/SUACHAVE</code></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingCounts(true);
      try {
        const updatedTables = await Promise.all(
          tables.map(async (table) => ({
            ...table,
            count: await getTableCount(table.name),
          }))
        );
        setTables(updatedTables);
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
        toast({
          title: 'Aviso',
          description: 'Não foi possível conectar ao banco de dados. Verifique se o Supabase está acessível.',
          variant: 'destructive',
        });
      }
      setLoadingCounts(false);
    };

    fetchCounts();
  }, []);

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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Toaster />
      
      {/* Aviso de Emergência */}
      <Card className="mb-6 border-amber-500 bg-amber-500/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Modo de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-700">
          <p>Esta é uma página temporária sem autenticação. <strong>Remova após extrair os dados!</strong></p>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Backup de Emergência</h1>
        <p className="text-muted-foreground">Exporte seus dados para CSV ou JSON</p>
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
                disabled={loading !== null}
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
                disabled={loading !== null}
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
          <p>• Os arquivos são nomeados com a data atual</p>
          <p>• CSV: Ideal para abrir no Excel ou Google Sheets</p>
          <p>• JSON: Ideal para migração de banco de dados</p>
          <p>• Os arquivos são baixados automaticamente para seu computador</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupEmergencia;
