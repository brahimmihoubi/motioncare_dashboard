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

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      AuthService.logout();
      window.location.reload(); // Force reload to trigger unauthenticated state
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/admin/login', credentials);
    const result = response.data;
    if (result.success && result.data && result.data.token) {
      localStorage.setItem('mc_admin_token', result.data.token);
      if (result.data.user) {
         localStorage.setItem('mc_admin_profile', JSON.stringify(result.data.user));
      }
    }
    return result;
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

export const ExerciseRequestService = {
  // Doctor methods
  createRequest: async (data: any) => {
    const response = await api.post('/exercise-requests', data);
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get('/exercise-requests/my');
    return response.data;
  },
  // Admin methods
  getAllRequests: async (params?: any) => {
    const response = await api.get('/exercise-requests', { params });
    return response.data;
  },
  getRequestById: async (id: number) => {
    const response = await api.get(`/exercise-requests/${id}`);
    return response.data;
  },
  updateRequestStatus: async (id: number, status: string, admin_notes?: string) => {
    const response = await api.patch(`/exercise-requests/${id}/status`, { status, admin_notes });
    return response.data;
  }
};

export const NotificationService = {
  getMyNotifications: async (params?: any) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
  markRead: async (id: number) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  }
};

export const AuditLogService = {
  getAllLogs: async (params?: any) => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  }
};

export const ExoskeletonService = {
  initSession: async (sessionId: number, total_duration_seconds: number = 0) => {
    const response = await api.post(`/sessions/${sessionId}/exo/init`, { total_duration_seconds });
    return response.data;
  },
  getState: async (sessionId: number) => {
    const response = await api.get(`/sessions/${sessionId}/exo/state`);
    return response.data;
  },
  start: async (sessionId: number) => {
    const response = await api.post(`/sessions/${sessionId}/exo/start`);
    return response.data;
  },
  pause: async (sessionId: number) => {
    const response = await api.post(`/sessions/${sessionId}/exo/pause`);
    return response.data;
  },
  resume: async (sessionId: number) => {
    const response = await api.post(`/sessions/${sessionId}/exo/resume`);
    return response.data;
  },
  stop: async (sessionId: number) => {
    const response = await api.post(`/sessions/${sessionId}/exo/stop`);
    return response.data;
  },
  emergencyStop: async (sessionId: number, reason?: string) => {
    const response = await api.post(`/sessions/${sessionId}/exo/emergency-stop`, { reason });
    return response.data;
  },
  setExercise: async (sessionId: number, exercise_id: number) => {
    const response = await api.post(`/sessions/${sessionId}/exo/exercise`, { exercise_id });
    return response.data;
  }
};
