import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useValueVisibility } from '@/hooks/useValueVisibility';
import { useToast } from '@/hooks/use-toast';

const ValueToggleButton = () => {
  const { valuesVisible, setValuesVisible } = useValueVisibility();
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleToggle = () => {
    if (valuesVisible) {
      // Se valores estão visíveis, ocultar sem senha
      setValuesVisible(false);
      toast({
        title: "Valores ocultados",
        description: "Os valores monetários foram ocultados por segurança.",
      });
    } else {
      // Se valores estão ocultos, mostrar dialog para senha
      setShowDialog(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'Admin123') {
      setValuesVisible(true);
      setShowDialog(false);
      setPassword('');
      toast({
        title: "Valores visíveis",
        description: "Os valores monetários agora estão visíveis.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha informada está incorreta.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPassword('');
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {valuesVisible ? (
          <>
            <EyeOff className="h-4 w-4" />
            Ocultar Valores
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Mostrar Valores
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Autenticação Necessária
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Digite a senha para visualizar os valores monetários:
            </p>
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handlePasswordSubmit}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ValueToggleButton;