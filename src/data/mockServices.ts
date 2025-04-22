
// Define service categories
export type ServiceCategory = 
  | "Plumbing" 
  | "Electrical" 
  | "Cleaning" 
  | "IT Support" 
  | "Carpentry"
  | "Landscaping"
  | "Moving"
  | "Home Repair";

// Define service status
export type ServiceStatus = "Open" | "In Progress" | "Completed" | "Cancelled";

// Define service interface
export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number; // Base price in USD
  location: string;
  status: ServiceStatus;
  postedBy: string; // Reference to admin who posted it
  postedDate: string; // ISO date string
  imageUrl?: string;
  estimatedHours?: number;
  skills?: string[];
}

// Mock services data
export const mockServices: Service[] = [
  {
    id: "1",
    title: "Emergency Plumbing Repair",
    description: "Fixing water leaks, broken pipes, and other plumbing emergencies in residential settings. Must have own tools and 5+ years of experience.",
    category: "Plumbing",
    price: 120,
    location: "Austin, TX",
    status: "Open",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-15T08:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659",
    estimatedHours: 4,
    skills: ["Leak repair", "Pipe fitting", "Water heater installation"]
  },
  {
    id: "2",
    title: "Office Deep Cleaning",
    description: "Complete office deep cleaning including carpets, windows, and bathrooms for a 3000 sq ft space. Commercial cleaning experience required.",
    category: "Cleaning",
    price: 350,
    location: "Seattle, WA",
    status: "Open",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-16T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    estimatedHours: 8,
    skills: ["Commercial cleaning", "Carpet cleaning", "Window cleaning"]
  },
  {
    id: "3",
    title: "Network Setup and Configuration",
    description: "Setting up a secure office network including routers, switches, and wifi access points for a small business with 20 employees.",
    category: "IT Support",
    price: 500,
    location: "Remote",
    status: "Open",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-17T14:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    estimatedHours: 6,
    skills: ["Networking", "Security", "Router configuration"]
  },
  {
    id: "4",
    title: "Kitchen Renovation",
    description: "Complete kitchen renovation including cabinet installation, countertop fitting, and appliance hookup.",
    category: "Carpentry",
    price: 3500,
    location: "Portland, OR",
    status: "In Progress",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-10T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1",
    estimatedHours: 40,
    skills: ["Cabinet making", "Countertop installation", "Finishing"]
  },
  {
    id: "5",
    title: "Lawn Maintenance and Landscaping",
    description: "Regular maintenance of a large residential property including mowing, pruning, and seasonal planting.",
    category: "Landscaping",
    price: 150,
    location: "Miami, FL",
    status: "Open",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-18T11:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01",
    estimatedHours: 5,
    skills: ["Lawn care", "Pruning", "Planting"]
  },
  {
    id: "6",
    title: "Residential Moving Service",
    description: "Full-service moving for a 3-bedroom house including packing, loading, transportation, and unpacking.",
    category: "Moving",
    price: 800,
    location: "Chicago, IL",
    status: "Open",
    postedBy: "1", // Admin user ID
    postedDate: "2025-04-19T13:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1600518465332-8a794252a2b6",
    estimatedHours: 10,
    skills: ["Heavy lifting", "Careful handling", "Efficient packing"]
  }
];

// Function to get services by status
export const getServicesByStatus = (status?: ServiceStatus): Service[] => {
  if (!status) return mockServices;
  return mockServices.filter(service => service.status === status);
};

// Function to get a service by ID
export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find(service => service.id === id);
};

// Function to get services by category
export const getServicesByCategory = (category: ServiceCategory): Service[] => {
  return mockServices.filter(service => service.category === category);
};

// Get all unique categories
export const getAllCategories = (): ServiceCategory[] => {
  return Array.from(new Set(mockServices.map(service => service.category)));
};
