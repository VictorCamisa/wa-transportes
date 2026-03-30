import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, History } from 'lucide-react';
import ChecklistNew from './checklist/ChecklistNew';
import ChecklistHistory from './checklist/ChecklistHistory';

const ChecklistForm = () => {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Novo Checklist
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <ChecklistNew onSuccess={() => setActiveTab('history')} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ChecklistHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChecklistForm;
