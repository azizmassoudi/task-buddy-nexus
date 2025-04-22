
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { mockServices } from '@/data/mockServices';
import { Search, MessageCircle, Clock, CheckCircle, PlusCircle } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';

const ClientDashboard = () => {
  const { user, currentRole } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in or not a client
  if (!user || currentRole !== 'client') {
    navigate('/login');
    return null;
  }

  // Placeholder client services (we'd normally filter by client ID)
  const myServices = mockServices.slice(0, 2);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="mt-2 text-lg text-gray-500">
              Manage your service requests and find new services
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-brand-300 hover:bg-brand-400"
              onClick={() => navigate('/services')}
            >
              <Search className="mr-2 h-4 w-4" />
              Find Services
            </Button>
          </div>
        </div>
        
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-brand-300 to-brand-500">
            <CardContent className="p-6 text-white">
              <PlusCircle className="h-8 w-8 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Request a Service</h3>
              <p className="mb-4">Post your specific service needs</p>
              <Button 
                variant="secondary" 
                className="bg-white text-brand-500 hover:bg-brand-50 hover:text-brand-600"
                onClick={() => navigate('/client/request-service')}
              >
                Create Request
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-brand-400 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Messages</h3>
              <p className="text-gray-500 mb-4">Chat with service providers</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/client/messages')}
              >
                View Messages
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-brand-400 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Active Services</h3>
              <p className="text-gray-500 mb-4">Track your ongoing service requests</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/client/active-services')}
              >
                View Active
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="my-services">
          <TabsList className="mb-8">
            <TabsTrigger value="my-services">My Services</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="saved">Saved Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-services">
            <Card>
              <CardHeader>
                <CardTitle>My Service Requests</CardTitle>
                <CardDescription>
                  Services you've requested or are currently using
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any active service requests yet</p>
                    <Button 
                      className="bg-brand-300 hover:bg-brand-400"
                      onClick={() => navigate('/services')}
                    >
                      Browse Services
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/client/service-history')}
                >
                  View All
                </Button>
                <Button
                  className="bg-brand-300 hover:bg-brand-400"
                  onClick={() => navigate('/client/request-service')}
                >
                  Create New Request
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Services</CardTitle>
                <CardDescription>
                  Services you've used in the past
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No completed services yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Services</CardTitle>
                <CardDescription>
                  Services you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    You haven't saved any services yet
                  </p>
                  <Button 
                    className="bg-brand-300 hover:bg-brand-400"
                    onClick={() => navigate('/services')}
                  >
                    Browse Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
