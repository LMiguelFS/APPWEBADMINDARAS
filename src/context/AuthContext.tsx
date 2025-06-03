import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);

  const login = async (username: string, password: string) => {
    try {
      // For demo purposes, implement a mock login
      if (username === 'admin' && password === 'admin') {
        const mockToken = 'mock-jwt-token';
        const mockUser = {
          id: '1',
          username: 'admin',
          name: 'Admin User',
          email: 'admin@example.com'
        };
        
        localStorage.setItem('token', mockToken);
        setIsAuthenticated(true);
        setUser(mockUser);
        return true;
      }
      
      toast.error('Credenciales inválidas. Use admin/admin para iniciar sesión.');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Intente nuevamente.');
      return false;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};