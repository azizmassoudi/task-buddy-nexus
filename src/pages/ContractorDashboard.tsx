import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  DollarSign,
  Plus 
} from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';

const ContractorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { services } = useSelector((state: RootState) => state.services);
  
  // Redirect if not logged in or not a contractor
  if (!user || user.role !== 'subcontractor') {
    navigate('/login');
    return null;
  }

  // Placeholder stats
  const stats = {
    activeJobs: 5,
    completedJobs: 12,
    pendingJobs: 3,
    totalEarnings: 2500,
    averageRating: 4.8,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
        <Button onClick={() => navigate('/services/new')}>
          Add New Service
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active-jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="completed-jobs">Completed Jobs</TabsTrigger>
          <TabsTrigger value="services">Your Services</TabsTrigger>
        </TabsList>
        <TabsContent value="active-jobs" className="space-y-4">
          {/* Active Jobs Content */}
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-500">No active jobs at the moment</h3>
          </div>
        </TabsContent>
        <TabsContent value="completed-jobs" className="space-y-4">
          {/* Completed Jobs Content */}
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-500">No completed jobs yet</h3>
          </div>
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          {/* Services Content */}
          <ServiceGrid services={services} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractorDashboard; 