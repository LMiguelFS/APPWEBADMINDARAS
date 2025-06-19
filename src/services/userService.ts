import axios from 'axios';
const API_USERS_URL = import.meta.env.VITE_API_ORDERS_URL;

const api = axios.create({
  baseURL: API_USERS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Para agregar el token de autorización
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};