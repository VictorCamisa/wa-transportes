
import React from 'react';
import { Button } from '@/components/ui/button';

interface CostFormActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

const CostFormActions: React.FC<CostFormActionsProps> = ({ isSubmitting, onClose }) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Cadastrar Custo'}
      </Button>
    </div>
  );
};

export default CostFormActions;
