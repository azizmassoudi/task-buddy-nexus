// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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