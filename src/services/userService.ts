import axios from 'axios';
const API_USERS_URL = import.meta.env.VITE_API_USERS_URL;


const api = axios.create({
  baseURL: API_USERS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const customersApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  desactivate: (id: number) => api.patch(`/users/${id}`),
};