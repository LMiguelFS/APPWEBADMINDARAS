import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const Orders: React.FC = () => {
  // const { orders, loading, fetchOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { orders, loading, fetchOrders, currentPage, totalPages } = useOrders();

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.id?.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === 'all' ||
  //     (statusFilter === 'pending' && order.status === 'pending') ||
  //     (statusFilter === 'completed' && order.status === 'completed') ||
  //     (statusFilter === 'canceled' && order.status === 'canceled');

  //   return matchesSearch && matchesStatus;
  // });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const PEN = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona un total de {orders.length} pedidos
          </p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#96B7BC] focus:border-[#96B7BC] sm:text-sm"
            placeholder="Buscar por cliente o ID de orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#96B7BC] focus:border-[#96B7BC] sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando órdenes...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.user_id || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{PEN.format(parseFloat(order.amount))}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => fetchOrders(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => fetchOrders(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Orders;
