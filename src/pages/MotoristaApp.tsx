
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Navigation, MapPin, Truck, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type Tab = 'gps' | 'checklist';

interface ChecklistItem {
  item: string;
  status: '' | 'funciona' | 'nao_funciona';
  observacao: string;
}

const CHECKLIST_ITEMS = ['Freio de mão', 'Freio de pé', 'Luzes', 'KM', 'Pneus', 'Água', 'Óleo'];

const MotoristaApp = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
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
      toast({ title: 'GPS não suportado', variant: 'destructive' });
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
          latitude: lat, longitude: lng, velocidade: vel,
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

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">WA Transportes</p>
          <p className="text-primary-foreground/70 text-sm">{profile?.email}</p>
        </div>
        <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary/80" onClick={async () => { await signOut(); navigate('/login'); }}>
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
                      <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                        <div><MapPin className="inline h-3 w-3 mr-1" />{posicaoAtual.lat.toFixed(6)}, {posicaoAtual.lng.toFixed(6)}</div>
                        {posicaoAtual.vel !== null && <div><Truck className="inline h-3 w-3 mr-1" />{posicaoAtual.vel} km/h</div>}
                      </div>
                    )}
                    <Button variant="destructive" className="w-full" onClick={stopGPS}>Parar GPS</Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground text-sm">Ative o GPS para transmitir sua localização em tempo real.</p>
                    <Button className="w-full" onClick={startGPS}>
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
                    <div key={idx} className="border-b border-border pb-3 last:border-0">
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
                <Button type="submit" className="w-full mt-4">Salvar Checklist</Button>
              </CardContent>
            </Card>
          </form>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border grid grid-cols-2">
        {([
          { id: 'gps', icon: Navigation, label: 'GPS' },
          { id: 'checklist', icon: Truck, label: 'Checklist' },
        ] as { id: Tab; icon: any; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center py-3 text-xs font-medium transition-colors ${tab === id ? 'text-primary border-t-2 border-primary' : 'text-muted-foreground'}`}
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
