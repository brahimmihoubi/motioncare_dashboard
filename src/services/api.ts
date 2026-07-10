import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to append the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/admin/login', credentials);
    if (response.data.token) {
      localStorage.setItem('mc_admin_token', response.data.token);
      if (response.data.user) {
         localStorage.setItem('mc_admin_profile', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('mc_admin_token');
    localStorage.removeItem('mc_admin_profile');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('mc_admin_token');
  }
};

export const DataService = {
  getAdminPatients: async () => {
    const response = await api.get('/admin/patients');
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getRecentSessions: async (limit = 10) => {
    const response = await api.get(`/admin/sessions?limit=${limit}`);
    return response.data;
  },
  getWeeklyStats: async () => {
    const response = await api.get('/admin/weekly-stats');
    return response.data;
  },
  getAdminPrograms: async () => {
    const response = await api.get('/admin/programs');
    return response.data;
  },
  getExercises: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },
};
