import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, TrendingUp } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import DashboardCard from '../components/DashboardCard';
import ProductCard from '../components/ProductCard';
import SalesTable from '../components/SalesTable';

type ApiCustomer = {
  id: number;
  name: string;
  email: string;
  direccion: string;
  celular: string;
};

const Dashboard: React.FC = () => {
  const {
    dashboardMetrics,
    lowStockProducts,
    sales
  } = useInventory();
  const navigate = useNavigate();

  // Estado para nuevos usuarios desde la API externa
  const [nuevosUsuarios, setNuevosUsuarios] = useState<ApiCustomer[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  // Cargar los últimos 5 usuarios desde la API REST externa
  useEffect(() => {
    const fetchNuevosUsuarios = async () => {
      setLoadingUsuarios(true);
      try {
        const res = await fetch('http://localhost:8080/api/clientes.php');
        if (!res.ok) throw new Error('No se pudieron cargar los usuarios');
        const data: ApiCustomer[] = await res.json();
        // Tomar los últimos 5 usuarios agregados
        setNuevosUsuarios([...data].slice(-5).reverse());
      } catch (err: any) {
        setNuevosUsuarios([]);
      }
      setLoadingUsuarios(false);
    };
    fetchNuevosUsuarios();
  }, []);

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
          <button
            onClick={() => navigate('/sales/add')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150"
          >
            <Plus className="h-5 w-5 mr-1" />
            Registrar Venta
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric, index) => (
          <DashboardCard key={index} metric={metric} />
        ))}
      </div>

      {/* Alerta de bajo stock */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Alerta de Bajo Stock
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Tienes {lowStockProducts.length} productos con bajo inventario.
                  {' '}<a href="#low-stock" className="font-medium underline">Ver abajo</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de nuevos usuarios desde la API */}
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-[#4A55A2] mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Nuevos Usuarios</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loadingUsuarios ? (
                <div className="text-center py-10 text-gray-500">Cargando usuarios...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Celular
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nuevosUsuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{usuario.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{usuario.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{usuario.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{usuario.direccion}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{usuario.celular}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Ventas recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-[#4A55A2] mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Ventas Recientes</h2>
            </div>
            <button
              onClick={() => navigate('/sales')}
              className="text-sm text-[#4A55A2] hover:text-[#38467f] transition-colors duration-150"
            >
              Ver todas
            </button>
          </div>
          <SalesTable limit={5} />
        </div>
      </div>

      {/* Productos con bajo stock */}
      {lowStockProducts.length > 0 && (
        <div id="low-stock">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Productos con Bajo Stock</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lowStockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;