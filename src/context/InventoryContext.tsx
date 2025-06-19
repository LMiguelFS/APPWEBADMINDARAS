import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsApi, salesApi, customersApi } from '../services/api';
import toast from 'react-hot-toast';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'completed';
  lastPurchase?: Date;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  description: string;
  image?:string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  salePrice: number;
  date: Date;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface InventoryContextType {
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomer: (id: string) => Customer | undefined;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Promise<void>;
  lowStockProducts: Product[];
  topSellingProducts: Product[];
  dashboardMetrics: DashboardMetric[];
  isLoading: boolean;
  error: any;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Products queries
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery(
    'products',
    async () => {
      const response = await productsApi.getAll();
      return response.data;
    }
  );

  // Customers queries
  const { data: customers = [], isLoading: customersLoading, error: customersError } = useQuery(
    'customers',
    async () => {
      const response = await customersApi.getAll();
      return response.data;
    }
  );

  // Sales queries
  const { data: sales = [], isLoading: salesLoading, error: salesError } = useQuery(
    'sales',
    async () => {
      const response = await salesApi.getAll();
      return response.data;
    }
  );

  // Dashboard metrics query
  const { data: dashboardMetrics = [], isLoading: metricsLoading } = useQuery(
    'dashboardMetrics',
    async () => {
      const response = await salesApi.getDashboardMetrics();
      return response.data;
    }
  );

  // Mutations
  const addProductMutation = useMutation(
    async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await productsApi.create(product);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Producto agregado exitosamente');
      },
      onError: () => {
        toast.error('Error al agregar el producto');
      }
    }
  );

  const updateProductMutation = useMutation(
    async ({ id, product }: { id: string; product: Partial<Product> }) => {
      const response = await productsApi.update(id, product);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Producto actualizado exitosamente');
      },
      onError: () => {
        toast.error('Error al actualizar el producto');
      }
    }
  );

  const deleteProductMutation = useMutation(
    async (id: string) => {
      await productsApi.delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Producto eliminado exitosamente');
      },
      onError: () => {
        toast.error('Error al eliminar el producto');
      }
    }
  );

  const addCustomerMutation = useMutation(
    async (customer: Omit<Customer, 'id'>) => {
      const response = await customersApi.create(customer);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('customers');
        toast.success('Cliente agregado exitosamente');
      },
      onError: () => {
        toast.error('Error al agregar el cliente');
      }
    }
  );

  const updateCustomerMutation = useMutation(
    async ({ id, customer }: { id: string; customer: Partial<Customer> }) => {
      const response = await customersApi.update(id, customer);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('customers');
        toast.success('Cliente actualizado exitosamente');
      },
      onError: () => {
        toast.error('Error al actualizar el cliente');
      }
    }
  );

  const deleteCustomerMutation = useMutation(
    async (id: string) => {
      await customersApi.delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('customers');
        toast.success('Cliente eliminado exitosamente');
      },
      onError: () => {
        toast.error('Error al eliminar el cliente');
      }
    }
  );

  const addSaleMutation = useMutation(
    async (sale: Omit<Sale, 'id' | 'date'>) => {
      const response = await salesApi.create(sale);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sales', 'products', 'dashboardMetrics']);
        toast.success('Venta registrada exitosamente');
      },
      onError: () => {
        toast.error('Error al registrar la venta');
      }
    }
  );

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const topSellingProducts = products.slice(0, 5); // This will be handled by the API

  const isLoading = productsLoading || customersLoading || salesLoading || metricsLoading;
  const error = productsError || customersError || salesError;

  const value = {
    products,
    sales,
    customers,
    addProduct: addProductMutation.mutateAsync,
    updateProduct: (id: string, product: Partial<Product>) =>
      updateProductMutation.mutateAsync({ id, product }),
    deleteProduct: deleteProductMutation.mutateAsync,
    getProduct: (id: string) => products.find(p => p.id === id),
    addCustomer: addCustomerMutation.mutateAsync,
    updateCustomer: (id: string, customer: Partial<Customer>) =>
      updateCustomerMutation.mutateAsync({ id, customer }),
    deleteCustomer: deleteCustomerMutation.mutateAsync,
    getCustomer: (id: string) => customers.find(c => c.id === id),
    addSale: addSaleMutation.mutateAsync,
    lowStockProducts,
    topSellingProducts,
    dashboardMetrics,
    isLoading,
    error,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};