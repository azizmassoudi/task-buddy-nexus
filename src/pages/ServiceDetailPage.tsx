import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ServiceForm from '@/components/services/ServiceForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, DollarSign, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceById, clearCurrentService } from '@/redux/slices/servicesSlice';
import { RootState, AppDispatch } from '@/redux/store';

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = React.useState('');
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const dispatch = useDispatch<AppDispatch>();
  const { currentService, loading, error } = useSelector((state: RootState) => state.services);
  
  // Get auth data from localStorage
  const getAuthData = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: userData ? JSON.parse(userData) : null,
      currentRole: localStorage.getItem('role') || null,
      isAuthenticated: !!token
    };
  };

  const { user, currentRole, isAuthenticated } = getAuthData();

  const isCreateMode = location.pathname === '/admin/services/new';
  const isEditMode = location.pathname.includes('/admin/services/') && location.pathname.includes('/edit');
  const isAdminMode = isCreateMode || isEditMode;

  // Fetch service by ID on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, id]);

  const service = currentService;
  
  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    console.log('Original image URL:', url);
    
    // If the URL is already absolute, return it as is
    if (url.startsWith('http')) {
      console.log('Using absolute URL:', url);
      return url;
    }
    
    // If it's a relative URL, prepend the backend URL
    const fullUrl = url.startsWith('/uploads/') 
      ? `${backendUrl}${url}`
      : `${backendUrl}/uploads/${url}`;
    
    console.log('Constructed image URL:', fullUrl);
    return fullUrl;
  };

  // Add a local fallback image
  const fallbackImage = '/images/placeholder.svg';

  // Show loading state
  if (loading) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Loading service details...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Error loading service</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button 
              className="mt-4 bg-brand-300 hover:bg-brand-400"
              onClick={() => navigate('/services')}
            >
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If service doesn't exist and we're not in create mode, show 404
  if (!service && !isCreateMode) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Service Not Found</h1>
          <p className="mt-4 text-lg text-gray-500">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            className="mt-8 bg-brand-300 hover:bg-brand-400"
            onClick={() => navigate('/services')}
          >
            Browse All Services
          </Button>
        </div>
      </div>
    );
  }

  // Show the service form for create/edit modes
  if (isAdminMode) {
    return (
      <div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-sm text-gray-500"
              onClick={() => navigate('/services')}
            >
              Back to Services
            </Button>
          </div>
          <ServiceForm service={service} isEdit={isEditMode} />
        </div>
      </div>
    );
  }

  const formattedDate = new Date(service.postedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleBid = () => {
    toast({
      title: 'Bid Submitted',
      description: 'Your interest has been sent to the service admin.',
    });
  };

  const handleHire = () => {
    toast({
      title: 'Request Sent',
      description: 'Your request for this service has been submitted.',
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a message',
      });
      return;
    }
    
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent.',
    });
    setMessage('');
  };

  const handleEditService = () => {
    navigate(`/admin/services/${id}/edit`);
  };

  const handleDeleteService = () => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    toast({
      title: 'Service Deleted',
      description: 'The service has been successfully deleted.',
    });
    navigate('/services');
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Button 
                  variant="ghost" 
                  className="text-sm text-gray-500"
                  onClick={() => navigate('/services')}
                >
                  Back to Services
                </Button>
                <span className="text-gray-300">/</span>
                <Badge>{service.category}</Badge>
                <span className="text-gray-300">/</span>
                <Badge 
                  variant={service.status === 'Open' ? 'default' : 'secondary'}
                >
                  {service.status}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center text-gray-500">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span className="text-sm">Posted on {formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{service.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{service.estimatedHours} hours</span>
                </div>
                <div className="flex items-center text-brand-500 font-semibold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>${service.price}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden mb-8 bg-gray-100">
              {service.imageUrl ? (
                <img 
                  src={getImageUrl(service.imageUrl)} 
                  alt={service.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // If image fails to load, show local fallback
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <img 
                    src={fallbackImage} 
                    alt="No image available"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {service.description}
                </p>
                
                {service.skills && service.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-80">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Actions</CardTitle>
                <CardDescription>
                  {isAuthenticated 
                    ? 'Take action on this service'
                    : 'Login to interact with this service'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={() => navigate('/login')}
                  >
                    Login to Continue
                  </Button>
                )}
                
                {isAuthenticated && currentRole === 'client' && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={handleHire}
                    disabled={service.status !== 'Open'}
                  >
                    Request This Service
                  </Button>
                )}
                
                {isAuthenticated && currentRole === 'subcontractor' && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={handleBid}
                    disabled={service.status !== 'Open'}
                  >
                    Bid on This Job
                  </Button>
                )}
                
                {isAuthenticated && currentRole === 'admin' && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-brand-300 hover:bg-brand-400"
                      onClick={handleEditService}
                    >
                      Edit Service
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      onClick={handleDeleteService}
                    >
                      Delete Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                  <CardDescription>
                    Send a message about this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={handleSendMessage}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
