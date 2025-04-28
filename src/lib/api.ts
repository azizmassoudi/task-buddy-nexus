import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept all status codes less than 500
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  register: (userData: any) => 
    api.post('/auth/register', userData),
  logout: () => 
    api.post('/auth/logout'),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Services API
export const servicesAPI = {
  getAll: () => 
    api.get('/services'),
  getById: (id: string) => 
    api.get(`/services/${id}`),
  create: (formData: FormData) => 
    api.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id: string, serviceData: any) => 
    api.put(`/services/${id}`, serviceData),
  delete: (id: string) => 
    api.delete(`/services/${id}`),
};

// Jobs API
export const jobsAPI = {
  getAll: () => 
    api.get('/jobs'),
  getById: (id: string) => 
    api.get(`/jobs/${id}`),
  create: (jobData: any) => 
    api.post('/jobs', jobData),
  update: (id: string, jobData: any) => 
    api.put(`/jobs/${id}`, jobData),
  delete: (id: string) => 
    api.delete(`/jobs/${id}`),
};

// Messages API
export const messagesAPI = {
  getAll: () => 
    api.get('/messages'),
  getById: (id: string) => 
    api.get(`/messages/${id}`),
  create: (messageData: any) => 
    api.post('/messages', messageData),
  update: (id: string, messageData: any) => 
    api.put(`/messages/${id}`, messageData),
  delete: (id: string) => 
    api.delete(`/messages/${id}`),
};

export default api; 