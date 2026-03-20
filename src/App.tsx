
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ValueVisibilityProvider } from "@/hooks/useValueVisibility";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Fechamento from "./pages/Fechamento";
import Backup from "./pages/Backup";
import BackupEmergencia from "./pages/BackupEmergencia";
import NotFound from "./pages/NotFound";
import React from "react";

// Criar o queryClient fora do componente para evitar recriação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log('App: Inicializando aplicação...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ValueVisibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fechamento" element={<Fechamento />} />
                <Route path="/backup" element={<Backup />} />
                <Route path="/backup-emergencia/:key?" element={<BackupEmergencia />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ValueVisibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
