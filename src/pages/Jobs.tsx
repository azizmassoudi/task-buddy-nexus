import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchJobs, createJob, deleteJob } from '../redux/slices/jobsSlice';

const Jobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
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
    try {
      await dispatch(createJob(newJob)).unwrap();
      setNewJob({
        title: '',
        description: '',
        budget: 0,
        serviceId: '',
        clientId: '',
      });
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
        <p className="mt-2 text-gray-600">Manage your jobs here.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Job</h3>
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <input
              type="number"
              id="budget"
              value={newJob.budget}
              onChange={(e) => setNewJob({ ...newJob, budget: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
              Service ID
            </label>
            <input
              type="text"
              id="serviceId"
              value={newJob.serviceId}
              onChange={(e) => setNewJob({ ...newJob, serviceId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
              Client ID
            </label>
            <input
              type="text"
              id="clientId"
              value={newJob.clientId}
              onChange={(e) => setNewJob({ ...newJob, clientId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Job
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Jobs</h3>
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.description}</p>
                    <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
                    <p className="text-sm text-gray-500">Status: {job.status}</p>
                    <p className="text-sm text-gray-500">Service ID: {job.serviceId}</p>
                    <p className="text-sm text-gray-500">Client ID: {job.clientId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 