
import React from 'react';
import { Users, Trophy, Clock, Shield, Truck, Star } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, number: '500+', label: 'Clientes Satisfeitos', color: 'text-blue-600' },
    { icon: Truck, number: '15+', label: 'Anos de Experiência', color: 'text-green-600' },
    { icon: Trophy, number: '99.9%', label: 'Taxa de Sucesso', color: 'text-purple-600' },
    { icon: Clock, number: '24/7', label: 'Suporte Disponível', color: 'text-orange-600' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Monitoramento 24/7 e seguros completos para sua tranquilidade.'
    },
    {
      icon: Clock,
      title: 'Pontualidade',
      description: 'Entregas no prazo com rastreamento em tempo real.'
    },
    {
      icon: Star,
      title: 'Excelência',
      description: 'Mais de 15 anos de experiência e 500+ clientes satisfeitos.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full mb-8 hover-lift">
            <Users className="h-5 w-5 mr-3 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Sobre a WA Transportes</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Líderes em
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Logística Nacional
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Há mais de 15 anos conectando o Brasil com soluções logísticas inovadoras, 
            tecnologia de ponta e um compromisso inabalável com a excelência
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-3xl shadow-float hover:shadow-hover transition-all-smooth border border-gray-100 hover:border-blue-200 hover-lift animate-fade-in-up text-center"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`w-16 h-16 ${stat.color.replace('text-', 'bg-').replace('600', '100')} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-in-left">
            <h3 className="text-4xl font-bold text-gray-800 mb-8">
              Por que escolher a 
              <span className="block text-blue-600">WA Transportes?</span>
            </h3>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Nossa experiência de mais de 15 anos no mercado logístico brasileiro nos permite 
              oferecer soluções personalizadas que realmente fazem a diferença no seu negócio.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-float hover:shadow-hover transition-all-smooth border border-gray-100 hover:border-blue-200 hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl rotate-3 opacity-20" />
              <img 
                src="/lovable-uploads/133da452-08e3-4150-b40b-e8a3a8afde51.png" 
                alt="Caminhão WA Transportes" 
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover hover-lift"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
