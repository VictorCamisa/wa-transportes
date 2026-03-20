
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, MapPin, Clock, Search, LogIn } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  criada: 'Criada', despachada: 'Despachada', aceita: 'Aceita',
  em_execucao: 'Em Trânsito', concluida: 'Entregue', cancelada: 'Cancelada',
};

const STATUS_COLORS: Record<string, string> = {
  criada: 'bg-gray-100 text-gray-700', despachada: 'bg-blue-100 text-blue-700',
  aceita: 'bg-indigo-100 text-indigo-700', em_execucao: 'bg-yellow-100 text-yellow-700',
  concluida: 'bg-green-100 text-green-700', cancelada: 'bg-red-100 text-red-700',
};

interface PortalAcesso {
  id: string;
  empresa: string;
  token: string;
}

const ClientPortal = () => {
  const [empresaInput, setEmpresaInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [acesso, setAcesso] = useState<PortalAcesso | null>(null);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { data, error } = await (supabase
        .from('clientes_portal' as any)
        .select('id, empresa, token')
        .eq('empresa', empresaInput.trim())
        .eq('token', tokenInput.trim())
        .eq('ativo', true)
        .single() as any);
      if (error || !data) {
        setLoginError('Empresa ou token incorretos. Contacte a WA Transportes.');
      } else {
        setAcesso(data as PortalAcesso);
      }
    } catch {
      setLoginError('Erro ao verificar acesso. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const { data: servicos = [], isLoading: loadingServicos } = useQuery({
    queryKey: ['portal-servicos', acesso?.empresa],
    queryFn: async () => {
      if (!acesso) return [];
      const { data, error } = await (supabase
        .from('servicos' as any)
        .select('*')
        .eq('empresa', acesso.empresa)
        .order('data_servico', { ascending: false })
        .limit(50) as any);
      if (error) throw error;
      return data || [];
    },
    enabled: !!acesso,
  });

  const { data: ordens = [], isLoading: loadingOS } = useQuery({
    queryKey: ['portal-os', acesso?.empresa],
    queryFn: async () => {
      if (!acesso) return [];
      const { data, error } = await (supabase
        .from('ordens_servico' as any)
        .select('*')
        .eq('empresa', acesso.empresa)
        .order('created_at', { ascending: false }) as any);
      if (error) throw error;
      return data || [];
    },
    enabled: !!acesso,
    refetchInterval: 30000,
  });

  if (!acesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Truck className="h-16 w-16 text-blue-700 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-blue-900">Portal do Cliente</h1>
            <p className="text-blue-600 mt-1">WA Transportes — Acompanhe suas cargas</p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input
                    id="empresa"
                    value={empresaInput}
                    onChange={e => setEmpresaInput(e.target.value)}
                    placeholder="Ex: AUTOLIV"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="token">Código de Acesso</Label>
                  <Input
                    id="token"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="Código fornecido pela WA Transportes"
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{loginError}</p>
                )}
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loginLoading}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {loginLoading ? 'Verificando...' : 'Acessar Portal'}
                </Button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                Não tem código? Entre em contato com a WA Transportes para solicitar acesso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const osAtivas = ordens.filter((os: any) => !['concluida', 'cancelada'].includes(os.status));
  const osConcluidas = ordens.filter((os: any) => os.status === 'concluida');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Portal do Cliente</h1>
            <p className="text-blue-200 text-sm">{acesso.empresa}</p>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-blue-600" onClick={() => setAcesso(null)}>
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Em Andamento', value: osAtivas.length, color: 'text-yellow-600' },
            { label: 'Concluídas', value: osConcluidas.length, color: 'text-green-600' },
            { label: 'Total de Serviços', value: servicos.length, color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="pt-4 text-center">
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ordens em Andamento */}
        {osAtivas.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-yellow-600" />Em Andamento</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {osAtivas.map((os: any) => (
                <div key={os.id} className="flex flex-wrap justify-between items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-blue-700">{os.numero_os || '—'}</span>
                    {os.cidade_origem && os.cidade_destino && (
                      <span className="text-sm text-gray-600 ml-2">{os.cidade_origem} → {os.cidade_destino}</span>
                    )}
                    {os.descricao && <p className="text-xs text-gray-500 mt-0.5">{os.descricao}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[os.status] || ''}`}>
                    {STATUS_LABELS[os.status] || os.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Histórico de Serviços */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Histórico de Serviços
              <span className="text-sm font-normal text-gray-500 ml-auto">{servicos.length} registros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingServicos ? (
              <div className="py-8 text-center text-gray-500">Carregando...</div>
            ) : servicos.length === 0 ? (
              <div className="py-8 text-center text-gray-500">Nenhum serviço registrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">Data</th>
                      <th className="text-left p-3 font-medium text-gray-600">Descrição</th>
                      <th className="text-left p-3 font-medium text-gray-600">Cidade</th>
                      <th className="text-left p-3 font-medium text-gray-600">Motorista</th>
                      <th className="text-right p-3 font-medium text-gray-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {servicos.map((s: any) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-500">
                          {s.data_servico ? new Date(s.data_servico + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                        </td>
                        <td className="p-3">{s.servico || s.solicitante || '—'}</td>
                        <td className="p-3">{s.cidade || '—'}</td>
                        <td className="p-3">{s.motorista || '—'}</td>
                        <td className="p-3 text-right font-medium text-green-700">{s.valor_texto || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPortal;
