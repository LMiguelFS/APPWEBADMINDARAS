import { Forma } from '../types';

const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

export const getEvents = async (): Promise<Forma[]> => {
    const res = await fetch(`${API_PRODUCTS_URL}/events`);
    if (!res.ok) throw new Error('Error al obtener eventos');
    return res.json();
};

export const createEvent = async (data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear evento');
    return res.json();
};

export const updateEvent = async (id: number, data: { name: string }): Promise<Forma> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_PRODUCTS_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar evento');
    return res.json();
};

export const deleteEvent = async (id: number): Promise<void> => {
    const res = await fetch(`${API_PRODUCTS_URL}/events/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar evento');
};
