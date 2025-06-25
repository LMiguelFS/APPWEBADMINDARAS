import axios from 'axios';
const API_ORDERS_URL = import.meta.env.VITE_API_ORDERS_URL;

const api = axios.create({
  baseURL: API_ORDERS_URL,
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
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  // create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  // delete: (id: string) => api.delete(`/orders/${id}`),
};