
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Clock, Navigation } from 'lucide-react';

interface PosicaoGPS {
  id: string;
  motorista_id: string | null;
  veiculo_id: string | null;
  ordem_servico_id: string | null;
  latitude: number;
  longitude: number;
  velocidade: number | null;
  created_at: string;
}

interface UltimaPosicao {
  motorista_id: string;
  nome_motorista: string;
  latitude: number;
  longitude: number;
  velocidade: number | null;
  created_at: string;
  ordem_servico_id: string | null;
  numero_os: string | null;
}

const LiveMap = () => {
  const [posicoes, setPosicoes] = useState<UltimaPosicao[]>([]);

  const { data: motoristas = [] } = useQuery({
    queryKey: ['motoristas-ativos'],
    queryFn: async () => {
      const { data } = await (supabase.from('motoristas' as any).select('id, nome').eq('status', 'ativo') as any);
      return (data || []) as { id: string; nome: string }[];
    },
  });

  const { data: ultimasPosicoes = [], isLoading, refetch } = useQuery({
    queryKey: ['posicoes_gps_ultimas'],
    queryFn: async () => {
      if (!motoristas.length) return [];
      const results: UltimaPosicao[] = [];

      for (const m of motoristas) {
        const { data } = await (supabase
          .from('posicoes_gps' as any)
          .select('*')
          .eq('motorista_id', m.id)
          .order('created_at', { ascending: false })
          .limit(1) as any);

        if (data && data.length > 0) {
          const p = data[0];
          results.push({
            motorista_id: m.id,
            nome_motorista: m.nome,
            latitude: p.latitude,
            longitude: p.longitude,
            velocidade: p.velocidade,
            created_at: p.created_at,
            ordem_servico_id: p.ordem_servico_id,
            numero_os: null,
          });
        }
      }
      return results;
    },
    enabled: motoristas.length > 0,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setPosicoes(ultimasPosicoes);
  }, [ultimasPosicoes]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('posicoes-gps-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posicoes_gps' }, () => {
        refetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refetch]);

  const getTempoAtras = (dt: string) => {
    const diff = Math.floor((Date.now() - new Date(dt).getTime()) / 1000);
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    return `${Math.floor(diff / 3600)}h atrás`;
  };

  const isAtivo = (dt: string) => {
    return Date.now() - new Date(dt).getTime() < 10 * 60 * 1000; // 10 min
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mapa ao Vivo</h2>
          <p className="text-gray-500">
            {posicoes.length} motorista(s) com posição registrada
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Atualiza a cada 30s
        </div>
      </div>

      {/* Info box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-3">
          <p className="text-sm text-blue-800">
            <Navigation className="inline h-4 w-4 mr-1" />
            Para rastreamento em tempo real, os motoristas precisam acessar <strong>/motorista</strong> e ativar o GPS.
            O mapa interativo será exibido assim que houver posições registradas.
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando posições...</div>
      ) : posicoes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum motorista com rastreamento ativo</p>
            <p className="text-sm mt-2">Os motoristas precisam abrir o app em <code className="bg-gray-100 px-1 rounded">/motorista</code> e ativar o GPS.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posicoes.map(p => {
            const ativo = isAtivo(p.created_at);
            return (
              <Card key={p.motorista_id} className={`hover:shadow-md transition-shadow ${ativo ? 'border-green-200' : 'border-gray-200'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{p.nome_motorista}</CardTitle>
                    <Badge variant={ativo ? 'default' : 'secondary'} className={ativo ? 'bg-green-600' : ''}>
                      {ativo ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-500" />
                    <span className="font-mono text-xs">
                      {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                    </span>
                  </div>
                  {p.velocidade !== null && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span>{p.velocidade} km/h</span>
                    </div>
                  )}
                  {p.numero_os && (
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      OS: {p.numero_os}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {getTempoAtras(p.created_at)}
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-600 hover:underline mt-1"
                  >
                    Ver no Google Maps →
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveMap;
