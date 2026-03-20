
import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png" 
                alt="WA Transportes" 
                className="h-16 w-auto filter brightness-0 invert"
              />
            </div>
            
            <p className="text-background/80 max-w-md leading-relaxed">
              Há mais de 10 anos oferecendo soluções logísticas personalizadas com 
              segurança, pontualidade e tecnologia avançada. Sua carga, nossa responsabilidade.
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 hover-lift">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-background/80">100% Seguro</span>
              </div>
              <div className="flex items-center space-x-2 hover-lift">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-background/80">Rastreamento 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Navegação</h3>
            <ul className="space-y-3">
              {[
                { href: '#home', label: 'Início' },
                { href: '#services', label: 'Serviços' },
                { href: '#about', label: 'Sobre Nós' },
                { href: '#contact', label: 'Contato' }
              ].map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href} 
                    className="text-background/80 hover:text-primary transition-all-smooth flex items-center group hover-lift"
                  >
                    <span className="w-2 h-2 bg-primary/60 rounded-full mr-3 group-hover:bg-primary transition-all-smooth group-hover:scale-125"></span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 hover-lift">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-background/90 font-medium">(12) 97406-9672</div>
                  <div className="text-sm text-background/60">WhatsApp disponível</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 hover-lift">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-background/90 font-medium">contato@watransportes.com.br</div>
                  <div className="text-sm text-background/60">Resposta rápida</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 hover-lift">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-background/90 text-sm">
                    R. Barão de Taubaté, 393 - Vila Costa<br />
                    Taubaté - SP, 12050-140
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-background/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/60 text-sm">
              © 2024 WA Transportes. Todos os direitos reservados.
            </div>
            
            <div className="text-background/60 text-sm text-center md:text-right">
              Desenvolvido com ❤️ para conectar você ao seu destino<br />
              <span className="text-xs">Soluções logísticas personalizadas e eficientes</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
