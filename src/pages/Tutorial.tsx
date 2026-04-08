import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LayoutDashboard, Building2, FileText, Truck, MapPin, DollarSign,
  Calendar, UserCheck, Car, Users, Settings, Smartphone, Globe,
  BookOpen, CheckCircle2, Circle, ChevronRight, ArrowLeft, Plus,
  Eye, Download, Search, Shield, Edit, Trash2, RefreshCw,
  Map, Lock, Key, Menu, BarChart2,
} from 'lucide-react';

const STORAGE_KEY = 'wa_tutorial_progress';

interface TutorialModule {
  id: string;
  label: string;
  icon: React.ElementType;
  group: string;
  groupColor: string;
  badgeClass: string;
  description: string;
  features: string[];
  steps: string[];
  buttons: { name: string; desc: string }[];
}

const MODULES: TutorialModule[] = [
  {
    id: 'welcome',
    label: 'Bem-vindo',
    icon: BookOpen,
    group: 'Início',
    groupColor: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    description:
      'O WA Transportes é um sistema completo de gestão de transporte e logística. Aqui você gerencia empresas clientes, serviços realizados, custos operacionais, motoristas, veículos e muito mais — tudo em um só lugar.',
    features: [
      'Dashboard com indicadores em tempo real (KPIs)',
      'Gestão de empresas e serviços de transporte',
      'Controle financeiro: custos e fechamento mensal',
      'Cadastro e controle de motoristas e veículos',
      'Checklist de inspeção veicular',
      'Mapa ao vivo com rastreamento GPS dos motoristas',
      'Portal do cliente para acompanhamento de serviços',
      'App mobile para motoristas',
      'Gerenciamento de usuários com permissões',
    ],
    steps: [
      'Faça login com seu e-mail e senha em /login.',
      'Você será redirecionado ao Dashboard principal.',
      'Use o menu lateral esquerdo para navegar entre os módulos.',
      'No topo do conteúdo você encontra ações rápidas (botões de atalho).',
      'Percorra este tutorial para aprender cada módulo em detalhes.',
    ],
    buttons: [
      { name: 'Entrar', desc: 'Botão de login — autentica com e-mail e senha.' },
      { name: 'Acesso de Motorista', desc: 'Checkbox na tela de login que redireciona direto ao Checklist.' },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'Geral',
    groupColor: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    description:
      'O Dashboard é a tela principal do sistema. Exibe indicadores-chave de desempenho (KPIs), gráficos de receita e custos, lista dos serviços e custos mais recentes, além de ações rápidas para as operações mais comuns.',
    features: [
      'Cards de KPIs: total de serviços, receita, custos e saldo do período',
      'Gráfico de receita por empresa cliente',
      'Gráfico de custos por categoria',
      'Lista dos serviços mais recentes',
      'Lista dos custos mais recentes',
      'Filtros avançados por data, empresa, tipo de custo, cidade e mês',
      'Atalhos rápidos para criar serviço, criar custo e ver listagens',
    ],
    steps: [
      'Acesse o Dashboard clicando em "Dashboard" no menu lateral.',
      'Use os filtros no topo para refinar o período ou empresa exibida.',
      'Observe os 4 cards de KPIs: Serviços, Receita, Custos e Saldo.',
      'Clique em "Novo Serviço" para registrar um serviço rapidamente.',
      'Clique em "Novo Custo" para registrar uma despesa rapidamente.',
      'Clique em "Ver Serviços" ou "Ver Custos" para ir às listagens completas.',
      'Para limpar os filtros, clique em "Limpar Filtros".',
    ],
    buttons: [
      { name: 'Novo Serviço', desc: 'Abre o formulário de cadastro de novo serviço de transporte.' },
      { name: 'Novo Custo', desc: 'Abre o formulário de cadastro de nova despesa operacional.' },
      { name: 'Ver Serviços', desc: 'Navega diretamente para a aba de listagem de serviços.' },
      { name: 'Ver Custos', desc: 'Navega diretamente para a aba de listagem de custos.' },
      { name: 'Limpar Filtros', desc: 'Remove todos os filtros aplicados e exibe dados do período completo.' },
    ],
  },
  {
    id: 'empresas',
    label: 'Empresas',
    icon: Building2,
    group: 'Operacional',
    groupColor: 'text-orange-700',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    description:
      'O módulo Empresas gerencia as empresas clientes que contratam os serviços de transporte. Cada empresa pode ter acesso ao Portal do Cliente com um token exclusivo para acompanhar seus serviços.',
    features: [
      'Cadastro completo de empresas (nome, CNPJ, contato)',
      'Ativação/desativação de empresas',
      'Geração de token de acesso ao Portal do Cliente',
      'Visualização detalhada por empresa',
      'Exclusão de empresas',
    ],
    steps: [
      'Acesse "Empresas" no menu lateral (grupo Operacional).',
      'A lista de empresas cadastradas é exibida em cards ou tabela.',
      'Para cadastrar uma nova empresa, clique em "Nova Empresa" e preencha o formulário.',
      'Para ver os detalhes de uma empresa, clique no nome ou ícone de detalhes.',
      'Para ativar ou desativar uma empresa, use o botão de status.',
      'Para gerar o token do portal, acesse os detalhes da empresa e clique em "Gerar Token".',
      'Para excluir uma empresa, clique no ícone de lixeira e confirme.',
    ],
    buttons: [
      { name: 'Nova Empresa', desc: 'Abre formulário para cadastrar uma nova empresa cliente.' },
      { name: 'Ver Detalhes', desc: 'Abre a página de detalhes da empresa selecionada.' },
      { name: 'Ativar / Desativar', desc: 'Alterna o status da empresa entre ativa e inativa.' },
      { name: 'Gerar Token', desc: 'Cria ou regenera o token de acesso ao Portal do Cliente.' },
      { name: 'Excluir', desc: 'Remove permanentemente a empresa do sistema.' },
    ],
  },
  {
    id: 'servicos',
    label: 'Serviços',
    icon: FileText,
    group: 'Operacional',
    groupColor: 'text-orange-700',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    description:
      'O módulo Serviços registra e gerencia todos os serviços de transporte realizados. Permite filtrar por empresa, mês, status, exportar relatórios em PDF e editar cada serviço individualmente.',
    features: [
      'Listagem de todos os serviços cadastrados',
      'Filtros por empresa, mês, status e busca por texto',
      'Cadastro de novo serviço com todos os campos (empresa, motorista, veículo, datas, valores)',
      'Edição de serviços existentes',
      'Exclusão de serviços',
      'Exportação de relatório em PDF',
      'Visualização de status do serviço (6 status disponíveis)',
    ],
    steps: [
      'Acesse "Serviços" no menu lateral.',
      'Use os filtros (empresa, mês, busca) para encontrar serviços específicos.',
      'Para criar um serviço, clique em "Novo Serviço" e preencha: empresa, motorista, veículo, origem, destino, data, valor.',
      'Para editar um serviço, clique no ícone de edição na linha do serviço.',
      'Para excluir, clique no ícone de lixeira e confirme a ação.',
      'Para exportar em PDF, clique em "Exportar PDF" após aplicar os filtros desejados.',
    ],
    buttons: [
      { name: 'Novo Serviço', desc: 'Abre o formulário completo de cadastro de serviço.' },
      { name: 'Editar (ícone lápis)', desc: 'Abre o modal de edição do serviço selecionado.' },
      { name: 'Excluir (ícone lixeira)', desc: 'Remove o serviço do sistema após confirmação.' },
      { name: 'Exportar PDF', desc: 'Gera e baixa um relatório PDF dos serviços filtrados.' },
      { name: 'Limpar Filtros', desc: 'Remove todos os filtros e exibe todos os serviços.' },
    ],
  },
  {
    id: 'checklist',
    label: 'Checklist',
    icon: Truck,
    group: 'Operacional',
    groupColor: 'text-orange-700',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    description:
      'O módulo Checklist é usado pelos motoristas para registrar a inspeção do veículo antes de cada viagem. O formulário cobre 7 itens de verificação e o histórico fica disponível para consulta.',
    features: [
      'Formulário de inspeção com 7 itens veiculares',
      'Campos: pneus, óleo, freios, luzes, água, combustível, limpeza',
      'Registro de observações adicionais',
      'Histórico completo de checklists por motorista/veículo',
      'Associação automática ao motorista logado',
      'Rastreamento GPS integrado ao checklist',
    ],
    steps: [
      'Acesse "Checklist" no menu lateral (ou faça login como motorista).',
      'A aba "Novo Checklist" abre automaticamente.',
      'Preencha os 7 itens de inspeção marcando OK ou com problema.',
      'Adicione observações no campo de texto se necessário.',
      'Clique em "Enviar Checklist" para salvar o registro.',
      'Para ver o histórico, clique na aba "Histórico de Checklists".',
      'O histórico exibe data, motorista, veículo e resultado de cada inspeção.',
    ],
    buttons: [
      { name: 'Enviar Checklist', desc: 'Salva o checklist de inspeção no sistema.' },
      { name: 'Histórico', desc: 'Alterna para a aba de histórico de inspeções anteriores.' },
      { name: 'Novo Checklist', desc: 'Alterna para o formulário de nova inspeção.' },
    ],
  },
  {
    id: 'mapa',
    label: 'Mapa ao Vivo',
    icon: MapPin,
    group: 'Operacional',
    groupColor: 'text-orange-700',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    description:
      'O Mapa ao Vivo exibe em tempo real a posição GPS de todos os motoristas ativos. As posições são atualizadas a cada 30 segundos automaticamente.',
    features: [
      'Mapa interativo com posições GPS dos motoristas',
      'Atualização automática a cada 30 segundos',
      'Exibição de nome do motorista, velocidade e hora da última atualização',
      'Associação com ordens de serviço ativas',
      'Indicador visual de motoristas online/offline',
    ],
    steps: [
      'Acesse "Mapa ao Vivo" no menu lateral.',
      'O mapa carrega automaticamente com as últimas posições registradas.',
      'Cada pino no mapa representa um motorista ativo.',
      'Clique em um pino para ver detalhes: nome, velocidade, hora.',
      'O mapa atualiza sozinho a cada 30 segundos.',
      'Para forçar atualização, clique em "Atualizar Agora".',
    ],
    buttons: [
      { name: 'Atualizar Agora', desc: 'Força a atualização imediata das posições GPS.' },
    ],
  },
  {
    id: 'custos',
    label: 'Custos',
    icon: DollarSign,
    group: 'Financeiro',
    groupColor: 'text-green-700',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    description:
      'O módulo Custos registra todas as despesas operacionais da empresa: combustível, manutenção, pedágios, diárias, entre outros. Permite filtragem avançada e exportação em PDF.',
    features: [
      'Cadastro de custos com tipo, valor, data e forma de pagamento',
      'Filtros por data, tipo de custo, forma de pagamento e busca',
      'Edição e exclusão de custos',
      'Gráfico de custos por categoria',
      'Exportação de relatório em PDF',
      'Resumo total dos custos filtrados',
    ],
    steps: [
      'Acesse "Custos" no menu lateral (grupo Financeiro).',
      'Para cadastrar um custo, clique em "Novo Custo".',
      'Preencha: descrição, tipo de custo, valor, data, forma de pagamento.',
      'Clique em "Salvar" para registrar.',
      'Use os filtros para encontrar custos por período ou tipo.',
      'Para editar, clique no ícone de lápis na linha do custo.',
      'Para exportar em PDF, clique em "Exportar PDF".',
    ],
    buttons: [
      { name: 'Novo Custo', desc: 'Abre o formulário de cadastro de nova despesa.' },
      { name: 'Editar (ícone lápis)', desc: 'Abre o modal de edição do custo selecionado.' },
      { name: 'Excluir (ícone lixeira)', desc: 'Remove o custo após confirmação.' },
      { name: 'Exportar PDF', desc: 'Gera relatório PDF com os custos do período filtrado.' },
      { name: 'Limpar Filtros', desc: 'Remove os filtros aplicados.' },
    ],
  },
  {
    id: 'fechamento',
    label: 'Fechamento',
    icon: Calendar,
    group: 'Financeiro',
    groupColor: 'text-green-700',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    description:
      'O Fechamento é o módulo de conciliação financeira mensal. Agrupa todos os serviços por empresa em um período e gera o relatório de fechamento para faturamento.',
    features: [
      'Seleção de período (data início e fim)',
      'Filtro por empresa',
      'Listagem de todos os serviços do período por empresa',
      'Cálculo automático de totais',
      'Verificação de consistência dos dados',
      'Exportação do fechamento em PDF',
    ],
    steps: [
      'Acesse "Fechamento" no menu lateral.',
      'Selecione o período desejado (data início e data fim).',
      'Escolha a empresa ou deixe em branco para ver todas.',
      'O sistema lista automaticamente todos os serviços do período.',
      'Confira os totais exibidos por empresa.',
      'Clique em "Exportar PDF" para gerar o relatório de fechamento.',
    ],
    buttons: [
      { name: 'Filtrar', desc: 'Aplica o período e empresa selecionados.' },
      { name: 'Exportar PDF', desc: 'Gera o relatório de fechamento em PDF.' },
      { name: 'Verificar Consistência', desc: 'Checa e corrige inconsistências nos dados do período.' },
    ],
  },
  {
    id: 'motoristas',
    label: 'Motoristas',
    icon: UserCheck,
    group: 'Administração',
    groupColor: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    description:
      'O módulo Motoristas gerencia o cadastro de todos os motoristas da frota. Controla dados pessoais, CNH, status e informações de contato.',
    features: [
      'Cadastro completo do motorista (nome, CPF, CNH, validade CNH)',
      'Status do motorista: Ativo, Inativo, Férias, Afastado',
      'Dados de contato: telefone, e-mail',
      'Associação de veículo ao motorista',
      'Histórico de serviços por motorista',
    ],
    steps: [
      'Acesse "Motoristas" no menu lateral (grupo Administração).',
      'A lista de motoristas é exibida com nome, CNH e status.',
      'Para cadastrar, clique em "Novo Motorista" e preencha os dados.',
      'Para editar, clique no ícone de lápis ao lado do motorista.',
      'Para alterar o status, use o menu de status na linha do motorista.',
      'Para excluir, clique no ícone de lixeira.',
    ],
    buttons: [
      { name: 'Novo Motorista', desc: 'Abre o formulário de cadastro de motorista.' },
      { name: 'Editar (ícone lápis)', desc: 'Edita os dados do motorista selecionado.' },
      { name: 'Status', desc: 'Altera o status: Ativo / Inativo / Férias / Afastado.' },
      { name: 'Excluir (ícone lixeira)', desc: 'Remove o motorista do sistema.' },
    ],
  },
  {
    id: 'veiculos',
    label: 'Veículos',
    icon: Car,
    group: 'Administração',
    groupColor: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    description:
      'O módulo Veículos controla toda a frota da empresa. Armazena dados técnicos, documentação (CRLV), seguro e status de cada veículo.',
    features: [
      'Cadastro de veículo: placa, modelo, ano, capacidade',
      'Controle de vencimento do seguro e CRLV',
      'Status do veículo: Ativo / Inativo / Manutenção',
      'Associação de motorista responsável',
      'Alertas de documentos próximos ao vencimento',
    ],
    steps: [
      'Acesse "Veículos" no menu lateral.',
      'A frota é listada com placa, modelo, status e datas de documentos.',
      'Para cadastrar, clique em "Novo Veículo" e preencha os dados.',
      'Para editar, clique no ícone de lápis.',
      'Fique atento às datas de vencimento destacadas em vermelho.',
      'Para excluir um veículo, clique no ícone de lixeira.',
    ],
    buttons: [
      { name: 'Novo Veículo', desc: 'Abre o formulário de cadastro de veículo.' },
      { name: 'Editar (ícone lápis)', desc: 'Edita os dados do veículo selecionado.' },
      { name: 'Status', desc: 'Altera o status: Ativo / Inativo / Manutenção.' },
      { name: 'Excluir (ícone lixeira)', desc: 'Remove o veículo da frota.' },
    ],
  },
  {
    id: 'usuarios',
    label: 'Usuários',
    icon: Users,
    group: 'Administração',
    groupColor: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    description:
      'O módulo Usuários gerencia todas as contas de acesso ao sistema. Define permissões por usuário, controla quem pode ver e editar cada área do sistema.',
    features: [
      'Listagem de todos os usuários cadastrados',
      'Criação de novos usuários com e-mail e senha',
      'Ativação e desativação de contas',
      'Sistema de permissões granular (RBAC)',
      'Perfil detalhado por usuário',
      'Flag de administrador com acesso total',
    ],
    steps: [
      'Acesse "Usuários" no menu lateral.',
      'A lista exibe nome, e-mail, status e tipo de cada usuário.',
      'Para criar um usuário, clique em "Novo Usuário" e preencha os dados.',
      'Para definir permissões, acesse o perfil do usuário e marque as permissões desejadas.',
      'Para ativar/desativar, use o botão de status na linha do usuário.',
      'Usuários administradores têm acesso total a todos os módulos.',
    ],
    buttons: [
      { name: 'Novo Usuário', desc: 'Abre o formulário de criação de usuário.' },
      { name: 'Ver Perfil', desc: 'Abre os detalhes e permissões do usuário.' },
      { name: 'Ativar / Desativar', desc: 'Alterna o status de acesso do usuário.' },
      { name: 'Permissões', desc: 'Define quais módulos o usuário pode acessar.' },
      { name: 'Excluir', desc: 'Remove permanentemente o usuário do sistema.' },
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    group: 'Administração',
    groupColor: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    description:
      'O módulo Configurações permite personalizar o sistema com os dados da empresa e gerenciar a segurança do acesso.',
    features: [
      'Aba Empresa: nome, CNPJ, endereço, logotipo',
      'Aba Segurança: alteração de senha, política de acesso',
      'Configurações gerais do sistema',
    ],
    steps: [
      'Acesse "Configurações" no menu lateral.',
      'Na aba "Empresa", preencha os dados da empresa e salve.',
      'Na aba "Segurança", altere a senha e configure políticas de acesso.',
      'Clique em "Salvar" após cada alteração.',
    ],
    buttons: [
      { name: 'Salvar (Empresa)', desc: 'Salva as informações da empresa.' },
      { name: 'Salvar (Segurança)', desc: 'Aplica as novas configurações de segurança.' },
      { name: 'Alterar Senha', desc: 'Abre o campo para definição de nova senha.' },
    ],
  },
  {
    id: 'portal',
    label: 'Portal do Cliente',
    icon: Globe,
    group: 'Especial',
    groupColor: 'text-gray-700',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    description:
      'O Portal do Cliente é uma interface separada para que empresas clientes acompanhem seus serviços e ordens de serviço sem precisar acessar o sistema interno.',
    features: [
      'Acesso via empresa + token (sem login de usuário)',
      'Listagem dos serviços da empresa em tempo real',
      'Acompanhamento de ordens de serviço',
      'Status com código de cores (6 status)',
      'Busca por serviço',
      'Atualização automática a cada 30 segundos',
    ],
    steps: [
      'Acesse o Portal em /portal.',
      'Informe o nome da empresa e o token de acesso fornecido pelo administrador.',
      'Clique em "Entrar no Portal".',
      'A lista de serviços é exibida com status atualizado.',
      'Use o campo de busca para localizar um serviço específico.',
      'O portal atualiza automaticamente a cada 30 segundos.',
    ],
    buttons: [
      { name: 'Entrar no Portal', desc: 'Autentica com empresa e token.' },
      { name: 'Buscar', desc: 'Filtra serviços pelo texto digitado.' },
      { name: 'Sair', desc: 'Encerra a sessão no portal do cliente.' },
    ],
  },
  {
    id: 'motorista-app',
    label: 'App do Motorista',
    icon: Smartphone,
    group: 'Especial',
    groupColor: 'text-gray-700',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    description:
      'O App do Motorista é uma interface mobile dedicada para os motoristas ativarem o rastreamento GPS e preencherem o checklist de inspeção do veículo.',
    features: [
      'Aba GPS: ativa/desativa rastreamento em tempo real',
      'Transmissão contínua de posição e velocidade',
      'Aba Checklist: formulário de inspeção veicular',
      'Carregamento automático dos dados do motorista logado',
      'Interface simplificada e otimizada para mobile',
    ],
    steps: [
      'Faça login marcando a opção "Motorista" na tela de login.',
      'Você será redirecionado para o App do Motorista em /motorista.',
      'Na aba GPS, toque em "Iniciar GPS" para começar o rastreamento.',
      'O sistema envia sua posição automaticamente em segundo plano.',
      'Para parar, toque em "Parar GPS".',
      'Na aba Checklist, preencha os 7 itens de inspeção e envie.',
    ],
    buttons: [
      { name: 'Iniciar GPS', desc: 'Ativa o rastreamento GPS e começa a enviar a posição.' },
      { name: 'Parar GPS', desc: 'Desativa o rastreamento GPS.' },
      { name: 'Enviar Checklist', desc: 'Salva a inspeção veicular no sistema.' },
    ],
  },
];

const GROUP_ORDER = ['Início', 'Geral', 'Operacional', 'Financeiro', 'Administração', 'Especial'];

const Tutorial: React.FC = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('welcome');
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const toggleComplete = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const active = MODULES.find(m => m.id === activeId) || MODULES[0];
  const progress = Math.round((completed.length / MODULES.length) * 100);
  const allDone = completed.length === MODULES.length;

  const grouped = GROUP_ORDER.map(g => ({
    group: g,
    items: MODULES.filter(m => m.group === g),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-800">Tutorial</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{completed.length} de {MODULES.length} concluídos</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {grouped.map(({ group, items }) => (
            <div key={group} className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">{group}</p>
              {items.map(m => {
                const Icon = m.icon;
                const isActive = m.id === activeId;
                const isDone = completed.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveId(m.id)}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors mb-0.5 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <Icon className="h-4 w-4 shrink-0 opacity-60" />
                    )}
                    <span className="truncate">{m.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Ir ao Dashboard
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {allDone ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-green-100 rounded-full p-6 mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Parabéns! 🎉</h1>
            <p className="text-lg text-gray-500 mb-6 max-w-md">
              Você concluiu todos os módulos do tutorial. Agora você está pronto para usar o WA Transportes com confiança!
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/dashboard')} className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Ir para o Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => { setCompleted([]); setActiveId('welcome'); }}
              >
                Reiniciar Tutorial
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  {React.createElement(active.icon, { className: 'h-7 w-7 text-gray-700' })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{active.label}</h1>
                    <Badge className={`text-xs border ${active.badgeClass}`}>{active.group}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Módulo {MODULES.findIndex(m => m.id === active.id) + 1} de {MODULES.length}
                  </p>
                </div>
              </div>
              <Button
                variant={completed.includes(active.id) ? 'default' : 'outline'}
                size="sm"
                className="gap-2 shrink-0"
                onClick={() => toggleComplete(active.id)}
              >
                {completed.includes(active.id) ? (
                  <><CheckCircle2 className="h-4 w-4" /> Concluído</>
                ) : (
                  <><Circle className="h-4 w-4" /> Marcar como concluído</>
                )}
              </Button>
            </div>

            {/* GIF Preview */}
            <Card className="mb-5 border-blue-100 bg-blue-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-blue-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Demonstração Visual
                </CardTitle>
                <CardDescription>
                  Veja o módulo em ação — gerado automaticamente pelo sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border border-blue-200 bg-white shadow-sm">
                  <img
                    src={`/tutorial-gifs/${active.id}.gif`}
                    alt={`Demonstração: ${active.label}`}
                    className="w-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div
                    className="hidden items-center justify-center flex-col gap-3 py-12 text-center"
                    style={{ display: 'none' }}
                  >
                    <Download className="h-8 w-8 text-blue-300" />
                    <div>
                      <p className="font-medium text-gray-600 text-sm">GIF ainda não gerado</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Execute <code className="bg-gray-100 px-1 rounded">npm run tutorial:gifs</code> para gerar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-5 border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">Como funciona</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{active.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-5 border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {active.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <ChevronRight className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="mb-5 border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">Passo a passo</CardTitle>
                <CardDescription>Como usar este módulo</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {active.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-600 text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card className="mb-8 border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">Botões e Ações</CardTitle>
                <CardDescription>O que cada botão faz neste módulo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {active.buttons.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
                      <div>
                        <span className="font-medium text-gray-800 text-sm">{b.name}</span>
                        <p className="text-gray-500 text-sm mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              {(() => {
                const idx = MODULES.findIndex(m => m.id === active.id);
                const prev = MODULES[idx - 1];
                const next = MODULES[idx + 1];
                return (
                  <>
                    {prev ? (
                      <Button variant="outline" onClick={() => setActiveId(prev.id)} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {prev.label}
                      </Button>
                    ) : <div />}
                    {next ? (
                      <Button onClick={() => setActiveId(next.id)} className="gap-2">
                        {next.label}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={() => toggleComplete(active.id)} className="gap-2 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Concluir Tutorial
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tutorial;
