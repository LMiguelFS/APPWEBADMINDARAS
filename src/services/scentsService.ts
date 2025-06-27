import { Forma } from '../types';

const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

export const getScents = async (): Promise<Forma[]> => {
    const res = await fetch(`${API_PRODUCTS_URL}/scents`);
    if (!res.ok) throw new Error('Error al obtener aromas');
    return res.json();
};

export const createScent = async (data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/scents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear aroma');
    return res.json();
};

export const updateScent = async (id: number, data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/scents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar aroma');
    return res.json();
};

export const deleteScent = async (id: number): Promise<void> => {
    const res = await fetch(`${API_PRODUCTS_URL}/scents/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar aroma');
};
