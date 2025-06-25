import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string | null;
    detail?: string | null;
    price: number | string;
    imageUrl?: string | null;
    colors?: { id: number; name: string }[];
    scents?: { id: number; name: string }[];
    form?: { id: number; name: string };
  };
  // onDelete?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
          <span className="font-bold">Sin imagen</span>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-[#4A55A2] mb-1">{product.name}</h2>
        <p className="text-xs text-gray-500 mb-2">{product.description || product.detail}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {product.colors && product.colors.length > 0 && (
            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
              <span className="font-semibold">Colores:</span> {product.colors.map(c => c.name).join(', ')}
            </span>
          )}
          {product.scents && product.scents.length > 0 && (
            <span className="inline-block bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded">
              <span className="font-semibold">Aromas:</span> {product.scents.map(s => s.name).join(', ')}
            </span>
          )}
          {product.form && (
            <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
              <span className="font-semibold">Forma:</span> {product.form.name}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between mt-auto">
          <span className="text-base font-bold text-gray-900">${product.price}</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100"
              title="Editar"
              onClick={() => navigate(`/products/edit/${product.id}`)}
            >
              <Pencil className="h-5 w-5 text-[#4A55A2]" />
            </button>
            {/* <button
              type="button"
              className="p-2 rounded hover:bg-red-100"
              title="Eliminar"
              onClick={() => onDelete && onDelete(product.id)}
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;