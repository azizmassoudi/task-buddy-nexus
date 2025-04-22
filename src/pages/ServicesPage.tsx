
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { CategoryFilter } from '@/components/services/CategoryFilter';
import { 
  mockServices, 
  getServicesByCategory, 
  ServiceCategory, 
  Service,
  ServiceStatus 
} from '@/data/mockServices';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'All'>('All');

  // Filter services based on all filters
  useEffect(() => {
    let services = mockServices;
    
    // Filter by category
    if (selectedCategory) {
      services = getServicesByCategory(selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      services = services.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    services = services.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    
    // Filter by status
    if (statusFilter !== 'All') {
      services = services.filter(service => service.status === statusFilter);
    }
    
    setFilteredServices(services);
  }, [selectedCategory, searchTerm, priceRange, statusFilter]);

  // Handle category change
  const handleCategoryChange = (category: ServiceCategory | null) => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Services</h1>
            <p className="mt-2 text-lg text-gray-500">
              Find the perfect service for your needs
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter Services</SheetTitle>
                  <SheetDescription>
                    Adjust filters to find the perfect service
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <Select 
                      onValueChange={(value) => setStatusFilter(value as ServiceStatus | 'All')} 
                      defaultValue="All"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                    <div className="pt-2 px-1">
                      <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={50}
                        onValueChange={setPriceRange as any}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button 
                    className="w-full bg-brand-300 hover:bg-brand-400"
                    onClick={() => {
                      setStatusFilter('All');
                      setPriceRange([0, 5000]);
                      setSelectedCategory(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
        
        {filteredServices.length > 0 ? (
          <ServiceGrid services={filteredServices} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg text-gray-500">No services match your filters</h3>
            <Button 
              variant="link" 
              className="text-brand-500 mt-2"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setPriceRange([0, 5000]);
                setSelectedCategory(null);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicesPage;
