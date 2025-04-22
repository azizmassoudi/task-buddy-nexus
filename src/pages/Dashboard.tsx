import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchServices } from '../redux/slices/servicesSlice';
import { fetchJobs } from '../redux/slices/jobsSlice';
import { fetchMessages } from '../redux/slices/messagesSlice';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.services);
  const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs);
  const { messages, loading: messagesLoading } = useSelector((state: RootState) => state.messages);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchJobs());
    dispatch(fetchMessages());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}!</h2>
        <p className="mt-2 text-gray-600">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Services</h3>
          {servicesLoading ? (
            <p className="mt-2 text-gray-600">Loading services...</p>
          ) : (
            <p className="mt-2 text-gray-600">
              You have {services.length} active services
            </p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
          {jobsLoading ? (
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          ) : (
            <p className="mt-2 text-gray-600">
              You have {jobs.length} active jobs
            </p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
          {messagesLoading ? (
            <p className="mt-2 text-gray-600">Loading messages...</p>
          ) : (
            <p className="mt-2 text-gray-600">
              You have {messages.length} unread messages
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="mt-4 space-y-4">
          {services.slice(0, 3).map((service) => (
            <div key={service.id} className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-600">
                New service created: {service.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 