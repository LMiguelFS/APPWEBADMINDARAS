import { Product } from '../types/product';
import axios from 'axios';
const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

const api = axios.create({
  baseURL: API_PRODUCTS_URL,
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

// Products API
export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Product) => api.post<Product>('/products', data),
  update: (id: string, data: Product) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete<void>(`/products/${id}`),
};
