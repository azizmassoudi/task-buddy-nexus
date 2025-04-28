import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchJobs, createJob, deleteJob } from '../redux/slices/jobsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Jobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { services } = useSelector((state: RootState) => state.services);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: 0,
    serviceId: '',
    clientId: '',
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!newJob.title || !newJob.description || !newJob.budget || !newJob.serviceId || !user?.id) {
        throw new Error('Please fill in all required fields');
      }

      const jobData = {
        ...newJob,
        clientId: user.id,
        status: 'open' as const,
      };

      await dispatch(createJob(jobData)).unwrap();
      
      toast({
        title: 'Job created',
        description: 'Your job has been created successfully.',
      });

      // Reset form
      setNewJob({
        title: '',
        description: '',
        budget: 0,
        serviceId: '',
        clientId: '',
      });

      // Refresh jobs list
      dispatch(fetchJobs());
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to create job. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(id)).unwrap();
        toast({
          title: 'Job deleted',
          description: 'The job has been deleted successfully.',
        });
        // Refresh jobs list
        dispatch(fetchJobs());
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete job. Please try again.',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Manage your jobs here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="Enter job title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Enter job description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={newJob.budget}
                onChange={(e) => setNewJob({ ...newJob, budget: Number(e.target.value) })}
                placeholder="Enter job budget"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceId">Service</Label>
              <Select
                value={newJob.serviceId}
                onValueChange={(value) => setNewJob({ ...newJob, serviceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Job'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Jobs</CardTitle>
          <CardDescription>View and manage your existing jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="text-lg font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Budget: ${job.budget}</span>
                          <span>Status: {job.status}</span>
                          <span>Service ID: {job.serviceId}</span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Jobs; 