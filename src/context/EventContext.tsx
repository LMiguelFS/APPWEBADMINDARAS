import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { Forma } from '../types';

interface EventContextType {
    events: Forma[];
    loading: boolean;
    fetchEvents: () => void;
    addEvent: (name: string) => Promise<void>;
    editEvent: (id: number, name: string) => Promise<void>;
    removeEvent: (id: number) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Forma[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await getEvents();
            setEvents(data);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const addEvent = async (name: string) => {
        await createEvent({ name });
        fetchEvents();
    };

    const editEvent = async (id: number, name: string) => {
        await updateEvent(id, { name });
        fetchEvents();
    };

    const removeEvent = async (id: number) => {
        await deleteEvent(id);
        fetchEvents();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <EventContext.Provider value={{ events, loading, fetchEvents, addEvent, editEvent, removeEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext debe usarse dentro de un EventProvider');
    }
    return context;
};
