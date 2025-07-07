export interface Client {
    id: number;
    name: string;
    last_name: string;
    email: string;
    dni: string | null;
    city: string | null;
    district: string | null;
    phone: string | null;
    status: number;
    created_at?: string;
    updated_at?: string;
}