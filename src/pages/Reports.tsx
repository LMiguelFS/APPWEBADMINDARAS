import React, { useState } from 'react';
import { Calendar, Download, BarChart3, PieChart } from 'lucide-react';
//import { useInventory } from '../context/InventoryContext';

const Reports: React.FC = () => {
    //const { sales, products } = useInventory();
    const [dateRange, setDateRange] = useState('month');


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Revisa el desempeño de tus ventas y el análisis de inventario
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="day">Este dia</option>
                            <option value="week">Esta semana</option>
                            <option value="month">Este mes</option>
                            <option value="year">Este año</option>
                            <option value="all">Todo el tiempo</option>
                        </select>
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150">
                        <Download className="h-5 w-5 mr-1" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Sales metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Ingresos</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +12.5%
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$</p>
                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full">
                        <div className="h-1 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Ganancia</h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${21 > 20 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                            %
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$</p>
                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full">
                        <div
                            className={`h-1 rounded-full ${21 > 20 ? 'bg-green-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(1 * 1.5, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Órdenes</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            +8.3%
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900"></p>
                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full">
                        <div className="h-1 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
            </div>

            {/* Sales by category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <PieChart className="h-5 w-5 text-[#4A55A2] mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Ventas por Categoría</h2>
                        </div>
                    </div>

                    {/* {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage = (amount / totalRevenue) * 100;

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{category}</span>
                      <span className="text-sm text-gray-500">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-[#4A55A2] rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm text-gray-500">No hay datos de ventas disponibles</p>
            </div>
          )} */}
                </div>

                {/* Top selling products */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <BarChart3 className="h-5 w-5 text-[#4A55A2] mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Productos más vendidos</h2>
                        </div>
                    </div>

                    {1 > 0 ? (
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ingresos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">

                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-sm text-gray-500">No hay datos de ventas disponibles</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-[#4A55A2] mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Estado del Inventario</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Productos Totales</p>
                        <p className="text-2xl font-bold text-gray-900"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Productos con Bajo Stock</p>
                        <p className="text-2xl font-bold text-amber-600"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Sin Stock</p>
                        <p className="text-2xl font-bold text-red-600"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Valor del Inventario</p>
                        <p className="text-2xl font-bold text-gray-900">

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;