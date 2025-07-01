// src/hooks/useReferenceCRUD.ts
import { useState, useCallback } from 'react';

// Define el tipo para las operaciones CRUD genéricas
// NOTA CLAVE: Las funciones 'add' y 'edit' ahora esperan solo 'name: string'
interface CRUDOperations<T> {
  add: (name: string) => Promise<T>; // Espera un string para el nombre
  edit: (id: number, name: string) => Promise<T>; // Espera un string para el nombre
  remove: (id: number) => Promise<void>;
}

// Define el tipo de dato que el hook devuelve
interface UseReferenceCRUDResult<T extends { id: number; name: string }> {
  items: T[]; // La lista de elementos (aromas, colores, etc.)
  name: string; // El estado del input para el nombre
  setName: (name: string) => void; // Función para actualizar el nombre
  error: string; // Mensaje de error
  success: string; // Mensaje de éxito
  editingId: number | null; // ID del elemento que se está editando
  handleSubmit: (e: React.FormEvent) => Promise<void>; // Manejador de envío del formulario
  handleEdit: (id: number) => void; // Manejador para iniciar la edición
  handleDelete: (id: number) => Promise<void>; // Manejador para eliminar
  handleCancelEdit: () => void; // Manejador para cancelar la edición
}

/**
 * Hook personalizado para gestionar operaciones CRUD de referencias (aromas, colores, formas, eventos).
 *
 * @param {Object} options - Opciones de configuración para el hook.
 * @param {Array<T>} options.initialItems - La lista inicial de elementos.
 * @param {CRUDOperations<T>} options.apiHandlers - Objeto con las funciones de la API para agregar, editar y eliminar.
 * @returns {UseReferenceCRUDResult<T>} Un objeto con estados y funciones para la gestión CRUD.
 */
export const useReferenceCRUD = <T extends { id: number; name: string }>(
  initialItems: T[],
  apiHandlers: CRUDOperations<T>
): UseReferenceCRUDResult<T> => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const items = initialItems; // Se utiliza initialItems directamente como el estado de los ítems

  // Maneja el envío del formulario (agregar o editar)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    try {
      if (editingId) {
        // Llama a la función de edición de la API, pasando el 'name' como string
        await apiHandlers.edit(editingId, name);
        setSuccess('¡Elemento actualizado!');
      } else {
        // Llama a la función de agregar de la API, pasando el 'name' como string
        await apiHandlers.add(name);
        setSuccess('¡Elemento agregado!');
      }
      setName(''); // Limpia el input
      setEditingId(null); // Resetea el modo edición
      setTimeout(() => setSuccess(''), 1500); // Oculta el mensaje de éxito
    } catch (err) {
      console.error("Error al guardar:", err);
      setError('Error al guardar el elemento.');
    }
  }, [name, editingId, apiHandlers]);

  // Maneja el inicio de la edición de un elemento
  const handleEdit = useCallback((id: number) => {
    const item = items.find(s => s.id === id);
    if (item) {
      setName(item.name); // Carga el nombre en el input
      setEditingId(id); // Establece el ID del elemento a editar
      setError('');
      setSuccess('');
    }
  }, [items]);

  // Maneja la eliminación de un elemento
  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    try {
      await apiHandlers.remove(id); // Llama a la función de eliminación de la API
      setSuccess('Elemento eliminado.');
      setTimeout(() => setSuccess(''), 1500); // Oculta el mensaje de éxito
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError('Error al eliminar el elemento.');
    }
  }, [apiHandlers]);

  // Maneja la cancelación de la edición
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setName('');
    setError('');
    setSuccess('');
  }, []);

  return {
    items,
    name,
    setName,
    error,
    success,
    editingId,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
  };
};