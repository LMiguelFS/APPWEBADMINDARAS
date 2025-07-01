import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter, Download } from 'lucide-react';
// import { useInventory } from '../context/InventoryContext';
// import SalesTable from '../components/SalesTable';
import { useMetrics } from '../context/MetricsContext';

const Sales: React.FC = () => {
  // const { sales } = useInventory();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('all');

  const { metrics, loading, error } = useMetrics();
  if (loading) return <p>Cargando métricas...</p>;
  if (error) return <p>Error al cargar métricas: {error.message}</p>;



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
          <h2 className="text-lg font-medium text-gray-900">Resumen de Ventas</h2>
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
            <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
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
          <h2 className="text-lg font-medium text-gray-900">Historial de Ventas</h2>
          <div className="mt-4 sm:mt-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150">
              <Download className="h-5 w-5 mr-1" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Filtro por fecha */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
              defaultValue="all"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="custom">Rango personalizado</option>
            </select>
          </div>

          {/* Filtro por cliente */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
              defaultValue="all"
            >

            </select>
          </div>
        </div>

        {/* Tabla de ventas */}
        {/* <SalesTable /> */}
      </div>
    </div>
  );
};

export default Sales;