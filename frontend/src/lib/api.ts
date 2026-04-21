import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const leadsAPI = {
  create: (data: any) => api.post('/api/leads', data),
  getAll: () => api.get('/api/leads'),
  getById: (id: number) => api.get(`/api/leads/${id}`),
  updateStatus: (id: number, status: string, notes?: string) =>
    api.patch(`/api/leads/${id}`, { status, notes }),
  delete: (id: number) => api.delete(`/api/leads/${id}`),
  getStats: () => api.get('/api/leads/stats'),
};

export const blogAPI = {
  getAll: () => api.get('/api/blog'),
  getBySlug: (slug: string) => api.get(`/api/blog/${slug}`),
  create: (data: any) => api.post('/api/blog', data),
  update: (id: number, data: any) => api.patch(`/api/blog/${id}`, data),
  delete: (id: number) => api.delete(`/api/blog/${id}`),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post('/api/auth/register', { email, password, name }),
  me: () => api.get('/api/auth/me'),
};

export default api;
