
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getServiceById } from '@/data/mockServices';
import { useAuth } from '@/contexts/AuthContext';
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

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = React.useState('');
  
  const isCreateMode = location.pathname === '/admin/services/new';
  const isEditMode = location.pathname.includes('/admin/services/') && location.pathname.includes('/edit');
  const isAdminMode = isCreateMode || isEditMode;

  const service = id ? getServiceById(id) : null;
  
  // If we're in edit mode but service doesn't exist
  if (!isCreateMode && isEditMode && !service) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Show the service form for create/edit modes
  if (isAdminMode) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Regular service detail view for non-admin modes
  if (!service) {
    return (
      <Layout>
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
      </Layout>
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
    <Layout>
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
                  src={`${service.imageUrl}?w=800&auto=format`} 
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
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
                  {user 
                    ? 'Take action on this service'
                    : 'Login to interact with this service'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={() => navigate('/login')}
                  >
                    Login to Continue
                  </Button>
                )}
                
                {user && currentRole === 'client' && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={handleHire}
                    disabled={service.status !== 'Open'}
                  >
                    Request This Service
                  </Button>
                )}
                
                {user && currentRole === 'subcontractor' && (
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={handleBid}
                    disabled={service.status !== 'Open'}
                  >
                    Bid on This Job
                  </Button>
                )}
                
                {user && currentRole === 'admin' && (
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
            
            {user && (
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
    </Layout>
  );
};

export default ServiceDetailPage;
