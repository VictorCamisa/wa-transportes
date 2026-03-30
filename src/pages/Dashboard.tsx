import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Plus, TrendingUp, Users, DollarSign, FileText, Truck, Calendar,
  Menu, LogOut, Home, UserCheck, Car, ClipboardList, MapPin, LayoutDashboard, Building2,
} from 'lucide-react';
import { Settings } from 'lucide-react';
import UsersManagement from '@/components/dashboard/UsersManagement';
import SettingsPage from '@/components/dashboard/SettingsPage';
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
import MotoristasTab from '@/components/dashboard/MotoristasTab';
import VeiculosTab from '@/components/dashboard/VeiculosTab';
import OrdensServicoTab from '@/components/dashboard/OrdensServicoTab';
import TabelaPrecosTab from '@/components/dashboard/TabelaPrecosTab';
import LiveMap from '@/components/dashboard/LiveMap';
import EmpresasTab from '@/components/dashboard/EmpresasTab';

interface DashboardFilters {
  startDate: string;
  endDate: string;
  empresa: string;
  tipoCusto: string;
  cidade: string;
  mes: string;
}

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',          icon: LayoutDashboard, permission: 'dashboard_view' },
  { id: 'empresas',       label: 'Empresas',            icon: Building2,       permission: 'services_view' },
  { id: 'services',       label: 'Serviços',            icon: FileText,        permission: 'services_view' },
  { id: 'costs',          label: 'Custos',              icon: DollarSign,      permission: 'costs_view' },
  { id: 'ordens_servico', label: 'Ordens de Serviço',  icon: ClipboardList,   permission: 'services_view' },
  { id: 'fechamento',     label: 'Fechamento',          icon: Calendar,        permission: 'dashboard_view' },
  { id: 'motoristas',     label: 'Motoristas',          icon: UserCheck,       permission: 'users_manage' },
  { id: 'veiculos',       label: 'Veículos',            icon: Car,             permission: 'users_manage' },
  { id: 'tabela_precos',  label: 'Tabela de Preços',   icon: DollarSign,      permission: 'users_manage' },
  { id: 'checklist',      label: 'Checklist',           icon: Truck,           permission: 'checklist_access' },
  { id: 'mapa',           label: 'Mapa ao Vivo',        icon: MapPin,          permission: 'dashboard_view' },
  { id: 'users',          label: 'Usuários',            icon: Users,           permission: 'users_manage' },
  { id: 'configuracoes',  label: 'Configurações',       icon: Settings,        permission: 'users_manage' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { hasPermission, isAdmin, loading: permissionsLoading } = usePermissions();
  

  const navItems = NAV_ITEMS.filter(item => isAdmin || hasPermission(item.permission));

  const getInitialTab = () => {
    if (isAdmin) return 'dashboard';
    if (hasPermission('checklist_access') && !hasPermission('dashboard_view') && !hasPermission('services_view')) return 'checklist';
    if (hasPermission('services_view')) return 'services';
    if (hasPermission('dashboard_view')) return 'dashboard';
    if (hasPermission('checklist_access')) return 'checklist';
    return navItems[0]?.id || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('tab');
    return p || 'dashboard';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isCostFormOpen, setIsCostFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const [filters, setFilters] = useState<DashboardFilters>({
    startDate: '', endDate: '', empresa: '', tipoCusto: '', cidade: '', mes: '',
  });

  const { kpiData, revenueByClient, recentServices, loading: kpiLoading } = useServicesKPI(filters);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile && !permissionsLoading && navItems.length > 0) {
      const tabFromUrl = new URLSearchParams(window.location.search).get('tab');
      if (tabFromUrl) {
        const req = NAV_ITEMS.find(t => t.id === tabFromUrl);
        if (req && (isAdmin || hasPermission(req.permission))) { setActiveTab(tabFromUrl); return; }
      }
      const currentAvailable = navItems.some(t => t.id === activeTab);
      if (!currentAvailable) setActiveTab(getInitialTab());
    }
  }, [profile, isAdmin, permissionsLoading]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
    // Sync URL for shareable links
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logout realizado com sucesso!' });
      navigate('/');
    } catch {
      toast({ title: 'Erro no logout', description: 'Tente novamente.', variant: 'destructive' });
    }
  };

  const activeLabel = navItems.find(t => t.id === activeTab)?.label || 'Dashboard';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <EnhancedDashboardFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters({ startDate: '', endDate: '', empresa: '', tipoCusto: '', cidade: '', mes: '' })}
            />
            <KPICards data={kpiData} loading={kpiLoading} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RevenueChart data={revenueByClient || []} loading={kpiLoading} />
              <CostChart data={kpiData} loading={kpiLoading} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RecentServicesList />
              <RecentCostsList />
            </div>
          </div>
        );
      case 'empresas':    return <EmpresasTab />;
      case 'services':    return <ViewServices />;
      case 'costs':       return <ViewCosts />;
      case 'fechamento':  return <FechamentoTab />;
      case 'checklist':   return <ChecklistForm />;
      case 'motoristas':  return <MotoristasTab />;
      case 'veiculos':    return <VeiculosTab />;
      case 'ordens_servico': return <OrdensServicoTab />;
      case 'tabela_precos':  return <TabelaPrecosTab />;
      case 'mapa':           return <LiveMap />;
      case 'users':          return <UsersManagement />;
      case 'configuracoes':  return <SettingsPage />;
      default:
        return null;
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  if (navItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Acesso Limitado</h2>
          <p className="text-slate-500 text-sm mb-6">Sua conta não possui permissões configuradas. Entre em contato com o administrador.</p>
          <Button variant="outline" onClick={handleLogout}>Fazer Logout</Button>
        </div>
      </div>
    );
  }

  /* ── Sidebar content (reutilizado no mobile Sheet) ── */
  const SidebarNav = ({ onSelect }: { onSelect?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">W&A Transportes</p>
            <p className="text-xs text-slate-400">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { handleTabChange(item.id); onSelect?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-blue-400">
              {(profile.username || profile.email)?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{profile.username || profile.email}</p>
            <p className="text-xs text-slate-400">{isAdmin ? 'Administrador' : 'Usuário'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Sair do sistema
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all duration-150"
        >
          <Home className="h-4 w-4" />
          Ver site
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 flex-shrink-0">
        <SidebarNav />
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-60 bg-slate-900 border-0">
                <SidebarNav onSelect={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-base font-semibold text-slate-800 leading-tight">{activeLabel}</h1>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            

            {(isAdmin || hasPermission('services_create')) && (
              <Dialog open={isServiceFormOpen} onOpenChange={setIsServiceFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="hidden sm:flex">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Novo Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <ServiceForm onClose={() => setIsServiceFormOpen(false)} />
                </DialogContent>
              </Dialog>
            )}

            {(isAdmin || hasPermission('costs_create')) && (
              <Dialog open={isCostFormOpen} onOpenChange={setIsCostFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="hidden sm:flex border-red-200 text-red-600 hover:bg-red-50">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Novo Custo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CostForm onClose={() => setIsCostFormOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 sm:pb-6 scrollbar-thin">
          {renderContent()}
        </main>

        {/* Mobile FAB for quick actions */}
        <div className="sm:hidden fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          {(isAdmin || hasPermission('services_create')) && (
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setIsServiceFormOpen(true)}>
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
