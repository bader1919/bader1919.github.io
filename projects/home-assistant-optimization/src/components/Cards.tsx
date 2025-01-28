import React from 'react';

export function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all group">
      <div className="mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div>
      <div className="flex justify-center">{icon}</div>
      <div className="text-4xl font-bold mt-2">{number}</div>
      <div className="text-gold-200">{label}</div>
    </div>
  );
}

export function ContactCard({ icon, title, info }: { icon: React.ReactNode; title: string; info: string }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{info}</p>
    </div>
  );
}

export function ProcessCard({ icon, step, title, description }: { icon: React.ReactNode; step: string; title: string; description: string }) {
  return (
    <div className="relative p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-50 mb-4">
        {icon}
      </div>
      <div className="absolute top-0 right-0 -mr-4 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}