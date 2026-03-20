
import React from 'react';
import { Package, Truck, Route, Shield } from 'lucide-react';

const services = [
  {
    icon: Package,
    title: 'Cargas Fracionadas',
    description: 'Otimização de rotas para cargas menores com economia e flexibilidade.',
  },
  {
    icon: Truck,
    title: 'Grandes Volumes',
    description: 'Transporte especializado para grandes volumes com segurança máxima.',
  },
  {
    icon: Route,
    title: 'Rotas Otimizadas',
    description: 'Planejamento inteligente de rotas, reduzindo custo e prazo de entrega.',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Monitoramento 24/7, seguro completo e equipe especializada.',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Serviços sob medida para a sua operação
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed" style={{ textWrap: 'pretty' } as React.CSSProperties}>
            Da carga fracionada ao grande volume — soluções logísticas com rastreamento, seguro e pontualidade.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={i}
                className="group bg-card rounded-xl p-6 shadow-[0_1px_3px_hsl(0_0%_0%/0.06)] hover:shadow-[0_8px_24px_hsl(0_0%_0%/0.1)] transition-[box-shadow] duration-300 border border-border"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-200">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5512974069672"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-lg text-sm shadow-[0_2px_8px_hsl(220_85%_23%/0.25)] hover:shadow-[0_4px_16px_hsl(220_85%_23%/0.35)] transition-[box-shadow,transform] duration-200 active:scale-[0.97] no-underline"
          >
            Solicitar Orçamento Personalizado
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
