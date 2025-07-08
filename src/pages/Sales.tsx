import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter, Download } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { adminService } from '../services/adminService'

const Sales: React.FC = () => {
  // const { sales } = useInventory();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('all');

  // Métricas
  const [metrics, setMetrics] = useState<{
    pedidos_totales: number;
    pedidos_pendientes: number;
    numero_usuarios: number;
  } | null>(null);

  // Órdenes y filtros
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  // 1. Construir el filtro de clientes por nombre y apellido
  const clients = Array.from(
    new Map(
      orders.map(order => [
        `${order.name} ${order.last_name}`,
        { name: order.name, last_name: order.last_name }
      ])
    ).values()
  );

  useEffect(() => {
    setOrdersLoading(true);
    adminService.getOrdersList()
      .then(res => {
        setOrders(res || []); // <-- aquí el cambio
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrdersError('Error al cargar órdenes');
        setOrdersLoading(false);
      });
  }, []);

  useEffect(() => {
    adminService.getDashboardMetrics()
      .then(data => setMetrics(data))
      .catch(() => { });
  }, []);

  // Filtrado de órdenes
  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order =>
      clientFilter === 'all' ||
      `${order.name} ${order.last_name}` === clientFilter
    );

  // Función para manejar el cambio de estado (puedes implementar la API aquí)
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert('No se pudo actualizar el estado de la orden');
    }
  };

  if (ordersLoading) return <p>Cargando órdenes...</p>;
  if (ordersError) return <p>{ordersError}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y registra tus transacciones de ventas
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/sales/add')}
            className="flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f] transition-colors duration-150"
          >
            <Plus className="h-5 w-5 mr-1" />
            Registrar Venta
          </button>
        </div> */}
      </div>

      {/* Resumen de ventas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Metricas claves</h2>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Pedidos totales</p>
            <p className="text-2xl font-bold text-gray-900">{metrics?.pedidos_totales}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Pedidos pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{metrics?.pedidos_pendientes}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Número de Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{metrics?.numero_usuarios}</p>
          </div>
        </div>
      </div>

      {/* Filtros y controles de ventas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Estado de Ordenes</h2>
          <div className="mt-4 sm:mt-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150">
              <Download className="h-5 w-5 mr-1" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Filtro por estado */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          {/* Filtro por cliente */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
            >
              <option value="all">Todos los clientes</option>
              {clients.map(client => (
                <option
                  key={`${client.name} ${client.last_name}`}
                  value={`${client.name} ${client.last_name}`}
                >
                  {client.name} {client.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de ventas */}
        <div className="overflow-x-auto">
          {ordersLoading ? (
            <p className="text-gray-500 p-4">Cargando órdenes...</p>
          ) : ordersError ? (
            <p className="text-red-500 p-4">{ordersError}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Apellido</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Método de pago</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
               </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">No hay órdenes para mostrar.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.order_id || order.email + order.product}>
                      <td className="px-4 py-2">{order.name}</td>
                      <td className="px-4 py-2">{order.last_name}</td>
                      <td className="px-4 py-2">{order.email}</td>
                      <td className="px-4 py-2">{order.phone || '-'}</td>
                      <td className="px-4 py-2">{order.product}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">S/{order.amount}</td>
                      <td className="px-4 py-2 capitalize">{order.payment_method}</td>
                      <td className="px-4 py-2">
                        <select
                          className="border rounded px-2 py-1"
                          value={order.status || 'pendiente'}
                          onChange={e => handleStatusChange(order.order_id, e.target.value)}
                          disabled={!order.order_id}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
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
  );
};

export default Sales; 