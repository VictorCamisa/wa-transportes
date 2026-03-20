
import React from 'react';
import { Truck } from 'lucide-react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import BusinessHours from './BusinessHours';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-hero text-white relative">
      <div className="absolute inset-0" style={{ backgroundColor: '#0f2c69' }}></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
            <Truck className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Entre em Contato</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Solicite Seu
            <span className="text-blue-200 block">Orçamento</span>
          </h2>
          
          <p className="text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
            Receba uma proposta personalizada para suas necessidades logísticas. 
            Nossa equipe está pronta para oferecer a melhor solução.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-right">
            <ContactInfo />
            <BusinessHours />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
