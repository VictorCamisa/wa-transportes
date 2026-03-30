import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Eye, Search, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDateForDisplay } from '@/utils/dateUtils';

const ChecklistHistory = () => {
  const [search, setSearch] = useState('');
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);

  const { data: checklists, isLoading } = useQuery({
    queryKey: ['checklists-history'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('checklists' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) as any);
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = checklists?.filter((c: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.placa?.toLowerCase().includes(s) ||
      c.nome_motorista?.toLowerCase().includes(s)
    );
  });

  const getIssueCount = (items: any[]) => {
    if (!Array.isArray(items)) return 0;
    return items.filter((i: any) => i.status === 'nao_funciona').length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por placa ou motorista..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* List */}
      {!filtered?.length ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum checklist encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((checklist: any) => {
            const items = Array.isArray(checklist.items) ? checklist.items : [];
            const issues = getIssueCount(items);
            const total = items.length;
            return (
              <Card key={checklist.id} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold">{checklist.placa}</p>
                        <p className="text-xs text-muted-foreground">{checklist.nome_motorista}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {formatDateForDisplay(checklist.data || checklist.created_at)}
                        </Badge>
                        {checklist.km && (
                          <Badge variant="secondary" className="text-xs">
                            {Number(checklist.km).toLocaleString('pt-BR')} km
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">{total} itens</p>
                        {issues > 0 ? (
                          <p className="text-xs text-destructive font-medium">{issues} problema(s)</p>
                        ) : (
                          <p className="text-xs text-primary font-medium">Tudo OK</p>
                        )}
                      </div>
                      {issues > 0 ? (
                        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedChecklist(checklist)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedChecklist} onOpenChange={() => setSelectedChecklist(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4" />
              Checklist — {selectedChecklist?.placa}
            </DialogTitle>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{selectedChecklist?.nome_motorista}</span>
              <span>•</span>
              <span>{formatDateForDisplay(selectedChecklist?.data || selectedChecklist?.created_at)}</span>
              {selectedChecklist?.km && (
                <>
                  <span>•</span>
                  <span>{Number(selectedChecklist.km).toLocaleString('pt-BR')} km</span>
                </>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="divide-y divide-border">
              {(Array.isArray(selectedChecklist?.items) ? selectedChecklist.items : []).map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-start gap-3">
                  {item.status === 'funciona' ? (
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.item}</p>
                    {item.observacao && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.observacao}</p>
                    )}
                  </div>
                  <Badge
                    variant={item.status === 'funciona' ? 'default' : 'destructive'}
                    className="text-[10px] flex-shrink-0"
                  >
                    {item.status === 'funciona' ? 'OK' : 'Problema'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistHistory;
