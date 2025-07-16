import React, { createContext, useContext, useState, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { Client } from '../types/client';

interface ClientContextProps {
  clients: Client[];
  loading: boolean;
  fetchClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextProps>({
  clients: [],
  loading: false,
  fetchClients: async () => {},
});

export const useClients = () => useContext(ClientContext);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getClientsList();
      setClients(data);
    } catch {
      setClients([]);
    }
    setLoading(false);
  }, []);

  return (
    <ClientContext.Provider value={{ clients, loading, fetchClients }}>
      {children}
    </ClientContext.Provider>
  );
};