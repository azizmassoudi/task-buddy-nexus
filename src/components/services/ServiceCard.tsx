
import React from 'react';
import { Service } from '@/data/mockServices';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${service.id}`);
  };

  return (
    <div 
      className="service-card cursor-pointer" 
      onClick={handleClick}
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded-md overflow-hidden">
          {service.imageUrl ? (
            <img 
              src={`${service.imageUrl}?w=600&auto=format`} 
              alt={service.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <Badge 
          className="absolute top-2 right-2" 
          variant={service.status === 'Open' ? 'default' : 'secondary'}
        >
          {service.status}
        </Badge>
      </div>
      
      <div className="mb-2">
        <Badge className="bg-brand-100 text-brand-700 hover:bg-brand-200">
          {service.category}
        </Badge>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.title}</h3>
      
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {service.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="text-brand-500 font-semibold">${service.price}</div>
        <div className="text-sm text-gray-500">
          {service.location}
        </div>
      </div>
      
      {service.skills && service.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {service.skills.slice(0, 2).map((skill, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
            >
              {skill}
            </span>
          ))}
          {service.skills.length > 2 && (
            <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
              +{service.skills.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
