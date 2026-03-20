
import React from 'react';
import { Truck, Package, Route, Shield, Clock, Zap, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Package,
      title: "Cargas Fracionadas",
      description: "Otimização inteligente de rotas para cargas menores com economia garantida e flexibilidade total.",
      features: ["Economia de até 40%", "Flexibilidade total", "Rastreamento completo"],
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      icon: Truck,
      title: "Grandes Volumes",
      description: "Soluções especializadas para transporte de grandes volumes com tecnologia de segurança avançada.",
      features: ["Capacidade ilimitada", "Segurança máxima", "Pontualidade garantida"],
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500"
    },
    {
      icon: Route,
      title: "Rotas Inteligentes",
      description: "IA para otimização de rotas em tempo real, reduzindo custos e tempo de entrega significativamente.",
      features: ["IA avançada", "Redução de 30% no tempo", "Menor custo"],
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Proteção máxima da carga com tecnologia de ponta e equipe especializada 24/7.",
      features: ["Proteção 360°", "Monitoramento 24/7", "Equipe especializada"],
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500"
    },
    {
      icon: Clock,
      title: "Rastreamento Live",
      description: "Acompanhe sua carga em tempo real com nossa plataforma avançada de monitoramento.",
      features: ["Tempo real", "App exclusivo", "Alertas automáticos"],
      color: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500"
    },
    {
      icon: Zap,
      title: "Entrega Express",
      description: "Serviços expressos com prioridade máxima para cargas urgentes e time-sensitive.",
      features: ["Prioridade máxima", "Entrega em 24h", "Garantia expressa"],
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500"
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full animate-blob" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/20 rounded-full animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full mb-8 hover-lift">
            <Truck className="h-5 w-5 mr-3 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Nossos Serviços Premium</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Soluções Logísticas
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Revolucionárias
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tecnologia de ponta, segurança absoluta e eficiência máxima para transformar 
            sua cadeia logística em vantagem competitiva
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-3xl shadow-float hover:shadow-hover transition-all-smooth border border-gray-100 hover:border-blue-200 hover-lift animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <div className={`w-2 h-2 ${service.iconColor.replace('text-', 'bg-')} rounded-full mr-3 group-hover:scale-125 transition-transform`} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a 
                  href="https://wa.me/5512974069672" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group/btn flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-decoration-none"
                >
                  Saiba mais
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a 
              href="https://wa.me/5512974069672" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-hover hover-lift transition-all-smooth text-decoration-none"
            >
              Solicitar Orçamento Personalizado
            </a>
            <a 
              href="https://wa.me/5512974069672" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-4 rounded-2xl font-semibold text-lg hover-lift transition-all-smooth text-decoration-none"
            >
              Falar com Especialista
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
