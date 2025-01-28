import React from 'react';
import { Shield, Network, LineChart, Smartphone, CheckCircle } from 'lucide-react';

function Services() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">Our Services</h1>
          <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
            Comprehensive smart home solutions tailored to your needs, from CCTV systems to complete digital transformation.
          </p>
        </div>
      </div>

      {/* Detailed Services */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <ServiceDetail
            icon={<Shield className="w-12 h-12 text-gold-500" />}
            title="Smart Home CCTV"
            description="Advanced security solutions with intelligent monitoring capabilities."
            features={[
              "HD & 4K camera options",
              "Night vision capabilities",
              "Motion detection",
              "Mobile app integration",
              "Cloud storage options",
              "AI-powered analytics"
            ]}
            image="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80"
          />

          <ServiceDetail
            icon={<LineChart className="w-12 h-12 text-gold-500" />}
            title="Data Analysis"
            description="Transform your security footage into actionable insights."
            features={[
              "Real-time analytics",
              "Behavioral analysis",
              "Traffic pattern detection",
              "Custom reporting",
              "Trend identification",
              "Performance metrics"
            ]}
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            reverse
          />

          <ServiceDetail
            icon={<Network className="w-12 h-12 text-gold-500" />}
            title="Network Design"
            description="Robust network infrastructure for optimal smart home performance."
            features={[
              "Network assessment",
              "Custom topology design",
              "Bandwidth optimization",
              "Security implementation",
              "Redundancy planning",
              "24/7 monitoring"
            ]}
            image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
          />

          <ServiceDetail
            icon={<Smartphone className="w-12 h-12 text-gold-500" />}
            title="Digital Transformation"
            description="Modernize your space with integrated smart technologies."
            features={[
              "Smart device integration",
              "Automation setup",
              "Voice control",
              "Energy management",
              "Remote access",
              "Custom solutions"
            ]}
            image="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
            reverse
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="299"
              features={[
                "Basic CCTV Setup",
                "Standard Analytics",
                "Email Support",
                "1 Year Warranty"
              ]}
            />
            <PricingCard
              title="Professional"
              price="599"
              featured={true}
              features={[
                "Advanced CCTV System",
                "Real-time Analytics",
                "24/7 Phone Support",
                "2 Year Warranty",
                "Mobile App Access"
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="999"
              features={[
                "Custom CCTV Solution",
                "AI-Powered Analytics",
                "Dedicated Support Team",
                "5 Year Warranty",
                "Custom Integration",
                "Priority Service"
              ]}
            />
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Our Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CertificationCard
              title="ISO 27001"
              description="Information Security Management"
            />
            <CertificationCard
              title="CCTV Installation"
              description="Professional Certification"
            />
            <CertificationCard
              title="Network Security"
              description="Advanced Certification"
            />
            <CertificationCard
              title="Smart Home Integration"
              description="Expert Level Certification"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ 
  icon, 
  title, 
  description, 
  features, 
  image, 
  reverse = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[]; 
  image: string; 
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center mb-20`}>
      <div className="w-full md:w-1/2">
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="text-3xl font-bold ml-4 text-white">{title}</h2>
        </div>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-gold-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <img 
          src={image} 
          alt={title} 
          className="rounded-lg shadow-xl w-full h-[400px] object-cover"
        />
      </div>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  features, 
  featured = false 
}: { 
  title: string; 
  price: string; 
  features: string[]; 
  featured?: boolean;
}) {
  return (
    <div className={`rounded-lg p-8 ${
      featured 
        ? 'bg-gold-500 transform scale-105' 
        : 'bg-gray-800'
    }`}>
      <h3 className={`text-2xl font-bold mb-4 ${
        featured ? 'text-white' : 'text-gray-100'
      }`}>{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-400">/month</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <CheckCircle className={`w-5 h-5 ${
              featured ? 'text-white' : 'text-gold-500'
            }`} />
            <span className={
              featured ? 'text-white' : 'text-gray-300'
            }>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 px-6 rounded-md transition-colors ${
        featured 
          ? 'bg-white text-gold-500 hover:bg-gray-100' 
          : 'bg-gold-500 text-white hover:bg-gold-600'
      }`}>
        Get Started
      </button>
    </div>
  );
}

function CertificationCard({ 
  title, 
  description 
}: { 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg text-center">
      <Shield className="w-12 h-12 text-gold-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default Services;