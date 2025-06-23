import axios from 'axios';
import { Metric } from '../types';
const API_ADMIN_URL = import.meta.env.VITE_API_ADMIN_URL;;


export const getMetrics = async (): Promise<Metric> => {
    try {
        const response = await axios.get<Metric>(`${API_ADMIN_URL}/admin/dashboard/metrics`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las métricas:', error);
        throw error;
    }
};
