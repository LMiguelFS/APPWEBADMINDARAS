import { Forma } from '../types';
const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

export const getFormas = async (): Promise<Forma[]> => {
    const res = await fetch(`${API_PRODUCTS_URL}/forms`);
    if (!res.ok) throw new Error('Error al obtener formas');
    return res.json();
};

export const createForma = async (data: { name: string }): Promise<Forma> => {
    const res = await fetch(`${API_PRODUCTS_URL}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear forma');
    return res.json();
};

export const updateForma = async (id: number, data: { name: string }): Promise<Forma> => {
    const res = await fetch(`${API_PRODUCTS_URL}/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar forma');
    return res.json();
};

export const deleteForma = async (id: number): Promise<void> => {
    const res = await fetch(`${API_PRODUCTS_URL}/forms/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar forma');
};
