import React from 'react';
import { Award, Users, Shield, Target, CheckCircle, PenTool as Tool, Briefcase } from 'lucide-react';

function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">About Us</h1>
          <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
            Leading the way in smart home technology solutions with over 15 years of industry expertise.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <Target className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
              <p className="text-gray-300">
                To empower homes and businesses with cutting-edge smart technology solutions that enhance security, efficiency, and comfort.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <Shield className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-white">Our Vision</h2>
              <p className="text-gray-300">
                To be the leading provider of integrated smart home solutions, setting industry standards for innovation and service excellence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember
              image="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
              name="John Smith"
              position="CEO & Founder"
              description="With 20+ years in smart home technology, John leads our vision for innovation."
            />
            <TeamMember
              image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
              name="Sarah Johnson"
              position="Technical Director"
              description="Sarah brings expertise in network architecture and system integration."
            />
            <TeamMember
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
              name="Michael Chen"
              position="Head of Innovation"
              description="Michael drives our research and development initiatives."
            />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Our Experience</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <ExperienceCard
              icon={<Briefcase className="w-10 h-10 text-gold-500" />}
              number="500+"
              label="Projects Completed"
            />
            <ExperienceCard
              icon={<Users className="w-10 h-10 text-gold-500" />}
              number="1000+"
              label="Happy Clients"
            />
            <ExperienceCard
              icon={<Tool className="w-10 h-10 text-gold-500" />}
              number="50+"
              label="Expert Engineers"
            />
            <ExperienceCard
              icon={<Award className="w-10 h-10 text-gold-500" />}
              number="15+"
              label="Years Experience"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Award className="w-10 h-10 text-gold-500" />}
              title="Expertise"
              description="15+ years of experience in smart home technology solutions."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-gold-500" />}
              title="Customer Focus"
              description="Dedicated support team available 24/7 for our clients."
            />
            <FeatureCard
              icon={<CheckCircle className="w-10 h-10 text-gold-500" />}
              title="Quality Assured"
              description="Industry-leading products and certified installations."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMember({ 
  image, 
  name, 
  position, 
  description 
}: { 
  image: string; 
  name: string; 
  position: string; 
  description: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
        <p className="text-gold-500 mb-4">{position}</p>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function ExperienceCard({
  icon,
  number,
  label
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="text-center p-6 bg-gray-700 rounded-lg">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-600 mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">{number}</h3>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

export default About;