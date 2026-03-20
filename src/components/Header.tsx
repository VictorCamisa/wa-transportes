
import React, { useState } from 'react';
import { Menu, X, Phone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackgroundRemovedLogo from './BackgroundRemovedLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleEmployeeAreaClick = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Aumentada */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm hover-lift">
              <BackgroundRemovedLogo 
                originalSrc="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png"
                alt="WA Transportes Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold text-white">WA Transportes</h2>
              <p className="text-sm text-blue-300">Logística Inteligente</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'Início', id: 'home' },
              { label: 'Serviços', id: 'services' },
              { label: 'Sobre Nós', id: 'about' },
              { label: 'Contato', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white/90 hover:text-blue-300 transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Phone className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">(12) 97406-9672</span>
            </div>
            <button 
              onClick={handleEmployeeAreaClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 hover-lift shadow-lg"
            >
              <Users className="h-4 w-4" />
              <span>Área de Funcionários</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 animate-fade-in-down">
            <nav className="flex flex-col space-y-4">
              {[
                { label: 'Início', id: 'home' },
                { label: 'Serviços', id: 'services' },
                { label: 'Sobre Nós', id: 'about' },
                { label: 'Contato', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white/90 hover:text-blue-300 transition-colors font-medium text-left py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-white/90 mb-4 px-4">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">(12) 97406-9672</span>
                </div>
                <button 
                  onClick={handleEmployeeAreaClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Users className="h-4 w-4" />
                  <span>Área de Funcionários</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
