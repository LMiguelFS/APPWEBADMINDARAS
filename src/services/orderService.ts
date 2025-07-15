import axios from 'axios';
import { PaginatedOrderResponse } from '../types/order';

const API_ORDERS_URL = import.meta.env.VITE_API_ORDERS_URL;

const api = axios.create({
  baseURL: API_ORDERS_URL,
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

export const ordersApi = {
  getAll: (page = 1): Promise<{ data: PaginatedOrderResponse }> =>
    api.get(`/orders-list?page=${page}`),
  getById: (id: string) => api.get(`/orders/${id}`),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
};
