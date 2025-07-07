// export interface Product {
//   name: string;
//   price: number;
//   description?: string;
//   dimensions?: string;
//   image?: File | null;
//   imageUrl?: string | null;
//   form_id: number;
//   event_id: number;
//   burnTime?: string;
//   status?: boolean;
//   featured?: boolean;
//   ingredients?: string[]; // Puedes cambiar a otro tipo si es más complejo
//   instructions?: string[];
//   colors?: number[]; // IDs de colores
//   scents?: number[]; // IDs de aromas
// }
export interface Product {
  id: number; // Asegúrate de que tus productos siempre tengan un ID
  name: string;
  price: number;
  description?: string | null; // Hago opcional y nullable para flexibilidad
  dimensions?: string | null;
  image?: File | null; // Para la subida, si es necesario
  imageUrl?: string | null; // Para la URL de la imagen existente
  form_id: number;
  event_id: number;
  burnTime?: string | null;
  status?: boolean; // Asumo que `status` indica si está activo/inactivo
  featured?: boolean;
  ingredients?: string[];
  instructions?: string[];
  colors?: number[]; // IDs de colores asociados
  scents?: number[]; // IDs de aromas asociados

  // Propiedades que se "enriquecen" después de obtener los datos brutos
  // Esto es para mostrar nombres en lugar de solo IDs
  form?: { id: number; name: string };
  colorDetails?: { id: number; name: string }[];
  scentDetails?: { id: number; name: string }[];
  eventDetails?: { id: number; name: string }; // Detalles del evento
}
// Tipo de datos para el formulario de edición (lo que maneja el frontend)
export interface EditProductFormData {
  name: string;
  description: string;
  price: number;
  form_id: number;
  colors: number[];
  scents: number[];
  dimensions: string;
  imageUrl: string | null; // URL de la imagen actual
  image: File | null; // <-- Para la nueva imagen a subir
  event_id: number;
  burnTime: string;
  featured: boolean;
  status: boolean; // <-- Estado del producto
  ingredients: string[];
  instructions: string[];
}

// Nueva interfaz para los datos del formulario de creación/edición de productos
export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  dimensions: string;
  image: File | null;
  form_id: number;
  event_id: number;
  burnTime: string;
  featured: boolean;
  ingredients: string[];
  instructions: string[];
  colors: number[];
  scents: number[];
}
// Para las opciones de filtros (formas, colores, aromas, eventos)
export interface Option {
  id: number;
  name: string;
}