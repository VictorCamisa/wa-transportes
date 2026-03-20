
import React from 'react';
import { CheckCircle } from 'lucide-react';

const points = [
  'Mais de 10 anos de experiência em logística',
  'Frota própria com rastreamento em tempo real',
  'Seguro completo para todas as cargas',
  'Atendimento personalizado e ágil',
  'Cobertura em mais de 50 cidades',
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-[0_8px_30px_hsl(0_0%_0%/0.1)]">
              <img
                src="/lovable-uploads/133da452-08e3-4150-b40b-e8a3a8afde51.png"
                alt="Caminhão WA Transportes"
                className="w-full h-80 lg:h-96 object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2
              className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Por que escolher a WA Transportes?
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed" style={{ textWrap: 'pretty' } as React.CSSProperties}>
              Conectamos o Brasil com soluções logísticas confiáveis. Nossa experiência e compromisso com a qualidade garantem que sua carga chegue no prazo e em segurança.
            </p>

            <ul className="space-y-3 pt-2">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-[0.95rem]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
