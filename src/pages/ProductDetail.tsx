import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext'; // Using your provided ProductContext
import { Product } from '../types/product'; // Assuming you have a Product type

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts(); // Destructure getProductById from your context

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        setError('ID de producto no proporcionado.');
        return;
      }
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('No se pudo cargar el producto. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-gray-400 animate-pulse" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Cargando producto...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-red-900">Error: {error}</h3>
        <div className="mt-6">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#4A55A2] hover:bg-[#38467f]"
          >
            <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Producto no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#4A55A2] hover:bg-[#38467f]"
          >
            <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      {/* Navigation */}
      <nav className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Productos
        </button>
      </nav>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-[#4A55A2] mr-2" />
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          </div>
        </div>

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left column: Image */}
          <div className="md:col-span-1">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-64 rounded-lg bg-gray-200 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Right column: Details */}
          <div className="md:col-span-2">
            <div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <p className="text-sm font-medium text-gray-500">Precio</p>
                <p className="text-2xl font-bold text-gray-900">S/ {product.price}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.description || 'N/A'}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Producto</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {product.form?.name && (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Forma</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.form.name}</dd>
                      </div>
                    )}
                    {product.eventDetails?.name && (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Tipo de Evento</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.eventDetails.name}</dd>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Dimensiones</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.dimensions}</dd>
                      </div>
                    )}
                    {product.burnTime && (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Tiempo de Quemado</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.burnTime}</dd>
                      </div>
                    )}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-gray-500">Ingredientes</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="list-disc list-inside ml-4">
                            {product.ingredients.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                    {product.instructions && product.instructions.length > 0 && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-gray-500">Instrucciones</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="list-disc list-inside ml-4">
                            {product.instructions.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                    {product.colorDetails && product.colorDetails.length > 0 ? (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Colores</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {product.colorDetails.map(c => c.name).join(', ')}
                        </dd>
                      </div>
                    ) : (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Colores</dt>
                        <dd className="mt-1 text-sm text-gray-900">N/A</dd>
                      </div>
                    )}
                    {product.scentDetails && product.scentDetails.length > 0 ? (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Aromas</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {product.scentDetails.map(s => s.name).join(', ')}
                        </dd>
                      </div>
                    ) : (
                      <div className="sm:col-span-1">
                        <dt className="text-xs text-gray-500">Aromas</dt>
                        <dd className="mt-1 text-sm text-gray-900">N/A</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;