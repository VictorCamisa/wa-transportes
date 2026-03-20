
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  LogOut,
  Download
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lancar-servico', label: 'Lançar Serviço', icon: FileText },
    { id: 'cadastrar-custo', label: 'Cadastrar Custo', icon: DollarSign },
    { id: 'ver-servicos', label: 'Ver Serviços', icon: Eye },
    { id: 'ver-custos', label: 'Ver Custos', icon: TrendingUp },
    { id: 'fechamento', label: 'Fechamento', icon: Calendar },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'backup', label: 'Backup', icon: Download, route: '/backup' },
  ];

  // Determinar o nome a ser exibido
  const displayName = profile?.username || user?.email?.split('@')[0] || 'Usuário';

  return (
    <Sidebar>
      <SidebarHeader className="p-4 sm:p-6 border-b">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">WA Transportes</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const hasRoute = 'route' in item && item.route;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => {
                        if (hasRoute) {
                          navigate(item.route as string);
                        } else {
                          onTabChange(item.id);
                        }
                      }}
                      className="w-full justify-start text-sm sm:text-base"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 sm:p-4 border-t">
        {!isMobile && (
          <div className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{displayName}</div>
        )}
        <Button 
          variant="destructive" 
          className="w-full text-xs sm:text-sm h-8 sm:h-10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
