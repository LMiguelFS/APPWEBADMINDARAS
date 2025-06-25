// ProductContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { productsApi } from '../services/productService';
import { Product } from '../types/product';

type Reference = { id: number; name: string };

type ProductContextType = {
  createProduct: (data: Product) => Promise<void>;
  getProducts: () => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  colorOptions: Reference[];
  scentOptions: Reference[];
  formOptions: Reference[];
  eventOptions: Reference[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorOptions, setColorOptions] = useState<Reference[]>([]);
  const [scentOptions, setScentOptions] = useState<Reference[]>([]);
  const [formOptions, setFormOptions] = useState<Reference[]>([]);
  const [eventOptions, setEventOptions] = useState<Reference[]>([]);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [colorsRes, scentsRes, formsRes,eventRes] = await Promise.all([
          productsApi.getColors(),
          productsApi.getScents(),
          productsApi.getForms(),
          productsApi.getEvents(),
        ]);
        setColorOptions(colorsRes.data);
        setScentOptions(scentsRes.data);
        setFormOptions(formsRes.data);
        setEventOptions(eventRes.data)
      } catch (error) {
        console.error('Error loading reference data', error);
      }
    };

    fetchReferences();
  }, []);

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

  const getProducts = async () => {
    const response = await productsApi.getAll();
    return response.data;
  };

  const getProductById = async (id: string) => {
    const response = await productsApi.getById(id);
    return response.data;
  };

  const updateProduct = async (id: string, data: any) => {
    await productsApi.update(id, data);
  };

  const deleteProduct = async (id: string) => {
    await productsApi.delete(id);
  };

  return (
    <ProductContext.Provider
      value={{
        createProduct,
        getProducts,
        getProductById,
        updateProduct,
        deleteProduct,
        colorOptions,
        scentOptions,
        formOptions,
        eventOptions,
      }}
    >
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
