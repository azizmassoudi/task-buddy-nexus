
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ServiceCategory, ServiceStatus, Service } from '@/data/mockServices';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ServiceFormProps {
  service?: Service;
  isEdit?: boolean;
}

const ServiceForm = ({ service, isEdit = false }: ServiceFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [category, setCategory] = useState<ServiceCategory>(
    service?.category as ServiceCategory || 'Home Services'
  );
  const [location, setLocation] = useState(service?.location || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');
  const [estimatedHours, setEstimatedHours] = useState(
    service?.estimatedHours?.toString() || ''
  );
  const [status, setStatus] = useState<ServiceStatus>(
    service?.status || 'Open'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories: ServiceCategory[] = [
    'Home Services',
    'Professional Services',
    'Events',
    'Health & Wellness',
    'Tech Support',
    'Education',
    'Automotive'
  ];
  
  const statuses: ServiceStatus[] = [
    'Open',
    'In Progress',
    'Completed',
    'Cancelled'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate the form
    if (!title.trim() || !description.trim() || !category || !location.trim() || !price) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      setIsSubmitting(false);
      return;
    }
    
    // Process the form - in a real app, this would call an API
    setTimeout(() => {
      toast({
        title: `Service ${isEdit ? 'updated' : 'created'} successfully!`,
        description: `"${title}" has been ${isEdit ? 'updated' : 'created'}.`,
      });
      setIsSubmitting(false);
      
      // Redirect to the services page
      navigate('/services');
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Service' : 'Create New Service'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                placeholder="Service title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ServiceCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                placeholder="Detailed description of the service"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location *
                </label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="estimatedHours" className="text-sm font-medium">
                  Estimated Hours
                </label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                />
              </div>
              
              {isEdit && (
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as ServiceStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/services')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-brand-300 hover:bg-brand-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceForm;
