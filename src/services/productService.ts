// src/services/productsApi.ts
import axios from 'axios';
//import { Product} from '../types/product';

const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

const api = axios.create({
  baseURL: API_PRODUCTS_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
   // 🔽 Nuevas funciones para referencias
   getColors: () => api.get('/colors'),
   getScents: () => api.get('/scents'),
   getForms: () => api.get('/forms'),
   getEvents: () => api.get('/events'),
};
