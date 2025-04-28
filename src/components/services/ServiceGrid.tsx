import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Service, ServiceStatus } from '@/data/mockServices';
import { ServiceCard } from './ServiceCard';

interface ServiceGridProps {
  services?: Service[];
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services = [] }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No services available</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard 
          key={`service-${service.id}`} 
          service={service} 
        />
      ))}
    </div>
  );
};

export default ServiceGrid;
