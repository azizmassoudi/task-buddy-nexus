import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchServices, createService, deleteService } from '../redux/slices/servicesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ServiceGrid from '@/components/services/ServiceGrid';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, loading, error } = useSelector((state: RootState) => state.services);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ishidden, setIshidden] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    image: null as File | null,
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleImageSelect = (file: File) => {
    setNewService({ ...newService, image: file });
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to create a service.',
      });
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      formData.append('price', newService.price.toString());
      formData.append('category', newService.category);
      if (newService.image) {
        formData.append('image', newService.image);
      }

      await dispatch(createService(formData)).unwrap();
      toast({
        title: 'Service created',
        description: 'Your service has been created successfully.',
      });
      setNewService({
        title: '',
        description: '',
        price: 0,
        category: '',
        image: null,
      });
      setIshidden(false);
    } catch (err: any) {
      console.error('Service creation error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create service. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to delete a service.',
      });
      navigate('/login');
      return;
    }

    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await dispatch(deleteService(id)).unwrap();
        toast({
          title: 'Service deleted',
          description: 'The service has been deleted successfully.',
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to delete service. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      }
    }
  };

  const handleCreateButtonClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to create a service.',
      });
      navigate('/login');
      return;
    }
    setIshidden(!ishidden);
  };

  return (
    <div className="space-y-6">
      <div className={!ishidden ? "flex justify-end" : ""}>
        {!ishidden && (
          <Button onClick={handleCreateButtonClick}>
            + Create Service
          </Button>
        )}
        <CardContent>
          {ishidden && (
            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Enter service title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Enter service description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  placeholder="Enter service price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  placeholder="Enter service category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Service Image</Label>
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create Service
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIshidden(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Services</CardTitle>
          <CardDescription>View and manage your existing services.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading services...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              <ServiceGrid services={services} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Services; 