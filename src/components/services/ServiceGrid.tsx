
import React from 'react';
import { Service } from '@/data/mockServices';
import { ServiceCard } from './ServiceCard';

interface ServiceGridProps {
  services: Service[];
  title?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ services, title }) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No services found</h3>
      </div>
    );
  }

  return (
    <div className="my-8">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
