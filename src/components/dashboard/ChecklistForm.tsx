
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ChecklistItem {
  item: string;
  status: 'funciona' | 'nao_funciona' | '';
  observacao: string;
}

const ChecklistForm = () => {
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [data, setData] = useState<Date>();
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { item: 'Freio de mão', status: '', observacao: '' },
    { item: 'Freio de pé', status: '', observacao: '' },
    { item: 'Luzes', status: '', observacao: '' },
    { item: 'KM', status: '', observacao: '' },
    { item: 'Pneus', status: '', observacao: '' },
    { item: 'Água', status: '', observacao: '' },
    { item: 'Óleo', status: '', observacao: '' }
  ]);

  const updateChecklistItem = (index: number, field: keyof ChecklistItem, value: string) => {
    setChecklist(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!veiculo || !placa || !motorista || !data) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todas as informações do veículo.",
        variant: "destructive"
      });
      return;
    }

    const incompleteChecklist = checklist.some(item => !item.status);
    if (incompleteChecklist) {
      toast({
        title: "Checklist incompleto",
        description: "Por favor, marque o status de todos os itens do checklist.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Checklist salvo com sucesso!",
      description: "As informações do veículo foram registradas.",
    });
    
    console.log('Checklist data:', { veiculo, placa, motorista, data, checklist });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Informações do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="veiculo">Veículo</Label>
                <Input
                  id="veiculo"
                  value={veiculo}
                  onChange={(e) => setVeiculo(e.target.value)}
                  placeholder="Modelo do veículo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  placeholder="Placa do veículo"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !data && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data ? format(data, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={setData}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motorista">Motorista Responsável</Label>
                <Input
                  id="motorista"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  placeholder="Nome do motorista"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funcionamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium border-b pb-2">
              <div>Item</div>
              <div className="text-center">Funciona</div>
              <div className="text-center">Não Funciona</div>
              <div>Observação</div>
            </div>
            
            {checklist.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="font-medium">{item.item}</div>
                
                <div className="flex justify-center">
                  <RadioGroup
                    value={item.status}
                    onValueChange={(value) => updateChecklistItem(index, 'status', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="funciona" id={`${index}-funciona`} />
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-center">
                  <RadioGroup
                    value={item.status}
                    onValueChange={(value) => updateChecklistItem(index, 'status', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao_funciona" id={`${index}-nao-funciona`} />
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Textarea
                    value={item.observacao}
                    onChange={(e) => updateChecklistItem(index, 'observacao', e.target.value)}
                    placeholder="Observação"
                    className="min-h-[40px]"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit}>
              Salvar Checklist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecklistForm;
