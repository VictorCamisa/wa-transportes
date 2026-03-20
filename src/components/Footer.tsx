
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/70 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span>© {new Date().getFullYear()} WA Transportes. Todos os direitos reservados.</span>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-background transition-colors no-underline text-inherit">Início</a>
            <a href="#services" className="hover:text-background transition-colors no-underline text-inherit">Serviços</a>
            <a href="#contact" className="hover:text-background transition-colors no-underline text-inherit">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
