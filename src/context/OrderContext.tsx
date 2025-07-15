import React, { createContext, useContext, useState, useCallback } from 'react';
import { ordersApi } from '../services/orderService';
import { Order, PaginatedOrderResponse } from '../types/order';

interface OrderContextProps {
  orders: Order[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  fetchOrders: (page?: number) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextProps>({
  orders: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  fetchOrders: async () => {},
  getOrderById: async () => null,
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll(page);
      setOrders(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string): Promise<Order | null> => {
    try {
      const response = await ordersApi.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      return null;
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, currentPage, totalPages, fetchOrders, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};
