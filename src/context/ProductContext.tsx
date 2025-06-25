// src/context/ProductsContext.tsx
import React, { createContext, useContext } from 'react';
import { productsApi } from '../services/productService';
import { Product } from '../types/product';

type ProductContextType = {
  createProduct: (data: Product) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createProduct = async (data: Product) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    if (data.description) formData.append('description', data.description);
    if (data.dimensions) formData.append('dimensions', data.dimensions);
    if (data.image) formData.append('image', data.image);
    formData.append('form_id', data.form_id.toString());
    formData.append('event_id', data.event_id.toString());
    if (data.burnTime) formData.append('burnTime', data.burnTime);
    if (data.featured !== undefined) formData.append('featured', data.featured ? '1' : '0');

    data.ingredients?.forEach((item, index) => formData.append(`ingredients[${index}]`, item));
    data.instructions?.forEach((item, index) => formData.append(`instructions[${index}]`, item));
    data.colors?.forEach((id, index) => formData.append(`colors[${index}]`, id.toString()));
    data.scents?.forEach((id, index) => formData.append(`scents[${index}]`, id.toString()));

    await productsApi.create(formData);
  };

  return (
    <ProductContext.Provider value={{ createProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductsProvider');
  }
  return context;
};
