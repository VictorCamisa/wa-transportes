
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import BackgroundRemovedLogo from '@/components/BackgroundRemovedLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [motorista, setMotorista] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();

  

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      console.log('Usuário já logado, redirecionando para dashboard');
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        console.log('Detalhes completos do erro:', {
          message: error.message,
          status: error.status,
          name: error.name,
          cause: error.cause
        });
        
        // Melhor tratamento de erros específicos
        let errorMessage = 'Email ou senha incorretos';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente';
        }
        
        setError(errorMessage);
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login realizado com sucesso');
        if (motorista) {
          // Redireciona para o checklist no dashboard
          toast({
            title: "Login realizado com sucesso!",
            description: "Redirecionando para o checklist...",
          });
          setTimeout(() => {
            navigate('/dashboard?tab=checklist');
          }, 1000);
        } else {
          // Redireciona para o dashboard
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao dashboard!",
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      const errorMessage = 'Ocorreu um erro inesperado. Tente novamente';
      setError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading se ainda estiver verificando autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left side - Logo and branding - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 bg-muted/30 flex-col justify-center items-center p-8 xl:p-12">
          <div className="max-w-md text-center">
            <div className="mb-8 xl:mb-12">
              <BackgroundRemovedLogo
                originalSrc="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png"
                alt="WA Transportes"
                className="h-32 xl:h-40 w-auto mx-auto"
              />
            </div>
            <h1 className="text-3xl xl:text-4xl font-light text-foreground mb-4 xl:mb-6">
              Área de Funcionários
            </h1>
            <p className="text-muted-foreground font-light leading-relaxed text-base xl:text-lg">
              Sistema integrado de gestão para equipes da WA Transportes
            </p>
          </div>
        </div>

        {/* Right side - Login form - Full width on mobile */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8 sm:mb-12">
              <div className="mb-6 sm:mb-8">
                <BackgroundRemovedLogo
                  originalSrc="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png"
                  alt="WA Transportes"
                  className="h-20 sm:h-28 w-auto mx-auto"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-foreground">Área de Funcionários</h1>
            </div>

            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-2 sm:mb-3">Entrar</h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base">
                Digite suas credenciais para acessar o sistema
              </p>
            </div>

            {error && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-destructive">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@watransportes.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 sm:h-14 border-input rounded-xl text-sm sm:text-base bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 sm:h-14 border-input rounded-xl text-sm sm:text-base bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="motorista" 
                  checked={motorista}
                  onCheckedChange={(checked) => setMotorista(checked === true)}
                />
                <Label htmlFor="motorista" className="text-sm text-foreground cursor-pointer">
                  Sou motorista (acesso direto ao checklist)
                </Label>
              </div>

              <Button
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-8 sm:mt-12 text-center">
              <button 
                onClick={() => navigate('/')}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground font-light transition-colors duration-200"
              >
                ← Voltar ao site
              </button>
            </div>

            {/* Debug info for mobile testing */}
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600 text-center">
              Debug: {window.location.hostname} | {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
