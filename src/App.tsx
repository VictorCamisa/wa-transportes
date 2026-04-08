
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Fechamento from "./pages/Fechamento";
import Backup from "./pages/Backup";
import BackupEmergencia from "./pages/BackupEmergencia";
import NotFound from "./pages/NotFound";
import MotoristaApp from "./pages/MotoristaApp";
import ClientPortal from "./pages/ClientPortal";
import Tutorial from "./pages/Tutorial";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
              <Route path="/motorista" element={<MotoristaApp />} />
              <Route path="/portal" element={<ClientPortal />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
