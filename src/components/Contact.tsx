
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const contactItems = [
  {
    icon: Phone,
    label: 'Telefone / WhatsApp',
    value: '(12) 97406-9672',
    href: 'https://wa.me/5512974069672',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'contato@watransportes.com.br',
    href: 'mailto:contato@watransportes.com.br',
  },
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'R. Barão de Taubaté, 393 – Vila Costa, Taubaté - SP',
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg a Sex: 7h às 19h · Emergências 24/7',
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Fale com a nossa equipe
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed" style={{ textWrap: 'pretty' } as React.CSSProperties}>
            Entre em contato para um orçamento personalizado. Resposta rápida pelo WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          {contactItems.map((item, i) => {
            const Icon = item.icon;
            const Wrapper = item.href ? 'a' : 'div';
            const wrapperProps = item.href
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Wrapper
                key={i}
                {...(wrapperProps as any)}
                className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-colors duration-200 no-underline text-inherit"
              >
                <Icon className="h-5 w-5 mx-auto mb-3 text-primary-foreground/80" />
                <div className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-1 font-medium">
                  {item.label}
                </div>
                <div className="text-sm font-medium leading-snug">{item.value}</div>
              </Wrapper>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/5512974069672"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-3.5 rounded-lg text-base shadow-[0_2px_8px_hsl(0_0%_0%/0.15)] hover:shadow-[0_4px_16px_hsl(0_0%_0%/0.2)] transition-[box-shadow,transform] duration-200 active:scale-[0.97] no-underline"
          >
            Solicitar Orçamento pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
