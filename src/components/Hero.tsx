
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/fe376b47-e380-46c4-91d1-b96b1c98cd64.png"
          alt=""
          className="w-full h-full object-cover object-[center_40%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[hsl(220,85%,12%)]/75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl space-y-8">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Transporte de cargas com segurança e pontualidade.
          </h1>

          <p
            className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-lg"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            Mais de 10 anos movendo o Brasil. Rastreamento em tempo real, frota própria e atendimento personalizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="https://wa.me/5512974069672"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-foreground font-semibold px-7 py-3.5 rounded-lg text-base shadow-[0_2px_8px_hsl(0_0%_0%/0.15)] hover:shadow-[0_4px_16px_hsl(0_0%_0%/0.2)] transition-[box-shadow,transform] duration-200 active:scale-[0.97] no-underline"
            >
              Solicitar Orçamento
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center font-semibold px-7 py-3.5 rounded-lg text-base text-white border border-white/25 hover:bg-white/10 transition-[background-color] duration-200 active:scale-[0.97] no-underline"
            >
              Nossos Serviços
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 text-sm text-white/60">
            <span><strong className="text-white font-semibold tabular-nums">+50</strong> cidades atendidas</span>
            <span><strong className="text-white font-semibold">24/7</strong> rastreamento</span>
            <span><strong className="text-white font-semibold">100%</strong> carga segurada</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
