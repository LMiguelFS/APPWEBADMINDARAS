import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Product } from '../context/InventoryContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const isLowStock = product.stock <= 5;
  
  return (
    <div 
      className="relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {product.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          </div>
          {isLowStock && (
            <div className="bg-amber-100 p-1 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            <p className={`text-sm mt-1 ${isLowStock ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Stock: {product.stock} units
            </p>
          </div>
          <div 
            className="flex items-center text-[#4A55A2] hover:text-[#38467f] transition-colors duration-150"
          >
            <span className="text-sm font-medium mr-1">Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;