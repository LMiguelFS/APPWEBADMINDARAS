import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, TrendingUp } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { User } from '../types/user';
import { adminService } from '../services/adminService'

const Dashboard: React.FC = () => {
  type Order = {
    order_id: number;
    product: string;
    quantity: number;
    amount: number;
    payment_method: string;
    status: string;
  };

  const navigate = useNavigate();
  const { clients, loading, fetchClients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para nuevos usuarios desde la API externa
  const [newusers, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);


  // Cargar los últimos 5 usuarios desde la API REST externa
  useEffect(() => {
    fetchClients();
    setLoadingOrders(true); // importante

    adminService.getOrdersList()
      .then((res: Order[] = []) => {
        const pendientes = res.filter((order) => order.status === 'pendiente');
        setPendingOrders(pendientes.slice(0, 5)); // solo los primeros 5
      })
      .catch((error) => {
        console.error('Error al cargar pedidos:', error);
        setPendingOrders([]); // en caso de error, vacía
      })
      .finally(() => {
        setLoadingOrders(false); // ocultar el "Cargando pedidos..."
      });
  }, [fetchClients]);

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.last_name && client.last_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="mt-1 text-sm text-gray-500">Resumen de tu inventario y desempeño de ventas</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/products/add')}
            className="flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f] transition-colors duration-150"
          >
            <Plus className="h-5 w-5 mr-1" />
            Agregar Producto
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de nuevos usuarios desde la API */}
        {/* Tabla de nuevos usuarios desde la API */}
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-[#4A55A2] mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Nuevos Usuarios</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="text-center py-10 text-gray-500">Cargando usuarios...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Celular
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...filteredClients].reverse().slice(0, 10).map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.name} {client.last_name ?? ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(client.city ?? '') + (client.district ? ', ' + client.district : '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>


        {/* Pedidos recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-[#4A55A2] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Pedidos Pendientes</h2>
            </div>
            <button
              onClick={() => navigate('/sales')}
              className="text-sm text-[#4A55A2] hover:text-[#38467f] transition-colors duration-150"
            >
              Ver todas
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loadingOrders ? (
                <div className="text-center py-10 text-gray-500">Cargando pedidos...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método de Pago</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pendingOrders.length === 0 ? (
                      <tr>
                        <td className="text-center py-6 text-gray-400">No hay pedidos pendientes.</td>
                      </tr>
                    ) : (
                      pendingOrders.map(order => (
                        <tr key={order.order_id}>
                          <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">S/ {order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{order.payment_method}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>


      </div>


    </div>
  );
};

export default Dashboard;