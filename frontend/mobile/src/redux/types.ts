import { UserRole } from "../types/user";

// Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  avatar?: string;
  cvurl:string
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  owner_id: number;
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  admin_notes?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: StatusEnum;
  service_id: number;
  client_requirements?: string;
  client_id: number | null;
  freelancer_id: number | null;
  service_request_id?: number | null;
  created_at: string;
  updated_at: string;
}
export interface JobCreate {
  title: string;
  description: string;
  service_id: number;  // Matches backend's service_id field
  budget: number;
  client_requirements?: string;  // Optional as per the schema
  service_request_id?: number;    // Optional as per the schema
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status: 'all' | 'todo' | 'in-progress' | 'done';
  priority: 'all' | 'low' | 'medium' | 'high';
  search: string;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters {
  status: 'all' | 'active' | 'completed' | 'archived';
  search: string;
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
}

// UI Types
export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface UIState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  loading: boolean;
} 

export interface Skill {
  id: number;
  name: string;
  users?: User[];  
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSkill {
  user_id: number;
  skill_id: number;
  created_at: Date;
}

export interface ServiceRequest {
  id: number;
  service_id: number;
  subcontractor_id: number;
  status: StatusEnum;
  message: string;
  admin_notes?: string;
  proposed_price: number;
  created_at: string;
  service: {
    title: string;
    description: string;
    price: number;
    category: string;
  };
  subcontractor: {
    id: number;
    username: string;
    email: string;
  };
  job?: Job;
}

export interface ServiceRequestCreate {
  service_id: number;
  message: string;
  proposed_price: number;
}
export type ServiceStatus = "Open" | "In_progress" | "Completed" | "Cancelled"|"Pending";
export type StatusEnum = 
  | "Pending"
  | "Approved"
  | "Rejected";