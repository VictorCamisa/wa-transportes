
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ViewJanuaryServices = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços de Janeiro 2025</h1>
          <p className="text-gray-600">As tabelas de serviços foram removidas do sistema</p>
        </div>
      </div>

      {/* Mensagem informativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Tabelas Removidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500 text-center">
              As tabelas de serviços de Janeiro foram completamente removidas do banco de dados.
              Esta funcionalidade não está mais disponível.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewJanuaryServices;
