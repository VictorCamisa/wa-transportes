
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Navigation, MapPin, Truck, ClipboardList, Package, LogOut, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

type Tab = 'gps' | 'checklist' | 'minhas_os' | 'pod';

interface OrdemServico {
  id: string;
  numero_os: string | null;
  empresa: string | null;
  descricao: string | null;
  cidade_origem: string | null;
  cidade_destino: string | null;
  status: string;
  valor_frete: number | null;
}

interface ChecklistItem {
  item: string;
  status: '' | 'funciona' | 'nao_funciona';
  observacao: string;
}

const CHECKLIST_ITEMS = ['Freio de mão', 'Freio de pé', 'Luzes', 'KM', 'Pneus', 'Água', 'Óleo'];

const STATUS_LABELS: Record<string, string> = {
  criada: 'Criada', despachada: 'Despachada', aceita: 'Aceita',
  em_execucao: 'Em Execução', concluida: 'Concluída', cancelada: 'Cancelada',
};

const STATUS_COLORS: Record<string, string> = {
  criada: 'bg-gray-100 text-gray-800', despachada: 'bg-blue-100 text-blue-800',
  aceita: 'bg-indigo-100 text-indigo-800', em_execucao: 'bg-yellow-100 text-yellow-800',
  concluida: 'bg-green-100 text-green-800', cancelada: 'bg-red-100 text-red-800',
};

const MotoristaApp = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('gps');
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const [posicaoAtual, setPosicaoAtual] = useState<{ lat: number; lng: number; vel: number | null } | null>(null);
  const [motorista, setMotorista] = useState<{ id: string; nome: string } | null>(null);
  const [placa, setPlaca] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  const [km, setKm] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS.map(item => ({ item, status: '', observacao: '' }))
  );
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [podObs, setPodObs] = useState('');
  const [podRecebedor, setPodRecebedor] = useState('');
  const [podSubmitting, setPodSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await (supabase.from('motoristas' as any).select('id, nome').limit(1) as any);
      if (data && data.length > 0) setMotorista(data[0]);
    };
    load();
  }, [user]);

  const startGPS = () => {
    if (!navigator.geolocation) {
      toast({ title: 'GPS não suportado', description: 'Seu dispositivo não suporta geolocalização.', variant: 'destructive' });
      return;
    }
    setGpsAtivo(true);
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, speed } = pos.coords;
        const vel = speed !== null ? Math.round(speed * 3.6) : null;
        setPosicaoAtual({ lat, lng, vel });
        await (supabase.from('posicoes_gps' as any).insert([{
          motorista_id: motorista?.id || null,
          latitude: lat,
          longitude: lng,
          velocidade: vel,
          precisao: pos.coords.accuracy,
        }]) as any);
      },
      (err) => {
        toast({ title: 'Erro de GPS', description: err.message, variant: 'destructive' });
        setGpsAtivo(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    watchIdRef.current = id;
    toast({ title: 'GPS ativo!', description: 'Sua posição está sendo transmitida.' });
  };

  const stopGPS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsAtivo(false);
    setPosicaoAtual(null);
    toast({ title: 'GPS desativado.' });
  };

  const { data: minhasOS = [], isLoading: loadingOS } = useQuery({
    queryKey: ['minhas-os', motorista?.id],
    queryFn: async () => {
      if (!motorista?.id) return [];
      const { data, error } = await (supabase
        .from('ordens_servico' as any)
        .select('*')
        .eq('motorista_id', motorista.id)
        .not('status', 'in', '(concluida,cancelada)')
        .order('created_at', { ascending: false }) as any);
      if (error) throw error;
      return data as OrdemServico[];
    },
    enabled: !!motorista?.id,
  });

  const advanceMutation = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: string }) => {
      const now = new Date().toISOString();
      const timestamps: Record<string, string> = {
        aceita: 'data_aceite', em_execucao: 'data_inicio_execucao', concluida: 'data_conclusao',
      };
      const update: Record<string, string> = { status: nextStatus };
      if (timestamps[nextStatus]) update[timestamps[nextStatus]] = now;
      const { error } = await (supabase.from('ordens_servico' as any).update(update).eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['minhas-os'] }); toast({ title: 'Status atualizado!' }); },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const submitChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !nomeMotorista) {
      toast({ title: 'Preencha placa e motorista.', variant: 'destructive' }); return;
    }
    if (checklist.some(i => !i.status)) {
      toast({ title: 'Marque todos os itens do checklist.', variant: 'destructive' }); return;
    }
    try {
      const { error } = await (supabase.from('checklists' as any).insert([{
        placa, nome_motorista: nomeMotorista,
        data: format(new Date(), 'yyyy-MM-dd'),
        km: km ? Number(km) : null,
        items: checklist,
        motorista_id: motorista?.id || null,
        criado_por: user?.id || null,
      }]) as any);
      if (error) throw error;
      toast({ title: 'Checklist salvo!' });
      setPlaca(''); setNomeMotorista(''); setKm('');
      setChecklist(CHECKLIST_ITEMS.map(item => ({ item, status: '', observacao: '' })));
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
  };

  const submitPOD = async () => {
    if (!selectedOS) { toast({ title: 'Selecione uma OS.', variant: 'destructive' }); return; }
    setPodSubmitting(true);
    try {
      let lat: number | null = null, lng: number | null = null;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        );
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      } catch {}

      const { error } = await (supabase.from('comprovantes_entrega' as any).insert([{
        ordem_servico_id: selectedOS,
        motorista_id: motorista?.id || null,
        nome_recebedor: podRecebedor || null,
        observacoes: podObs || null,
        latitude: lat, longitude: lng,
      }]) as any);
      if (error) throw error;

      await (supabase.from('ordens_servico' as any).update({
        status: 'concluida', data_conclusao: new Date().toISOString(),
      }).eq('id', selectedOS) as any);

      toast({ title: 'Entrega confirmada!', description: 'Comprovante registrado com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['minhas-os'] });
      setSelectedOS(null); setPodObs(''); setPodRecebedor('');
    } catch (err: any) {
      toast({ title: 'Erro ao registrar', description: err.message, variant: 'destructive' });
    } finally {
      setPodSubmitting(false);
    }
  };

  const osEmExecucao = minhasOS.filter(os => os.status === 'em_execucao');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">WA Transportes</p>
          <p className="text-blue-200 text-sm">{profile?.email}</p>
        </div>
        <Button size="sm" variant="ghost" className="text-white hover:bg-blue-600" onClick={async () => { await signOut(); navigate('/login'); }}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {tab === 'gps' && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="h-5 w-5" />GPS Rastreamento</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {gpsAtivo ? (
                  <>
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-medium">Transmitindo posição</span>
                    </div>
                    {posicaoAtual && (
                      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                        <div><MapPin className="inline h-3 w-3 mr-1" />{posicaoAtual.lat.toFixed(6)}, {posicaoAtual.lng.toFixed(6)}</div>
                        {posicaoAtual.vel !== null && <div><Truck className="inline h-3 w-3 mr-1" />{posicaoAtual.vel} km/h</div>}
                      </div>
                    )}
                    <Button variant="destructive" className="w-full" onClick={stopGPS}>Parar GPS</Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm">Ative o GPS para transmitir sua localização em tempo real para o painel administrativo.</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={startGPS}>
                      <Navigation className="h-4 w-4 mr-2" />Ativar GPS
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {tab === 'checklist' && (
          <form onSubmit={submitChecklist} className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" />Dados do Veículo</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Placa *</Label><Input value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())} placeholder="ABC-1234" /></div>
                <div><Label>Motorista *</Label><Input value={nomeMotorista} onChange={e => setNomeMotorista(e.target.value)} placeholder="Seu nome" /></div>
                <div><Label>KM Atual</Label><Input type="number" value={km} onChange={e => setKm(e.target.value)} placeholder="Quilometragem" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Checklist de Inspeção</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{item.item}</span>
                        {item.status && (
                          item.status === 'funciona'
                            ? <CheckCircle className="h-4 w-4 text-green-600" />
                            : <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-1 text-sm cursor-pointer">
                          <input type="radio" name={`item-${idx}`} value="funciona" checked={item.status === 'funciona'} onChange={() => setChecklist(c => c.map((ci, i) => i === idx ? { ...ci, status: 'funciona' } : ci))} />
                          <span className="text-green-700">Funciona</span>
                        </label>
                        <label className="flex items-center gap-1 text-sm cursor-pointer">
                          <input type="radio" name={`item-${idx}`} value="nao_funciona" checked={item.status === 'nao_funciona'} onChange={() => setChecklist(c => c.map((ci, i) => i === idx ? { ...ci, status: 'nao_funciona' } : ci))} />
                          <span className="text-red-700">Não Funciona</span>
                        </label>
                      </div>
                      <Input className="text-sm" placeholder="Observação (opcional)" value={item.observacao} onChange={e => setChecklist(c => c.map((ci, i) => i === idx ? { ...ci, observacao: e.target.value } : ci))} />
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700">Salvar Checklist</Button>
              </CardContent>
            </Card>
          </form>
        )}

        {tab === 'minhas_os' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Minhas Ordens de Serviço</h2>
            {loadingOS ? (
              <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : minhasOS.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-500">Nenhuma OS atribuída.</CardContent></Card>
            ) : (
              minhasOS.map(os => {
                const canAdvance: Record<string, string> = { despachada: 'aceita', aceita: 'em_execucao', em_execucao: 'concluida' };
                const advLabels: Record<string, string> = { aceita: 'Confirmar', em_execucao: 'Iniciar', concluida: 'Concluir' };
                const next = canAdvance[os.status];
                return (
                  <Card key={os.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono font-bold text-blue-700 text-sm">{os.numero_os || 'OS-...'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[os.status] || ''}`}>{STATUS_LABELS[os.status] || os.status}</span>
                      </div>
                      {os.empresa && <p className="font-medium text-sm">{os.empresa}</p>}
                      {os.descricao && <p className="text-xs text-gray-500 mt-1">{os.descricao}</p>}
                      {os.cidade_origem && os.cidade_destino && (
                        <p className="text-xs text-gray-500 mt-1">{os.cidade_origem} → {os.cidade_destino}</p>
                      )}
                      {next && (
                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700" size="sm"
                          onClick={() => advanceMutation.mutate({ id: os.id, nextStatus: next })}
                          disabled={advanceMutation.isPending}>
                          <ChevronRight className="h-3 w-3 mr-1" />{advLabels[next] || next}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {tab === 'pod' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Comprovante de Entrega</h2>
            {osEmExecucao.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma OS em execução para registrar entrega.</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label>Selecionar OS *</Label>
                      <div className="space-y-2 mt-1">
                        {osEmExecucao.map(os => (
                          <label key={os.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${selectedOS === os.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="os" value={os.id} checked={selectedOS === os.id} onChange={() => setSelectedOS(os.id)} />
                            <span className="text-sm"><strong>{os.numero_os}</strong> — {os.empresa || 'Sem empresa'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div><Label>Nome do Recebedor</Label><Input value={podRecebedor} onChange={e => setPodRecebedor(e.target.value)} placeholder="Nome de quem recebeu" /></div>
                    <div><Label>Observações</Label><Textarea value={podObs} onChange={e => setPodObs(e.target.value)} placeholder="Condições da entrega, danos, etc." rows={3} /></div>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={submitPOD} disabled={podSubmitting || !selectedOS}>
                      {podSubmitting ? 'Registrando...' : 'Confirmar Entrega'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t grid grid-cols-4">
        {([
          { id: 'gps', icon: Navigation, label: 'GPS' },
          { id: 'checklist', icon: Truck, label: 'Checklist' },
          { id: 'minhas_os', icon: ClipboardList, label: 'Minhas OS' },
          { id: 'pod', icon: Package, label: 'Entrega' },
        ] as { id: Tab; icon: any; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center py-3 text-xs font-medium transition-colors ${tab === id ? 'text-blue-600 border-t-2 border-blue-600' : 'text-gray-500'}`}
          >
            <Icon className="h-5 w-5 mb-1" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MotoristaApp;
