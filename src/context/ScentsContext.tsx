import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getScents, createScent, updateScent, deleteScent } from '../services/scentsService';
import { Forma } from '../types'; // Si tienes un tipo específico para Scents, cámbialo

interface ScentsContextType {
    scents: Forma[];
    loading: boolean;
    fetchScents: () => void;
    addScent: (name: string) => Promise<void>;
    editScent: (id: number, name: string) => Promise<void>;
    removeScent: (id: number) => Promise<void>;
}

const ScentsContext = createContext<ScentsContextType | undefined>(undefined);

export const ScentsProvider = ({ children }: { children: ReactNode }) => {
    const [scents, setScents] = useState<Forma[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchScents = async () => {
        setLoading(true);
        try {
            const data = await getScents();
            setScents(data);
        } catch {
            setScents([]);
        } finally {
            setLoading(false);
        }
    };

    const addScent = async (name: string) => {
        await createScent({ name });
        fetchScents();
    };

    const editScent = async (id: number, name: string) => {
        await updateScent(id, { name });
        fetchScents();
    };

    const removeScent = async (id: number) => {
        await deleteScent(id);
        fetchScents();
    };

    useEffect(() => {
        fetchScents();
    }, []);

    return (
        <ScentsContext.Provider value={{ scents, loading, fetchScents, addScent, editScent, removeScent }}>
            {children}
        </ScentsContext.Provider>
    );
};

export const useScentsContext = () => {
    const context = useContext(ScentsContext);
    if (!context) {
        throw new Error('useScentsContext must be used within a ScentsProvider');
    }
    return context;
};
