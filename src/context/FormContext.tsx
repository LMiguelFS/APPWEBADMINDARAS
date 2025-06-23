import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFormas, createForma, updateForma, deleteForma } from '../services/formService';
import { Forma } from '../types';

interface FormContextType {
    formas: Forma[];
    loading: boolean;
    fetchFormas: () => void;
    addForma: (name: string) => Promise<void>;
    editForma: (id: number, name: string) => Promise<void>;
    removeForma: (id: number) => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [formas, setFormas] = useState<Forma[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFormas = async () => {
        setLoading(true);
        try {
            const data = await getFormas();
            setFormas(data);
        } catch {
            setFormas([]);
        } finally {
            setLoading(false);
        }
    };

    const addForma = async (name: string) => {
        await createForma({ name });
        fetchFormas();
    };

    const editForma = async (id: number, name: string) => {
        await updateForma(id, { name });
        fetchFormas();
    };

    const removeForma = async (id: number) => {
        await deleteForma(id);
        fetchFormas();
    };

    useEffect(() => {
        fetchFormas();
    }, []);

    return (
        <FormContext.Provider value={{ formas, loading, fetchFormas, addForma, editForma, removeForma }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};
