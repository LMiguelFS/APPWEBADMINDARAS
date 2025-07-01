// src/services/productsApi.ts
import axios from 'axios';
//import { Product} from '../types/product';

const API_URL = import.meta.env.VITE_API_PAYMENTS_URL;

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization' :`Bearer ${token}`
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Payments API
export const paymentsApi = {
    getAll: () => api.get('/payments'),
    getById: (id: string) => api.get(`/payments/${id}`),
    create: (data: any) => api.post('/payments', data),
    getDashboardMetrics: () => api.get('/payments/metrics'),
};