import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

function Contact() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-odoo-gray py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Get in touch with our team of experts for all your smart home technology needs.
          </p>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="">Select a service</option>
                    <option value="cctv">Smart Home CCTV</option>
                    <option value="analysis">Data Analysis</option>
                    <option value="network">Network Design</option>
                    <option value="transformation">Digital Transformation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-500 text-white py-3 px-6 rounded-md hover:bg-gold-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <ContactInfo
                  icon={<Phone className="w-6 h-6 text-gold-500" />}
                  title="Phone"
                  info="+1 (555) 123-4567"
                  subInfo="Monday to Friday, 9am to 6pm"
                />
                <ContactInfo
                  icon={<Mail className="w-6 h-6 text-gold-500" />}
                  title="Email"
                  info="contact@smartsolutions.com"
                  subInfo="We'll respond within 24 hours"
                />
                <ContactInfo
                  icon={<MapPin className="w-6 h-6 text-gold-500" />}
                  title="Office"
                  info="123 Smart Street, Tech City, TC 12345"
                  subInfo="Visit us for a consultation"
                />
                <ContactInfo
                  icon={<Clock className="w-6 h-6 text-gold-500" />}
                  title="Business Hours"
                  info="Monday - Friday: 9:00 AM - 6:00 PM"
                  subInfo="Weekend: Closed"
                />
              </div>

              {/* Map */}
              <div className="mt-8 bg-gray-200 h-[300px] rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Map Integration Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ 
  icon, 
  title, 
  info, 
  subInfo 
}: { 
  icon: React.ReactNode; 
  title: string; 
  info: string; 
  subInfo: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="p-3 bg-gold-50 rounded-full">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600">{info}</p>
        <p className="text-sm text-gray-500">{subInfo}</p>
      </div>
    </div>
  );
}

export default Contact;