import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../context/ProductContext';


interface ProductListProps {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  colors: { id: number; name: string }[];
  scents: { id: number; name: string }[];
  form?: { id: number; name: string };
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductListProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { getProducts, colorOptions, scentOptions, formOptions } = useProducts();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!getProducts) return;

      setLoading(true);
      try {
        const rawProducts = await getProducts();

        const enrichedProducts: ProductListProps[] = rawProducts.map((product, index) => ({
          id: index + 1,
          name: product.name,
          description: product.description || null,
          price: product.price.toString(),
          imageUrl: product.imageUrl ?? null, // <- corrección aquí
          colors: product.colors?.map(id => {
            const match = colorOptions?.find(c => c.id === id);
            return match || { id, name: 'Desconocido' };
          }) || [],
          scents: product.scents?.map(id => {
            const match = scentOptions?.find(s => s.id === id);
            return match || { id, name: 'Desconocido' };
          }) || [],
          form: formOptions?.find(f => f.id === product.form_id),
        }));
        

        setProducts(enrichedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getProducts, colorOptions, scentOptions, formOptions]);

  const handleDelete = async (id: number) => {
    // lógica para eliminar un producto
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            imageUrl: product.imageUrl,
            description: product.description,
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
