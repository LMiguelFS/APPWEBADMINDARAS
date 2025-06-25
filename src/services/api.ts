import axios from 'axios';

const API_URL = import.meta.env.VITE_API_USERS_URL; // Updated to local development server

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Products API
export const productsApi = {
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data), // Aquí se realiza el POST
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

// Customers API
export const customersApi = {
    getAll: () => api.get('/customers'),
    getById: (id: string) => api.get(`/customers/${id}`),
    create: (data: any) => api.post('/customers', data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
};

// Sales API
export const salesApi = {
    getAll: () => api.get('/sales'),
    getById: (id: string) => api.get(`/sales/${id}`),
    create: (data: any) => api.post('/sales', data),
    getDashboardMetrics: () => api.get('/sales/metrics'),
};

// Auth API
export const authApi = {
    login: (credentials: { username: string; password: string }) =>
        api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
};

export default api;