import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, DollarSign, FileText, Eye, EyeOff, Truck, Calendar, Menu, LogOut, Home, UserCheck, Car, ClipboardList, MapPin } from 'lucide-react';
import ValueToggleButton from '@/components/dashboard/ValueToggleButton';
import { useValueVisibility } from '@/hooks/useValueVisibility';
import { useServicesKPI } from '@/hooks/useServicesKPI';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import KPICards from '@/components/dashboard/KPICards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import CostChart from '@/components/dashboard/CostChart';
import RecentServicesList from '@/components/dashboard/RecentServicesList';
import RecentCostsList from '@/components/dashboard/RecentCostsList';
import ServiceForm from '@/components/dashboard/ServiceForm';
import CostForm from '@/components/dashboard/CostForm';
import UserForm from '@/components/dashboard/UserForm';
import ChecklistForm from '@/components/dashboard/ChecklistForm';
import EnhancedDashboardFilters from '@/components/dashboard/EnhancedDashboardFilters';
import ViewServices from '@/components/dashboard/ViewServices';
import ViewCosts from '@/components/dashboard/ViewCosts';
import UsersList from '@/components/dashboard/UsersList';
import CreateChecklistUsers from '@/components/dashboard/CreateChecklistUsers';
import ResetOxinhoPassword from '@/components/dashboard/ResetOxinhoPassword';
import FechamentoTab from '@/components/dashboard/FechamentoTab';
import ProtectedComponent from '@/components/ProtectedComponent';
import MotoristasTab from '@/components/dashboard/MotoristasTab';
import VeiculosTab from '@/components/dashboard/VeiculosTab';
import OrdensServicoTab from '@/components/dashboard/OrdensServicoTab';
import TabelaPrecosTab from '@/components/dashboard/TabelaPrecosTab';
import LiveMap from '@/components/dashboard/LiveMap';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardFilters {
  startDate: string;
  endDate: string;
  empresa: string;
  tipoCusto: string;
  cidade: string;
  mes: string;
}

// Tab items definition com permissões
const getAllTabItems = () => [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, permission: 'dashboard_view' },
  { id: 'services', label: 'Serviços', icon: FileText, permission: 'services_view' },
  { id: 'costs', label: 'Custos', icon: DollarSign, permission: 'costs_view' },
  { id: 'fechamento', label: 'Fechamento', icon: Calendar, permission: 'dashboard_view' },
  { id: 'users', label: 'Usuários', icon: Users, permission: 'users_manage' },
  { id: 'checklist', label: 'Checklist', icon: Truck, permission: 'checklist_access' },
  { id: 'motoristas', label: 'Motoristas', icon: UserCheck, permission: 'users_manage' },
  { id: 'veiculos', label: 'Veículos', icon: Car, permission: 'users_manage' },
  { id: 'ordens_servico', label: 'Ordens de Serviço', icon: ClipboardList, permission: 'services_view' },
  { id: 'tabela_precos', label: 'Tabela de Preços', icon: DollarSign, permission: 'users_manage' },
  { id: 'mapa', label: 'Mapa ao Vivo', icon: MapPin, permission: 'dashboard_view' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { hasPermission, isAdmin, loading: permissionsLoading } = usePermissions();
  
  // Filtrar abas baseado nas permissões
  const tabItems = getAllTabItems().filter(tab => {
    return isAdmin || hasPermission(tab.permission);
  });
  
  // Definir aba inicial baseada nas permissões do usuário
  const getInitialTab = () => {
    // Se é admin, começa no dashboard
    if (isAdmin) return 'dashboard';

    // Se só tem acesso ao checklist, vai direto pro checklist
    if (!isAdmin && hasPermission('checklist_access') && !hasPermission('dashboard_view') && !hasPermission('services_view')) {
      return 'checklist';
    }
    
    // Se tem acesso aos serviços (como Paula), vai para serviços
    if (hasPermission('services_view')) {
      return 'services';
    }
    
    // Se tem acesso ao dashboard, vai para o dashboard
    if (hasPermission('dashboard_view')) {
      return 'dashboard';
    }
    
    // Se tem acesso ao checklist, vai para o checklist
    if (hasPermission('checklist_access')) {
      return 'checklist';
    }
    
    // Fallback: primeira aba disponível
    if (tabItems.length > 0) {
      return tabItems[0].id;
    }
    
    // Se não tem nenhuma aba, retorna dashboard mesmo assim
    return 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    return tabFromUrl || 'dashboard';
  });

  // Atualizar aba quando as permissões carregarem
  useEffect(() => {
    if (profile && !permissionsLoading) {
      if (tabItems.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const tabFromUrl = urlParams.get('tab');

        // Se tem aba na URL e o usuário tem permissão, usa ela
        if (tabFromUrl) {
          const requestedTab = getAllTabItems().find(tab => tab.id === tabFromUrl);
          if (requestedTab && (isAdmin || hasPermission(requestedTab.permission))) {
            setActiveTab(tabFromUrl);
            return;
          }
        }

        // Se a aba atual não está mais disponível, mudar para uma válida
        const currentTabAvailable = tabItems.some(tab => tab.id === activeTab);
        if (!currentTabAvailable && tabItems.length > 0) {
          const initialTab = getInitialTab();
          if (initialTab) {
            setActiveTab(initialTab);
          }
        }
      }
    }
  }, [profile, isAdmin, hasPermission, tabItems, permissionsLoading]);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isCostFormOpen, setIsCostFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { valuesVisible: showValues } = useValueVisibility();
  const [filters, setFilters] = useState<DashboardFilters>({
    startDate: '',
    endDate: '',
    empresa: '',
    tipoCusto: '',
    cidade: '',
    mes: ''
  });

  const { kpiData, revenueByClient, recentServices, loading: kpiLoading } = useServicesKPI(filters);

  useEffect(() => {
    if (!loading && !user) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate('/login');
    }
  }, [user, loading, navigate]);


  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Redirecionando para o site...",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleGoToSite = () => {
    navigate('/');
  };

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      empresa: '',
      tipoCusto: '',
      cidade: '',
      mes: ''
    });
  };

  const handleTabChange = (tab: string) => {
    const tabItem = getAllTabItems().find(t => t.id === tab);
    if (tabItem && (isAdmin || hasPermission(tabItem.permission))) {
      setActiveTab(tab);
      setIsMobileMenuOpen(false);
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <EnhancedDashboardFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
            
            <KPICards data={kpiData} loading={kpiLoading} showValues={showValues} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={revenueByClient || []} loading={kpiLoading} showValues={showValues} />
              <CostChart data={kpiData} loading={kpiLoading} showValues={showValues} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentServicesList showValues={showValues} />
              <RecentCostsList showValues={showValues} />
            </div>
          </div>
        );
      case 'services':
        return <ViewServices />;
      case 'costs':
        return <ViewCosts />;
      case 'fechamento':
        return <FechamentoTab />;
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
                <p className="text-gray-600">Crie e gerencie usuários do sistema</p>
              </div>
              {(isAdmin || hasPermission('users_manage')) && (
                <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário/Motorista
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <UserForm onClose={() => setIsUserFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {isAdmin && <CreateChecklistUsers />}
            {isAdmin && <ResetOxinhoPassword />}
            <UsersList />
          </div>
        );
      case 'checklist':
        return <ChecklistForm />;
      case 'motoristas':
        return <MotoristasTab />;
      case 'veiculos':
        return <VeiculosTab />;
      case 'ordens_servico':
        return <OrdensServicoTab />;
      case 'tabela_precos':
        return <TabelaPrecosTab />;
      case 'mapa':
        return <LiveMap />;
      default:
        return null;
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Se ainda está carregando permissões, mostrar loading
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando permissões...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não tem nenhuma aba disponível, mostrar mensagem
  if (tabItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Limitado</h2>
          <p className="text-gray-600 mb-4">
            Sua conta não possui permissões para acessar o sistema no momento.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Email: {profile?.email}
          </p>
          <Button onClick={handleLogout} variant="outline">
            Fazer Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Mobile/Desktop */}
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
              {profile && (
                <span className="ml-2 lg:ml-4 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {profile.role === 'admin' ? 'Admin' : 'Usuário'}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Botões de navegação */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToSite}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Site</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>

              {/* Toggle de Visibilidade dos Valores */}
              <ValueToggleButton />

              {/* Desktop Action Buttons - baseado em permissões */}
              <div className="hidden lg:flex items-center space-x-4">
                {(isAdmin || hasPermission('services_create')) && (
                  <Dialog open={isServiceFormOpen} onOpenChange={setIsServiceFormOpen}>
                    <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Serviço
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ServiceForm onClose={() => setIsServiceFormOpen(false)} />
                  </DialogContent>
                </Dialog>
                )}
                
                {(isAdmin || hasPermission('costs_create')) && (
                  <Dialog open={isCostFormOpen} onOpenChange={setIsCostFormOpen}>
                    <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Custo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <CostForm onClose={() => setIsCostFormOpen(false)} />
                  </DialogContent>
                </Dialog>
                )}
                
                {(isAdmin || hasPermission('users_manage')) && (
                  <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
                    <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <UserForm onClose={() => setIsUserFormOpen(false)} />
                  </DialogContent>
                </Dialog>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-6">
                    <h2 className="text-lg font-semibold mb-4">Menu</h2>
                    
                    {/* Botões de navegação mobile */}
                    <div className="space-y-2 border-b pb-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          handleGoToSite();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Ir para o Site
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair do Sistema
                      </Button>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {tabItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                              activeTab === item.id
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Action Buttons - baseado em permissões */}
                    <div className="pt-4 border-t space-y-3">
                      {(isAdmin || hasPermission('services_create')) && (
                        <Dialog open={isServiceFormOpen} onOpenChange={setIsServiceFormOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsMobileMenuOpen(false)}>
                              <Plus className="h-4 w-4 mr-2" />
                            Novo Serviço
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <ServiceForm onClose={() => setIsServiceFormOpen(false)} />
                        </DialogContent>
                      </Dialog>
                      )}
                      
                      {(isAdmin || hasPermission('costs_create')) && (
                        <Dialog open={isCostFormOpen} onOpenChange={setIsCostFormOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50" onClick={() => setIsMobileMenuOpen(false)}>
                              <Plus className="h-4 w-4 mr-2" />
                            Novo Custo
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <CostForm onClose={() => setIsCostFormOpen(false)} />
                        </DialogContent>
                      </Dialog>
                      )}
                      
                      {(isAdmin || hasPermission('users_manage')) && (
                        <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>
                              <Plus className="h-4 w-4 mr-2" />
                            Novo Usuário
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <UserForm onClose={() => setIsUserFormOpen(false)} />
                        </DialogContent>
                      </Dialog>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex space-x-8 overflow-x-auto">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 inline mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation Tabs - Scrollable */}
          <div className="lg:hidden flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 py-2 px-3 rounded-full font-medium text-xs whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;
