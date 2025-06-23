import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getColors, createColors, updateColors, deleteColors } from '../services/colorService';
import { Forma } from '../types'; 

interface ColorContextType {
  colors: Forma[];
  loading: boolean;
  fetchColors: () => void;
  addColor: (name: string) => Promise<void>;
  editColor: (id: number, name: string) => Promise<void>;
  removeColor: (id: number) => Promise<void>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [colors, setColors] = useState<Forma[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const data = await getColors();
      setColors(data);
    } catch {
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  const addColor = async (name: string) => {
    await createColors({ name });
    fetchColors();
  };

  const editColor = async (id: number, name: string) => {
    await updateColors(id, { name });
    fetchColors();
  };

  const removeColor = async (id: number) => {
    await deleteColors(id);
    fetchColors();
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <ColorContext.Provider value={{ colors, loading, fetchColors, addColor, editColor, removeColor }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};
