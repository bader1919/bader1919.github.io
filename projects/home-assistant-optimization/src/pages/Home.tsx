import React from 'react';
import { Shield, Network, LineChart, Smartphone, ChevronRight, Building2, Award, Users, Mail, Phone, MapPin, CheckCircle, Clock, Wrench, MessageSquare } from 'lucide-react';

// Import all the components from your existing App.tsx
import { ServiceCard, StatCard, ContactCard, ProcessCard, FaqItem } from '../components/Cards';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Smart Home Solutions<br />
            <span className="text-gold-400">Secure, Analyze, Transform</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Expert consulting for smart home CCTV systems, data analysis, and network design. Transform your space with cutting-edge technology.
          </p>
          <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded text-lg font-semibold flex items-center group transition-all">
            Get Free Consultation
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-odoo-gray">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">Comprehensive smart home solutions tailored to your needs</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon={<Shield className="w-10 h-10 text-gold-500" />}
              title="Smart Home CCTV"
              description="Advanced security solutions with intelligent monitoring and real-time alerts."
            />
            <ServiceCard 
              icon={<LineChart className="w-10 h-10 text-gold-500" />}
              title="Data Analysis"
              description="Transform security footage into actionable insights for better decision-making."
            />
            <ServiceCard 
              icon={<Network className="w-10 h-10 text-gold-500" />}
              title="Network Design"
              description="Robust network infrastructure designed for optimal smart home performance."
            />
            <ServiceCard 
              icon={<Smartphone className="w-10 h-10 text-gold-500" />}
              title="Digital Transformation"
              description="Modernize your space with integrated smart technologies and automation."
            />
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Our Process</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">How we transform your space into a smart sanctuary</p>
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessCard 
              icon={<MessageSquare className="w-8 h-8 text-gold-500" />}
              step="1"
              title="Consultation"
              description="We discuss your needs and assess your space requirements."
            />
            <ProcessCard 
              icon={<Wrench className="w-8 h-8 text-gold-500" />}
              step="2"
              title="Planning"
              description="Our experts design a customized smart home solution."
            />
            <ProcessCard 
              icon={<Clock className="w-8 h-8 text-gold-500" />}
              step="3"
              title="Implementation"
              description="We install and configure your smart home systems."
            />
            <ProcessCard 
              icon={<CheckCircle className="w-8 h-8 text-gold-500" />}
              step="4"
              title="Support"
              description="Ongoing maintenance and support for your system."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gold-500 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard 
              icon={<Building2 className="w-12 h-12 mb-4" />}
              number="500+"
              label="Projects Completed"
            />
            <StatCard 
              icon={<Award className="w-12 h-12 mb-4" />}
              number="15+"
              label="Years Experience"
            />
            <StatCard 
              icon={<Users className="w-12 h-12 mb-4" />}
              number="1000+"
              label="Happy Clients"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-odoo-gray">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FaqItem 
              question="What types of CCTV systems do you offer?"
              answer="We provide a range of CCTV solutions including IP cameras, wireless systems, and AI-powered surveillance, all customized to your specific needs."
            />
            <FaqItem 
              question="How long does installation take?"
              answer="Installation time varies based on project scope, typically ranging from 1-3 days for residential systems to 1-2 weeks for complex commercial setups."
            />
            <FaqItem 
              question="Do you offer maintenance services?"
              answer="Yes, we provide comprehensive maintenance packages including regular system checks, updates, and 24/7 emergency support."
            />
            <FaqItem 
              question="Can I access my CCTV system remotely?"
              answer="Absolutely! Our systems come with secure remote access capabilities through mobile apps and web interfaces."
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ContactCard 
              icon={<Phone className="w-6 h-6 text-gold-500" />}
              title="Call Us"
              info="+1 (555) 123-4567"
            />
            <ContactCard 
              icon={<Mail className="w-6 h-6 text-gold-500" />}
              title="Email Us"
              info="contact@smartsolutions.com"
            />
            <ContactCard 
              icon={<MapPin className="w-6 h-6 text-gold-500" />}
              title="Visit Us"
              info="123 Smart Street, Tech City, TC 12345"
            />
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-20 bg-odoo-gray">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Trusted By Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            <div className="h-12 w-32 bg-gray-300 rounded"></div>
            <div className="h-12 w-32 bg-gray-300 rounded"></div>
            <div className="h-12 w-32 bg-gray-300 rounded"></div>
            <div className="h-12 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;