export interface Product {
  name: string;
  price: number;
  description?: string;
  dimensions?: string;
  image?: File | null;
  form_id: number;
  event_id: number;
  burnTime?: string;
  status?: boolean;
  featured?: boolean;
  ingredients?: string[]; // Puedes cambiar a otro tipo si es más complejo
  instructions?: string[];
  colors?: number[]; // IDs de colores
  scents?: number[]; // IDs de aromas
}