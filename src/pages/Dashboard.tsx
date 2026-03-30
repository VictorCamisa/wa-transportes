
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Plus, TrendingUp, Users, DollarSign, FileText, Truck, Calendar,
  Menu, LogOut, Home, UserCheck, Car, ClipboardList, MapPin, LayoutDashboard, Building2,
  ChevronDown, Settings,
} from 'lucide-react';
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
import ChecklistForm from '@/components/dashboard/ChecklistForm';
import EnhancedDashboardFilters from '@/components/dashboard/EnhancedDashboardFilters';
import ViewServices from '@/components/dashboard/ViewServices';
import ViewCosts from '@/components/dashboard/ViewCosts';
import FechamentoTab from '@/components/dashboard/FechamentoTab';
import MotoristasTab from '@/components/dashboard/MotoristasTab';
import VeiculosTab from '@/components/dashboard/VeiculosTab';
import OrdensServicoTab from '@/components/dashboard/OrdensServicoTab';
import TabelaPrecosTab from '@/components/dashboard/TabelaPrecosTab';
import LiveMap from '@/components/dashboard/LiveMap';
import EmpresasTab from '@/components/dashboard/EmpresasTab';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DashboardFilters {
  startDate: string;
  endDate: string;
  empresa: string;
  tipoCusto: string;
  cidade: string;
  mes: string;
}

/* ── Sidebar groups ── */
const NAV_GROUPS = [
  {
    label: 'Geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard_view' },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { id: 'empresas',       label: 'Empresas',           icon: Building2,     permission: 'services_view' },
      { id: 'services',       label: 'Serviços',           icon: FileText,      permission: 'services_view' },
      { id: 'ordens_servico', label: 'Ordens de Serviço',  icon: ClipboardList, permission: 'services_view' },
      { id: 'checklist',      label: 'Checklist',          icon: Truck,         permission: 'checklist_access' },
      { id: 'mapa',           label: 'Mapa ao Vivo',       icon: MapPin,        permission: 'dashboard_view' },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { id: 'costs',          label: 'Custos',             icon: DollarSign,    permission: 'costs_view' },
      { id: 'fechamento',     label: 'Fechamento',         icon: Calendar,      permission: 'dashboard_view' },
    ],
  },
  {
    label: 'Administração',
    items: [
      { id: 'motoristas',     label: 'Motoristas',         icon: UserCheck,     permission: 'users_manage' },
      { id: 'veiculos',       label: 'Veículos',           icon: Car,           permission: 'users_manage' },
      { id: 'users',          label: 'Usuários',           icon: Users,         permission: 'users_manage' },
      { id: 'configuracoes',  label: 'Configurações',      icon: Settings,      permission: 'users_manage' },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { hasPermission, isAdmin, loading: permissionsLoading } = usePermissions();

  const visibleGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => isAdmin || hasPermission(item.permission)),
  })).filter(group => group.items.length > 0);

  const navItems = visibleGroups.flatMap(g => g.items);

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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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
        const req = ALL_NAV_ITEMS.find(t => t.id === tabFromUrl);
        if (req && (isAdmin || hasPermission(req.permission))) { setActiveTab(tabFromUrl); return; }
      }
      const currentAvailable = navItems.some(t => t.id === activeTab);
      if (!currentAvailable) setActiveTab(getInitialTab());
    }
  }, [profile, isAdmin, permissionsLoading]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
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

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const activeLabel = navItems.find(t => t.id === activeTab)?.label || 'Dashboard';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              {(isAdmin || hasPermission('services_create')) && (
                <Button onClick={() => setIsServiceFormOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Serviço
                </Button>
              )}
              {(isAdmin || hasPermission('costs_create')) && (
                <Button variant="outline" onClick={() => setIsCostFormOpen(true)} className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Novo Custo
                </Button>
              )}
              {(isAdmin || hasPermission('services_view')) && (
                <Button variant="ghost" onClick={() => handleTabChange('services')} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Ver Serviços
                </Button>
              )}
              {(isAdmin || hasPermission('costs_view')) && (
                <Button variant="ghost" onClick={() => handleTabChange('costs')} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ver Custos
                </Button>
              )}
            </div>

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
      case 'empresas':       return <EmpresasTab />;
      case 'services':       return <ViewServices />;
      case 'costs':          return <ViewCosts />;
      case 'fechamento':     return <FechamentoTab />;
      case 'checklist':      return <ChecklistForm />;
      case 'motoristas':     return <MotoristasTab />;
      case 'veiculos':       return <VeiculosTab />;
      case 'ordens_servico': return <OrdensServicoTab />;
      case 'tabela_precos':  return <TabelaPrecosTab />;
      case 'mapa':           return <LiveMap />;
      case 'users':          return <UsersManagement />;
      case 'configuracoes':  return <SettingsPage />;
      default:               return null;
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  if (navItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Acesso Limitado</h2>
          <p className="text-muted-foreground text-sm mb-6">Sua conta não possui permissões configuradas. Entre em contato com o administrador.</p>
          <Button variant="outline" onClick={handleLogout}>Fazer Logout</Button>
        </div>
      </div>
    );
  }

  /* ── Sidebar content (reutilizado no mobile Sheet) ── */
  const SidebarNav = ({ onSelect }: { onSelect?: () => void }) => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-primary-foreground leading-tight truncate">W&A Transportes</p>
            <p className="text-[11px] text-sidebar-foreground/60">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin space-y-4">
        {visibleGroups.map((group) => (
          <Collapsible
            key={group.label}
            open={collapsedGroups[group.label] !== true}
            onOpenChange={() => toggleGroup(group.label)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-colors">
              <span>{group.label}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${collapsedGroups[group.label] ? '-rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { handleTabChange(item.id); onSelect?.(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-sidebar-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-sidebar-primary">
              {(profile.username || profile.email)?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-primary-foreground truncate">{profile.username || profile.email}</p>
            <p className="text-[11px] text-sidebar-foreground/60">{isAdmin ? 'Administrador' : 'Usuário'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Sair do sistema
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
        >
          <Home className="h-4 w-4" />
          Ver site
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r border-border">
        <SidebarNav />
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header - minimal */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px] border-0">
                <SidebarNav onSelect={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-sm font-semibold text-foreground leading-tight">{activeLabel}</h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 sm:pb-6 scrollbar-thin">
          {renderContent()}
        </main>
      </div>

      {/* Dialogs - always rendered */}
      <Dialog open={isServiceFormOpen} onOpenChange={setIsServiceFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ServiceForm onClose={() => setIsServiceFormOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isCostFormOpen} onOpenChange={setIsCostFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <CostForm onClose={() => setIsCostFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
