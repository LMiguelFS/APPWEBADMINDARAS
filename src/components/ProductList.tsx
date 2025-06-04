import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  detail: string | null;
  price: string;
  image_url: string | null;
  colors: { id: number; name: string }[];
  scents: { id: number; name: string }[];
  form?: { id: number; name: string };
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.darasglowcandle.site/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    await fetch(`https://api.darasglowcandle.site/api/products/${id}`, {
      method: 'DELETE',
    });
    setProducts(products => products.filter(p => p.id !== id));
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            imageUrl: product.image_url,
            description: product.detail,
            price: parseFloat(product.price),
            colors: product.colors,
            scents: product.scents,
            form: product.form,
          }}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;