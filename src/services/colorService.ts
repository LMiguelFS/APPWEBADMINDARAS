import { Forma } from '../types';

const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

export const getColors = async (): Promise<Forma[]> => {
    const res = await fetch(`${API_PRODUCTS_URL}/colors`);
    if (!res.ok) throw new Error('Error al obtener colores');
    return res.json();
};

export const createColors = async (data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear color');
    return res.json();
};

export const updateColors = async (id: number, data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/colors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar color');
    return res.json();
};

export const deleteColors = async (id: number): Promise<void> => {
    const res = await fetch(`${API_PRODUCTS_URL}/colors/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar color');
};
