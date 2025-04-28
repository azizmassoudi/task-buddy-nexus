import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchServices } from '../redux/slices/servicesSlice';
import { fetchJobs } from '../redux/slices/jobsSlice';
import { fetchMessages } from '../redux/slices/messagesSlice';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Briefcase, MessageSquare } from 'lucide-react';
import { ServiceStatus } from '@/data/mockServices';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, currentRole } = useAuth();
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.services);
  const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs);
  const { messages, loading: messagesLoading } = useSelector((state: RootState) => state.messages);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchJobs());
    dispatch(fetchMessages());
  }, [dispatch]);

  const getRoleSpecificStats = () => {
    switch (currentRole) {
      case 'admin':
        return {
          services: services.filter(s => s.status === 'Open').length,
          jobs: jobs.filter(j => j.status === 'in_progress').length,
          messages: messages.length // Show total messages for admin
        };
      case 'subcontractor':
        return {
          services: services.filter(s => s.status === 'Open').length,
          jobs: jobs.filter(j => j.status === 'in_progress').length,
          messages: messages.length // Show total messages for subcontractor
        };
      case 'client':
        return {
          services: services.filter(s => s.postedBy === user?.id).length,
          jobs: jobs.filter(j => j.clientId === user?.id).length,
          messages: messages.length // Show total messages for client
        };
      default:
        return { services: 0, jobs: 0, messages: 0 };
    }
  };

  const stats = getRoleSpecificStats();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <CalendarDays className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <p className="text-2xl font-bold">...</p>
              ) : (
                <p className="text-2xl font-bold">{stats.services}</p>
              )}
              <p className="text-xs text-gray-500">
                {currentRole === 'client' ? 'Your posted services' : 'Available services'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <p className="text-2xl font-bold">...</p>
              ) : (
                <p className="text-2xl font-bold">{stats.jobs}</p>
              )}
              <p className="text-xs text-gray-500">
                {currentRole === 'client' ? 'Your active jobs' : 'Jobs in progress'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <p className="text-2xl font-bold">...</p>
              ) : (
                <p className="text-2xl font-bold">{stats.messages}</p>
              )}
              <p className="text-xs text-gray-500">Total messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Services</CardTitle>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <p className="text-gray-600">Loading services...</p>
              ) : services.length === 0 ? (
                <p className="text-gray-600">No services found</p>
              ) : (
                <div className="space-y-4">
                  {services.slice(0, 5).map((service) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-gray-500">{service.status}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <p className="text-gray-600">Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <p className="text-gray-600">No jobs found</p>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.status}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 