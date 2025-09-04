import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getStatsSummary = () => api.get('/stats/summary').then(r => r.data);
export const getUsers = (params) => api.get('/users', { params }).then(r => r.data);
export const blockUser = (id) => api.patch(`/users/${id}/block`).then(r => r.data);
export const unblockUser = (id) => api.patch(`/users/${id}/unblock`).then(r => r.data);
export const changeUserRole = (id, role) => api.patch(`/users/${id}/role`, { role }).then(r => r.data);
export const getForms = () => api.get('/forms').then(r => r.data);
export const sendAdminNotification = (id, type, customMessage) => api.post(`/forms/${id}/notify`, { type, customMessage }).then(r => r.data);
export const getFormById = (id) => api.get(`/forms/${id}`).then(r => r.data);
export const getTodayStats = () => api.get('/stats/today').then(r => r.data);
export const updateFormStatus = (id, status, extra = {}) => api.patch(`/forms/${id}/status`, { status, ...extra }).then(r => r.data);

export default api;
