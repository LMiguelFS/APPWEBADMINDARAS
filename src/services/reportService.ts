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




// Reports API
export const reportsApi = {
    getAll: () => api.get('/reports'),
    getById: (id: string) => api.get(`/reports/${id}`),
    create: (data: any) => api.post('/reports', data),
    getDashboardMetrics: () => api.get('/reports/metrics'),
};


export default api;