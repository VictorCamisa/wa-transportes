
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { validateTextInput, sanitizeInput } from '@/utils/inputValidation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    if (!email || email.trim() === '') {
      return { isValid: false, error: 'E-mail é obrigatório' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'E-mail inválido' };
    }
    
    return { isValid: true };
  };

  const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
    if (!phone || phone.trim() === '') {
      return { isValid: false, error: 'Telefone é obrigatório' };
    }
    
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\d\s\(\)\-\+]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Telefone inválido' };
    }
    
    return { isValid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validate name
    const nameValidation = validateTextInput(formData.name, 100);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    // Validate company (optional)
    if (formData.company) {
      const companyValidation = validateTextInput(formData.company, 100);
      if (!companyValidation.isValid) {
        newErrors.company = companyValidation.error;
      }
    }

    // Validate message
    const messageValidation = validateTextInput(formData.message, 1000);
    if (!messageValidation.isValid) {
      newErrors.message = messageValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      
      alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl animate-slide-in-left">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-lg">
          <Send className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-bold">Solicitar Orçamento</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Seu nome"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-300 mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2">
              Empresa
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Nome da empresa"
            />
            {errors.company && (
              <p className="text-sm text-red-300 mt-1">{errors.company}</p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="seu@email.com"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-300 mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="(11) 99999-9999"
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-300 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Detalhes do Transporte *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none transition-all"
            placeholder="Descreva suas necessidades de transporte (origem, destino, tipo de carga, etc.)"
            required
          ></textarea>
          {errors.message && (
            <p className="text-sm text-red-300 mt-1">{errors.message}</p>
          )}
        </div>
        
        <a
          href="https://wa.me/5512974069672"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white hover:bg-blue-50 transition-all duration-300 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 text-decoration-none"
          style={{ color: '#0f2c69' }}
        >
          <Send className="h-5 w-5" />
          <span>Enviar Solicitação pelo WhatsApp</span>
        </a>
      </form>
    </div>
  );
};

export default ContactForm;
