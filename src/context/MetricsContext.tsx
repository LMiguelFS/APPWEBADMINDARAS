import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Metric } from '../types';
import { getMetrics } from '../services/metricsService';

// 1. Crear el tipo del contexto
interface MetricsContextType {
  metrics: Metric | null;
  loading: boolean;
  error: Error | null;
}

// 2. Crear el contexto
const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

// 3. Crear el provider
export const MetricsProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, loading, error }}>
      {children}
    </MetricsContext.Provider>
  );
};

// 4. Hook para usar el contexto fácilmente
export const useMetrics = (): MetricsContextType => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics debe usarse dentro de MetricsProvider');
  }
  return context;
};
