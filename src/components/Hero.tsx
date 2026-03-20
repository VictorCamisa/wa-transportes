
import React from 'react';
import { ArrowRight, Shield, Clock, Award, CheckCircle, Star, TrendingUp } from 'lucide-react';
import BackgroundRemovedLogo from './BackgroundRemovedLogo';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Background with truck image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/lovable-uploads/fe376b47-e380-46c4-91d1-b96b1c98cd64.png")',
            backgroundPosition: 'center 40%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-6">
              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Logística que
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent text-glow">
                    Move o Brasil
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                  Soluções personalizadas em transporte com tecnologia de ponta, 
                  <strong className="text-blue-300"> segurança total</strong> e 
                  <strong className="text-blue-300"> pontualidade garantida</strong>.
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/5512974069672" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover-lift transition-all-smooth flex items-center justify-center text-decoration-none"
              >
                Solicitar Orçamento Gratuito
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </a>
              <a 
                href="https://wa.me/5512974069672" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group glass hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover-lift transition-all-smooth border border-white/20 text-decoration-none"
              >
                Conhecer Nossos Serviços
              </a>
            </div>

            {/* Stats floating cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {[
                { icon: Shield, number: "100%", label: "Seguro", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
                { icon: Clock, number: "24/7", label: "Rastreamento", color: "text-blue-400", bgColor: "bg-blue-500/20" },
                { icon: Award, number: "10+", label: "Anos", color: "text-amber-400", bgColor: "bg-amber-500/20" },
                { icon: TrendingUp, number: "+50", label: "Cidades", color: "text-purple-400", bgColor: "bg-purple-500/20" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="glass p-6 rounded-2xl text-center hover-lift animate-fade-in-up border border-white/10 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-3 ${item.bgColor} ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-white">{item.number}</div>
                  <div className="text-gray-300 text-sm font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Floating elements com logo da WA */}
          <div className="relative animate-slide-in-right">
            {/* Main floating card */}
            <div className="glass-dark p-8 rounded-3xl hover-lift animate-float border border-white/10 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-full animate-pulse-custom border border-blue-400/30"></div>
                  <div className="relative z-10 w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <BackgroundRemovedLogo 
                      originalSrc="/lovable-uploads/e037a4b1-96a3-48f5-9c4f-7405a3c5c5c8.png"
                      alt="WA Transportes Logo"
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tecnologia Avançada</h3>
                  <p className="text-gray-300">Rastreamento em tempo real e gestão inteligente de frotas</p>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl animate-float hover-lift border border-white/10 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">99%</div>
                <div className="text-xs text-gray-300">Pontualidade</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl animate-float hover-lift border border-white/10 backdrop-blur-sm" style={{ animationDelay: '2s' }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-xs text-gray-300">Acidentes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
