
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCostForm } from '@/hooks/useCostForm';
import CostFormFields from './CostFormFields';
import CostFormActions from './CostFormActions';

const CostForm = ({ onClose }: { onClose: () => void }) => {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit } = useCostForm(onClose);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Cadastrar Novo Custo</DialogTitle>
        <DialogDescription>
          Preencha as informações do custo
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <CostFormFields 
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />
        
        <CostFormActions 
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </DialogContent>
  );
};

export default CostForm;
