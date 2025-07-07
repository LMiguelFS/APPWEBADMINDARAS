// src/pages/Products.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Package, Grid3X3, List } from 'lucide-react'; // Eliminado Filter ya que tendremos varios
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types/product';

const Products: React.FC = () => {
  const { getProducts, formOptions, colorOptions, scentOptions, eventOptions } = useProducts();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [optionsLoaded, setOptionsLoaded] = useState(false); // Nuevo estado para controlar la carga de opciones

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Estados para los filtros por ID
  const [selectedFormId, setSelectedFormId] = useState<number | 'all'>('all');
  const [selectedColorId, setSelectedColorId] = useState<number | 'all'>('all');
  const [selectedScentId, setSelectedScentId] = useState<number | 'all'>('all');
  const [selectedEventId, setSelectedEventId] = useState<number | 'all'>('all');

  // Carga inicial de productos y opciones
  useEffect(() => {
    // Verificar si todas las opciones del contexto están cargadas
    if (
      formOptions.length > 0 &&
      colorOptions.length > 0 &&
      scentOptions.length > 0 &&
      eventOptions.length > 0 &&
      !optionsLoaded // Solo si aún no se han cargado las opciones y productos
    ) {
      setOptionsLoaded(true); // Marcar que las opciones ya están disponibles
      const fetchAllProducts = async () => {
        try {
          setLoading(true);
          const data = await getProducts();

          // Enriquecer los productos con detalles para mostrar y filtrar
          const enrichedData: Product[] = data.map((product: any) => {
            const form = formOptions.find(f => f.id === product.form_id);
            const event = eventOptions.find(e => e.id === product.event_id);

            return {
              ...product,
              id: product.id, // Asegurarse de que el ID esté presente
              price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
              imageUrl: product.imageUrl || null,
              form: form, // Objeto completo de forma
              eventDetails: event, // Objeto completo de evento
              colorDetails: product.colors || [],
              scentDetails: product.scents || [],
            };
          });
          setProducts(enrichedData);
        } catch (err) {
          console.error('Error fetching products:', err);
          // TODO: Mostrar un mensaje de error al usuario
        } finally {
          setLoading(false);
        }
      };

      fetchAllProducts();
    }
  }, [getProducts, formOptions, colorOptions, scentOptions, eventOptions, optionsLoaded]);

  // Filtrar productos basado en el término de búsqueda y filtros seleccionados
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtrar por término de búsqueda (nombre o descripción)
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrar por forma
      const matchesForm = selectedFormId === 'all' || product.form_id === selectedFormId;

      // Filtrar por color (si el producto tiene AL MENOS el color seleccionado)
      const matchesColor =
        selectedColorId === 'all' ||
        (product.colors && product.colors.includes(selectedColorId));

      // Filtrar por aroma (si el producto tiene AL MENOS el aroma seleccionado)
      const matchesScent =
        selectedScentId === 'all' ||
        (product.scents && product.scents.includes(selectedScentId));

      // Filtrar por tipo de evento
      const matchesEvent = selectedEventId === 'all' || product.event_id === selectedEventId;

      return matchesSearch && matchesForm && matchesColor && matchesScent && matchesEvent;
    });
  }, [products, searchTerm, selectedFormId, selectedColorId, selectedScentId, selectedEventId]);

  return (
    <div className="space-y-6">
      {/* Encabezado y botones de añadir */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-500">Administra tu inventario de productos</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {[
            { label: 'producto', route: '/products/add' },
            { label: 'forma', route: '/formas/add' },
            { label: 'color', route: '/colors/add' },
            { label: 'Aroma', route: '/scents/add' },
            { label: 'Tipo Evento', route: '/events/add' },
          ].map(({ label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f] transition-colors duration-150 text-sm"
            >
              <Plus className="h-5 w-5 mr-1" />
              Añadir {label}
            </button>
          ))}
        </div>
      </div>

      {/* Controles de filtro y vista */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-wrap"> {/* Added flex-wrap here too */}
        {/* Buscar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro por Forma */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(Number(e.target.value) || 'all')}
          >
            <option value="all">Todas las Formas</option>
            {formOptions.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Color */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            value={selectedColorId}
            onChange={(e) => setSelectedColorId(Number(e.target.value) || 'all')}
          >
            <option value="all">Todos los Colores</option>
            {colorOptions.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Aroma */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            value={selectedScentId}
            onChange={(e) => setSelectedScentId(Number(e.target.value) || 'all')}
          >
            <option value="all">Todos los Aromas</option>
            {scentOptions.map((scent) => (
              <option key={scent.id} value={scent.id}>
                {scent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo de Evento */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(Number(e.target.value) || 'all')}
          >
            <option value="all">Todos los Eventos</option>
            {eventOptions.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vista grid/list */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`inline-flex items-center px-3 py-2 rounded-l-md border text-sm ${viewMode === 'grid'
              ? 'bg-[#4A55A2] text-white border-[#4A55A2]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`inline-flex items-center px-3 py-2 rounded-r-md border text-sm ${viewMode === 'list'
              ? 'bg-[#4A55A2] text-white border-[#4A55A2]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Indicador de carga */}
      {loading || !optionsLoaded ? ( // Muestra "Cargando" si las opciones o los productos están cargando
        <div className="text-center text-gray-500 py-12">Cargando productos...</div>
      ) : (
        <>
          {/* Mensaje de no productos encontrados */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <Package className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta ajustar tu búsqueda o filtro.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/products/add')}
                  className="inline-flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f]"
                >
                  <Plus className="h-5 w-5 mr-2" /> Añadir producto
                </button>
              </div>
            </div>
          )}

          {/* Renderizado de productos en modo Grid o List */}
          {filteredProducts.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product} // Pasa el producto enriquecido
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forma</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.form?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          S/ {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {product.eventDetails?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Evita que se dispare el navigate del <tr>
                              navigate(`/products/edit/${product.id}`);
                            }}
                            className="text-[#4A55A2] hover:text-[#38467f] text-sm"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Products;