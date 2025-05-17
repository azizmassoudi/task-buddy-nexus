import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobCreate, StatusEnum  } from '../redux/types';
import type { Store } from '@reduxjs/toolkit';

const api = axios.create({
  baseURL: 'http://192.168.100.82:8000',
});

// Use AsyncStorage for token management in React Native
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export a function to set up response interceptor with store
export function setupApiInterceptors(store: Store) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(require('../redux/slices/authSlice').logout());
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('userRole');
        // No window.location.href in React Native
      }
      return Promise.reject(error);
    }
  );
}

export const authAPI = {
  login: (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
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

export const userAPI = {
  updateUserProfile: (userData: { username?: string; email?: string; full_name?: string; avatar?: string }) =>
    api.patch('/user/profile', userData),
  deleteUser: (userId: string) =>
    api.delete(`/user/${userId}`),
  updateUserRole: (userId: string, role: string) => 
    api.patch(`/user/${userId}/role`, { role }), // Send as object
  getAllUsers: () =>
    api.get('/user/users'),
  getUserById: (userId: string) =>
    api.get(`/user/${userId}`),
  uploadCV: (formData: FormData) => {
    return api.post('/user/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSubcontractors: () => 
    api.get('/user/subcontractors'),
};

export const servicesAPI = {
  getAll: () => api.get('/services/'),      // Add trailing slash
  create: (formData: FormData) => api.post('/services/', formData), // Add trailing slash
  update: (id: number, formData: FormData) => api.patch(`/services/${id}/`, formData), // Change to PATCH
  delete: (id: number) => api.delete(`/services/${id}/`), // Add trailing slash
  getById: (id: number) => api.get(`/services/${id}/`), // Add trailing slash
};

export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id: number) => api.get(`/jobs/${id}`),
  create: (data: JobCreate) => api.post('/jobs', data),
  claimJob: (jobId: number) => api.post(`/jobs/${jobId}/claim`),
  updateStatus: (id: number, status: StatusEnum ) => 
    api.put(`/jobs/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/jobs/${id}`),
};

export const messagesAPI = {
  create: (messageData: any) => 
    api.post('/messages/', messageData),
  getByJobId: (jobId: string) => // Added method
    api.get(`/messages/job/${jobId}`),
  getById: (id: string) => 
    api.get(`/messages/${id}`),
  delete: (id: string) => 
    api.delete(`/messages/${id}`),
};

export const aboutAPI = {
  getAll: () => 
    api.get('/about'),
  getByUserId: (userId: string) =>
    api.get(`/about/${userId}`),
  create: (data: { content: string }) =>
    api.post('/about', data),
  update: (userId: string, data: { content: string }) => 
    api.put(`/about/${userId}`, data),
  delete: (userId: string) => 
    api.delete(`/about/${userId}`),
};

export const notificationAPI = {
  getNotifications: () =>
    api.get('/notifications/'),
  markNotificationAsRead: (notificationId: string) =>
    api.patch(`/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: () =>
    api.patch('/notifications/read-all'),
  createNotification: (notificationData: any) =>
    api.post('/notifications/', notificationData),
};

export const serviceRequestsAPI = { // Added API section
  create: (requestData: any) =>
    api.post('/service-requests/service-requests/', requestData),
  updateStatus: (requestId: string, statusData: any) =>
    api.patch(`/service-requests/service-requests/${requestId}/status`, null, { params: statusData }),
};

export const skillAPI = {
  getAllSkills: () => api.get('/skills/'),
  createSkill: (data: { name: string }) => api.post('/skills/', data),
  deleteSkill: (id: number) => api.delete(`/skills/${id}`),
  getUserSkills: (userId: number) => api.get(`/skills/users/${userId}/skills`),
  addSkillToUser: (userId: string, skillId: number) => 
    api.post(`/skills/users/${userId}/skills`, { skill_id: skillId }),
  removeSkillFromUser: (userId: string, skillId: number) => 
    api.delete(`/skills/users/${userId}/skills/${skillId}`),
};
export const serviceRequestAPI = {
  create: (data: {
    service_id: number;  // Ensure number type
    message: string;
    proposed_price: number;  // Ensure number type
  }) => api.post('/service-requests/', data),

  updateStatus: (requestId: number, data: any) => api.patch(`/service-requests/${requestId}/status`, null, { params: data }),  
  getAll: () => api.get('/service-requests/'),
};

export default api;