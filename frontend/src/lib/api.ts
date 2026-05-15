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

export const kbAPI = {
  getAll: () => api.get('/api/chat/kb'),
  create: (data: { keywords: string[]; answer: string; active?: boolean; sort_order?: number }) =>
    api.post('/api/chat/kb', data),
  update: (id: number, data: Partial<{ keywords: string[]; answer: string; active: boolean; sort_order: number }>) =>
    api.put(`/api/chat/kb/${id}`, data),
  delete: (id: number) => api.delete(`/api/chat/kb/${id}`),
  seed: (force = false) => api.post('/api/chat/kb/seed', { force }),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post('/api/auth/register', { email, password, name }),
  me: () => api.get('/api/auth/me'),
};

export const callsAPI = {
  start: (scriptTypeId: number, leadId?: number) => api.post('/api/calls', { scriptTypeId, leadId }),
  list: (params?: { outcome?: string }) => api.get('/api/calls', { params }),
  stats: () => api.get('/api/calls/stats'),
  detail: (id: string) => api.get(`/api/calls/${id}`),
  logStep: (callId: string, scriptSectionId: number) => api.post(`/api/calls/${callId}/steps`, { scriptSectionId }),
  logRebuttal: (callId: string, data: { rebuttalId: number; objectionTypeId: string; scriptSectionId?: number }) =>
    api.post(`/api/calls/${callId}/rebuttals`, data),
  end: (callId: string, outcome: string, notes?: string) => api.post(`/api/calls/${callId}/end`, { outcome, notes }),
  addCustomRebuttal: (callId: string, data: { objectionPhrase: string; yourResponse: string; scriptSectionId?: number }) =>
    api.post(`/api/calls/${callId}/rebuttals/custom`, data),
};

export const objectionsAPI = {
  list: () => api.get('/api/objections'),
  adminAll: () => api.get('/api/objections/admin/all'),
  stats: () => api.get('/api/objections/stats'),
  updateRebuttal: (id: number, data: object) => api.patch(`/api/objections/rebuttals/${id}`, data),
};

export const underwritingAPI = {
  build: (data: { heightFeet: number; heightInches: number; weight: number; age: number }) =>
    api.post('/api/underwriting/build', data),
  searchConditions: (q: string) => api.get(`/api/underwriting/conditions?q=${encodeURIComponent(q)}`),
  searchMedications: (q: string) => api.get(`/api/underwriting/medications?q=${encodeURIComponent(q)}`),
  assess: (data: { tRating: string; conditionIds: number[]; medicationIds: number[]; age: number }) =>
    api.post('/api/underwriting/assess', data),
};

export const askAPI = {
  ask: (message: string) => api.post('/api/ask', { message }),
  submitSmeRequest: (data: object) => api.post('/api/ask/sme-request', data),
  listSmeRequests: () => api.get('/api/ask/sme-requests'),
  updateSmeRequest: (id: string, data: { status?: string; admin_notes?: string }) =>
    api.patch(`/api/ask/sme-requests/${id}`, data),
};

export const webinarAPI = {
  signup: (data: { name: string; email: string; phone?: string; topic: string }) =>
    api.post('/api/webinars/signup', data),
  listSignups: (params?: { topic?: string; status?: string }) =>
    api.get('/api/webinars/signups', { params }),
  stats: () => api.get('/api/webinars/stats'),
  updateSignup: (id: number, data: { status?: string; notes?: string }) =>
    api.patch(`/api/webinars/signups/${id}`, data),
};

export default api;
