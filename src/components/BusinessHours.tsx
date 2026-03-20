
import React from 'react';
import { Clock } from 'lucide-react';

const BusinessHours = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Clock className="h-6 w-6 mr-3" />
        Horário de Atendimento
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Segunda a Sexta:</span>
          <span className="font-semibold">7h às 19h</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Finais de Semana:</span>
          <span className="text-blue-200">Somente Emergências</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm text-blue-200">
            💡 Atendimento 24/7 para rastreamento e emergências
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHours;
