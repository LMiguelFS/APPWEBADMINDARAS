// src/components/product/ProductList.tsx
import React from 'react';
import ProductCard from './ProductCard'; // Asegúrate que la ruta sea correcta
import { Product } from '../../types/product'; // Importamos el tipo Product

interface ProductListProps {
  products: Product[]; // Recibe los productos ya enriquecidos y filtrados
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 py-6">No hay productos para mostrar en esta vista.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product} // Pasa el producto tal cual lo recibe
        />
      ))}
    </div>
  );
};

export default ProductList;
