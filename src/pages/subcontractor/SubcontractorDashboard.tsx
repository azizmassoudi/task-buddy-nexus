
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
import { 
  Search, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star,
  CheckCircle
} from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Progress } from '@/components/ui/progress';

const SubcontractorDashboard = () => {
  const { user, currentRole } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in or not a subcontractor
  if (!user || currentRole !== 'subcontractor') {
    navigate('/login');
    return null;
  }

  // Placeholder available jobs (we'd normally filter)
  const availableJobs = mockServices.filter(s => s.status === 'Open').slice(0, 3);

  // Mock earnings data
  const earningsData = {
    total: 4250,
    pending: 750,
    completed: 8,
    inProgress: 2,
    rating: 4.8,
    profileCompletion: 85
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
            <p className="mt-2 text-lg text-gray-500">
              Find jobs and manage your contracts
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-brand-300 hover:bg-brand-400"
              onClick={() => navigate('/services')}
            >
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
          </div>
        </div>
        
        {/* Contractor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-brand-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-brand-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <h3 className="text-2xl font-semibold text-gray-900">${earningsData.total}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{earningsData.completed}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{earningsData.inProgress}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{earningsData.rating}/5</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Completion Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-medium text-gray-900">Profile Completion</h3>
                <p className="text-gray-500">Complete your profile to get more jobs</p>
              </div>
              <div className="sm:w-1/3">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium text-gray-900 mr-2">{earningsData.profileCompletion}%</div>
                  <div className="flex-grow">
                    <Progress value={earningsData.profileCompletion} className="h-2" />
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/contractor/profile')}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="available-jobs">
          <TabsList className="mb-8">
            <TabsTrigger value="available-jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available-jobs">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Matching Your Skills</CardTitle>
                <CardDescription>
                  Jobs that match your skills and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availableJobs.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available jobs matching your skills</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/services')}
                >
                  View All Available Jobs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Active Jobs</CardTitle>
                <CardDescription>
                  Jobs you're currently working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    You don't have any active jobs at the moment
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/services')}
                >
                  Find Jobs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="bids">
            <Card>
              <CardHeader>
                <CardTitle>My Bids</CardTitle>
                <CardDescription>
                  Jobs you've bid on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    You haven't placed any bids yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SubcontractorDashboard;
