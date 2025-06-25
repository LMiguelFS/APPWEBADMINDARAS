import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Package, Grid3X3, List } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';
import ProductList from '../components/product/ProductList';
import {Product} from '../types/product';

const Products: React.FC = () => {
  const { getProducts } = useProducts();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [getProducts]);

  const categories = ['all', ...new Set(products.map((p: any) => p.category))];

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-500">Administra tu inventario de productos</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {[
            { label: 'producto', route: '/products/add' },
            { label: 'forma', route: '/formas/add' },
            { label: 'color', route: '/color/add' },
            { label: 'Aroma', route: '/aromas/add' },
            { label: 'Tipo Evento', route: '/evento/add' },
          ].map(({ label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f] transition-colors duration-150"
            >
              <Plus className="h-5 w-5 mr-1" />
              Añadir {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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

        {/* Categoría */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
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

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-12">Cargando productos...</div>
      )}

      {/* Sin productos */}
      {!loading && filteredProducts.length === 0 && (
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

      {/* Grid */}
      {!loading && viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                imageUrl: product.image,
                description: product.description,
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
              }}
            />
          ))}
        </div>
      )}

      {/* Lista */}
      {!loading && viewMode === 'list' && filteredProducts.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ver</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {product.image ? (
                        <img
                          src={product.image}
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
                  <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={`/products/${product.id}`} className="text-[#4A55A2] hover:text-[#38467f]">Ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductList />
    </div>
  );
};

export default Products;
