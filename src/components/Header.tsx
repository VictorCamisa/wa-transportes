
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Início', id: 'home' },
    { label: 'Serviços', id: 'services' },
    { label: 'Sobre', id: 'about' },
    { label: 'Contato', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? 'bg-white shadow-[0_1px_3px_hsl(0_0%_0%/0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-3">
            <img
              src="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png"
              alt="WA Transportes"
              className="h-10 w-10 object-contain"
              loading="eager"
            />
            <span className={`text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}>
              WA Transportes
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+5512974069672"
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                scrolled ? 'text-muted-foreground' : 'text-white/80'
              }`}
            >
              <Phone className="h-4 w-4" />
              (12) 97406-9672
            </a>
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.97] ${
                scrolled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              Área Interna
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-foreground hover:bg-secondary' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden pb-4 border-t ${scrolled ? 'border-border bg-white' : 'border-white/10 bg-[hsl(220,85%,15%)]/95 backdrop-blur-sm'}`}>
            <nav className="flex flex-col pt-3 gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    scrolled
                      ? 'text-foreground hover:bg-secondary'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className={`mt-2 pt-3 border-t ${scrolled ? 'border-border' : 'border-white/10'}`}>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground active:scale-[0.97]"
                >
                  Área Interna
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
