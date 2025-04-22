
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { CategoryFilter } from '@/components/services/CategoryFilter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockServices, 
  getServicesByCategory, 
  ServiceCategory, 
  Service 
} from '@/data/mockServices';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  const { user, currentRole } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter services based on selected category and search term
  useEffect(() => {
    let services = selectedCategory ? getServicesByCategory(selectedCategory) : mockServices;
    
    if (searchTerm) {
      services = services.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(services);
  }, [selectedCategory, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category: ServiceCategory | null) => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative gradient-bg py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-brand-500 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Find the Right Service Provider
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-brand-100">
            Connect with qualified professionals for any job you need done.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full rounded-l-md pl-10 sm:text-sm border-gray-300 py-4"
                  placeholder="What service do you need?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="bg-brand-800 hover:bg-brand-700 text-white px-6 rounded-l-none rounded-r-md"
                onClick={() => navigate('/services')}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Content */}
      {user && currentRole && (
        <section className="py-12 bg-brand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {currentRole === 'admin' && 'Admin Dashboard'}
                {currentRole === 'subcontractor' && 'Contractor Dashboard'}
                {currentRole === 'client' && 'Client Dashboard'}
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                {currentRole === 'admin' && 'Manage services and users from your dashboard.'}
                {currentRole === 'subcontractor' && 'Find jobs that match your skills and start earning.'}
                {currentRole === 'client' && 'Browse services or post your requirements.'}
              </p>
              <div className="mt-8">
                <Button
                  className="bg-brand-300 hover:bg-brand-400"
                  onClick={() => 
                    navigate(
                      currentRole === 'admin' 
                        ? '/admin/dashboard' 
                        : currentRole === 'subcontractor'
                        ? '/contractor/dashboard'
                        : '/client/dashboard'
                    )
                  }
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Browse our most popular service categories
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          <ServiceGrid services={filteredServices} />
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-brand-300 text-brand-500 hover:bg-brand-50"
              onClick={() => navigate('/services')}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Easy steps to get started with our platform
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Find a Service</h3>
              <p className="text-gray-500">
                Browse through our wide range of professional services or search for a specific service you need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Choose a Provider</h3>
              <p className="text-gray-500">
                Review profiles, ratings, and portfolios to find the right professional for your job.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Get It Done</h3>
              <p className="text-gray-500">
                Book the service, communicate directly with the provider, and pay securely through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-300 to-brand-500 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-brand-100">Join our platform today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-white">
                  Create an account to find services or become a service provider.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:ml-8">
                <div className="inline-flex rounded-md shadow">
                  <Button 
                    className="bg-white text-brand-600 hover:bg-brand-50"
                    onClick={() => navigate('/register')}
                  >
                    Sign up now
                  </Button>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Button 
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-brand-500"
                    onClick={() => navigate('/services')}
                  >
                    Browse services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
