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
  
  // -- Patients CRUD --
  createPatient: async (data: any) => {
    const response = await api.post('/admin/patients', data);
    return response.data;
  },
  updatePatient: async (id: number, data: any) => {
    const response = await api.put(`/admin/patients/${id}`, data);
    return response.data;
  },
  deletePatient: async (id: number) => {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  },

  // -- Programs CRUD --
  createProgram: async (data: any) => {
    const response = await api.post('/admin/programs', data);
    return response.data;
  },
  updateProgram: async (id: number, data: any) => {
    const response = await api.put(`/admin/programs/${id}`, data);
    return response.data;
  },
  deleteProgram: async (id: number) => {
    const response = await api.delete(`/admin/programs/${id}`);
    return response.data;
  },

  // -- Exercises CRUD --
  createExercise: async (data: any) => {
    const response = await api.post('/admin/exercises', data);
    return response.data;
  },
  updateExercise: async (id: number, data: any) => {
    const response = await api.put(`/admin/exercises/${id}`, data);
    return response.data;
  },
  deleteExercise: async (id: number) => {
    const response = await api.delete(`/admin/exercises/${id}`);
    return response.data;
  },

  // -- Sessions CRUD --
  createSession: async (data: any) => {
    const response = await api.post('/admin/sessions', data);
    return response.data;
  },
  updateSession: async (id: number, data: any) => {
    const response = await api.put(`/admin/sessions/${id}`, data);
    return response.data;
  },
  deleteSession: async (id: number) => {
    const response = await api.delete(`/admin/sessions/${id}`);
    return response.data;
  },
  
  // -- Doctors CRUD --
  getDoctors: async () => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },
  createDoctor: async (data: any) => {
    const response = await api.post('/admin/doctors', data);
    return response.data;
  },
  updateDoctor: async (id: number, data: any) => {
    const response = await api.put(`/admin/doctors/${id}`, data);
    return response.data;
  },
  deleteDoctor: async (id: number) => {
    const response = await api.delete(`/admin/doctors/${id}`);
    return response.data;
  }
};
