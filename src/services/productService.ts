// src/services/productsApi.ts
import axios from 'axios';
import { Forma,Scent,Color,Event } from '../types'; // Asegúrate que `Forma` sea adecuado para todos los usos

const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;
const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: API_PRODUCTS_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const productsApi = {
  // Products
  getAll: () => api.get('/productsAll'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),

  // Colors
  getColors: (): Promise<{ data: Color[] }> => api.get('/colors'),
  createColor: (data: { name: string }): Promise<{ data: Color }> => api.post('/colors', data),
  updateColor: (id: number, data: { name: string }): Promise<{ data: Color }> =>
    api.put(`/colors/${id}`, data),
  deleteColor: (id: number): Promise<void> => api.delete(`/colors/${id}`),

  // Scents
  getScents: (): Promise<{ data: Scent[] }> => api.get('/scents'),
  createScent: (data: { name: string }): Promise<{ data: Scent }> => api.post('/scents', data),
  updateScent: (id: number, data: { name: string }): Promise<{ data: Scent }> =>
    api.put(`/scents/${id}`, data),
  deleteScent: (id: number): Promise<void> => api.delete(`/scents/${id}`),

  // Forms
  getForms: (): Promise<{ data: Forma[] }> => api.get('/forms'),
  createForm: (data: { name: string }): Promise<{ data: Forma }> => api.post('/forms', data),
  updateForm: (id: number, data: { name: string }): Promise<{ data: Forma }> =>
    api.put(`/forms/${id}`, data),
  deleteForm: (id: number): Promise<void> => api.delete(`/forms/${id}`),

  // Events
  getEvents: (): Promise<{ data: Event[] }> => api.get('/events'),
  createEvent: (data: { name: string }): Promise<{ data: Event }> => api.post('/events', data),
  updateEvent: (id: number, data: { name: string }): Promise<{ data: Event }> =>
    api.put(`/events/${id}`, data),
  deleteEvent: (id: number): Promise<void> => api.delete(`/events/${id}`),
};
