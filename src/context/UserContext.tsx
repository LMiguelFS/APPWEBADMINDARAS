import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { customersApi } from '../services/userService';
import { User } from '../types/user';
import toast from 'react-hot-toast';

interface UsersContextType {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await customersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await customersApi.getById(id);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error('Error al obtener el usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    setLoading(true);
    try {
      await customersApi.update(id, data);
      toast.success('Usuario actualizado correctamente');
      await fetchUsers(); // Refresh list
    } catch (error) {
      toast.error('Error al actualizar el usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await customersApi.delete(id);
      toast.success('Usuario desactivado correctamente');
      await fetchUsers(); // Refresh list
    } catch (error) {
      toast.error('Error al desactivar el usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  return (
    <UsersContext.Provider
      value={{
        users,
        selectedUser,
        loading,
        fetchUsers,
        getUserById,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers debe usarse dentro de un UsersProvider');
  }
  return context;
};
