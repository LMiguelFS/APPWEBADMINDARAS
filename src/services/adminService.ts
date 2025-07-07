const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;
const API_PRODUCTS_URL = import.meta.env.VITE_API_PRODUCTS_URL;

export const adminService = {
    async getDashboardMetrics() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_AUTH_URL}/admin/dashboard/metrics`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener métricas');
        }
        return response.json();
    },

    async getOrdersList() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_AUTH_URL}/admin/orders_list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener la lista de órdenes');
        }
        return response.json();
    },

    async updateOrderStatus(orderId: number, status: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_AUTH_URL}/admin/status-orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el estado');
        }
        return response.json();
    },

    async getClientsList() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_PRODUCTS_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener la lista de clientes');
        }
        return response.json();
    },

};