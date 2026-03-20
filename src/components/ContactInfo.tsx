
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <Phone className="h-6 w-6 mr-3" />
        Informações de Contato
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">Telefone</div>
            <div className="text-blue-100">(12) 97406-9672</div>
            <div className="text-sm text-blue-200">WhatsApp disponível</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">E-mail</div>
            <div className="text-blue-100">contato@watransportes.com.br</div>
            <div className="text-sm text-blue-200">Resposta em até 2 horas</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">Endereço</div>
            <div className="text-blue-100">
              R. Barão de Taubaté, 393 - Vila Costa<br />
              Taubaté - SP, 12050-140
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
