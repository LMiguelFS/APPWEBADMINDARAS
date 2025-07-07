// ProductContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { productsApi } from '../services/productService';
import { Product,ProductFormData } from '../types/product';
import { Color, Scent, Forma, Event } from '../types';

type Reference = { id: number; name: string };

type ProductContextType = {
  createProduct: (data: ProductFormData) => Promise<void>;
  getProducts: () => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  colorOptions: Reference[];
  scentOptions: Reference[];
  formOptions: Reference[];
  eventOptions: Reference[];

  createColor: (data: { name: string }) => Promise<Color>;
  updateColor: (id: number, data: { name: string }) => Promise<Color>;
  deleteColor: (id: number) => Promise<void>;

  createScent: (data: { name: string }) => Promise<Scent>;
  updateScent: (id: number, data: { name: string }) => Promise<Scent>;
  deleteScent: (id: number) => Promise<void>;

  createForm: (data: { name: string }) => Promise<Forma>;
  updateForm: (id: number, data: { name: string }) => Promise<Forma>;
  deleteForm: (id: number) => Promise<void>;

  createEvent: (data: { name: string }) => Promise<Event>;
  updateEvent: (id: number, data: { name: string }) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorOptions, setColorOptions] = useState<Reference[]>([]);
  const [scentOptions, setScentOptions] = useState<Reference[]>([]);
  const [formOptions, setFormOptions] = useState<Reference[]>([]);
  const [eventOptions, setEventOptions] = useState<Reference[]>([]);

  const fetchReferences = useCallback(async () => {
    try {
      const [colorsRes, scentsRes, formsRes, eventRes] = await Promise.all([
        productsApi.getColors(),
        productsApi.getScents(),
        productsApi.getForms(),
        productsApi.getEvents(),
      ]);
      setColorOptions(colorsRes.data);
      setScentOptions(scentsRes.data);
      setFormOptions(formsRes.data);
      setEventOptions(eventRes.data);
    } catch (error) {
      console.error('Error al cargar datos de referencia:', error);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  // --- Operaciones de Productos (sin cambios) ---
  const createProduct = async (data: ProductFormData) => {
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

  // --- Operaciones CRUD para Colores ---
  const createColor = async (data: { name: string }) => {
    const res = await productsApi.createColor(data);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
    return res.data;
  };

  const updateColor = async (id: number, data: { name: string }) => {
    const res = await productsApi.updateColor(id, data);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
    return res.data;
  };

  const deleteColor = async (id: number) => {
    await productsApi.deleteColor(id);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
  };

  // --- Operaciones CRUD para Aromas (Scents) ---
  const createScent = async (data: { name: string }) => {
    const res = await productsApi.createScent(data);
    await fetchReferences();
    return res.data;
  };

  const updateScent = async (id: number, data: { name: string }) => {
    const res = await productsApi.updateScent(id, data);
    await fetchReferences();
    return res.data;
  };

  const deleteScent = async (id: number) => {
    await productsApi.deleteScent(id);
    await fetchReferences();
  };

   // --- Operaciones CRUD para Formas ---
  const createForm = async (data: { name: string }) => {
    const res = await productsApi.createForm(data);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
    return res.data;
  };

  const updateForm = async (id: number, data: { name: string }) => {
    const res = await productsApi.updateForm(id, data);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
    return res.data;
  };

  const deleteForm = async (id: number) => {
    await productsApi.deleteForm(id);
    await fetchReferences(); // ¡Importante: refrescar las opciones!
  };

  // --- Operaciones CRUD para Eventos ---
  const createEvent = async (data: { name: string }) => {
    const res = await productsApi.createEvent(data);
    await fetchReferences();
    return res.data;
  };

  const updateEvent = async (id: number, data: { name: string }) => {
    const res = await productsApi.updateEvent(id, data);
    await fetchReferences();
    return res.data;
  };

  const deleteEvent = async (id: number) => {
    await productsApi.deleteEvent(id);
    await fetchReferences();
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
        createColor,
        updateColor,
        deleteColor,
        createScent,
        updateScent,
        deleteScent,
        createForm,
        updateForm,
        deleteForm,
        createEvent,
        updateEvent,
        deleteEvent,
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