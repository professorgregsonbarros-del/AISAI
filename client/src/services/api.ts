import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string; institution?: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Plans
export const plansAPI = {
  chat: (messages: { role: string; content: string }[], planId?: string) =>
    api.post('/plans/chat', { messages, planId }),
  list: (params?: { status?: string; search?: string }) =>
    api.get('/plans', { params }),
  get: (id: string) => api.get(`/plans/${id}`),
  create: (data: any) => api.post('/plans', data),
  update: (id: string, data: any) => api.put(`/plans/${id}`, data),
  delete: (id: string) => api.delete(`/plans/${id}`),
};

// Materials
export const materialsAPI = {
  generate: (type: string, planId: string) =>
    api.post('/materials/generate', { type, planId }),
  list: (params?: { type?: string; planId?: string }) =>
    api.get('/materials', { params }),
  update: (id: string, data: { title?: string; content?: any }) =>
    api.put(`/materials/${id}`, data),
  delete: (id: string) => api.delete(`/materials/${id}`),
};

// Reflections
export const reflectionsAPI = {
  create: (data: { planId?: string; perceptions: string; difficulties: string; improvements: string }) =>
    api.post('/reflections', data),
  list: () => api.get('/reflections'),
  suggest: (id: string) => api.post(`/reflections/${id}/suggest`),
};

// Trails
export const trailsAPI = {
  list: (context?: string) => api.get('/trails', { params: context ? { context } : {} }),
};

export default api;
