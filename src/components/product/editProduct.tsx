// src/pages/EditProduct.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product, EditProductFormData } from '../../types/product'; 

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getProductById,
    updateProduct,
    formOptions,
    colorOptions,
    scentOptions,
    eventOptions,
  } = useProducts();

  const [formData, setFormData] = useState<EditProductFormData>({
    name: '',
    description: '',
    price: 0,
    form_id: 0,
    colors: [],
    scents: [],
    dimensions: '',
    imageUrl: null, // <-- URL de la imagen actual del producto
    image: null, // <-- Para la nueva imagen seleccionada (File)
    event_id: 0,
    burnTime: '',
    featured: false,
    status: true, // <-- Inicializar como activo por defecto o según la lógica
    ingredients: [''],
    instructions: [''],
  });
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null); // Para la vista previa de la nueva imagen

  useEffect(() => {
    if (id && formOptions.length > 0 && colorOptions.length > 0 && scentOptions.length > 0 && eventOptions.length > 0) {
      const fetchProduct = async () => {
        setLoadingProduct(true);
        try {
          const data: Product = await getProductById(id);
          if (data) {
            setFormData({
              name: data.name || '',
              description: data.description || '',
              price: data.price || 0,
              form_id: data.form_id || 0,
              colors: data.colors?.map(Number) || [],
              scents: data.scents?.map(Number) || [],
              dimensions: data.dimensions || '',
              imageUrl: data.imageUrl || null, // Cargar la URL existente
              image: null, // No hay archivo al cargar
              event_id: data.event_id || 0,
              burnTime: data.burnTime || '',
              featured: data.featured || false,
              status: data.status !== undefined ? data.status : true, // Cargar el estado
              ingredients: data.ingredients && data.ingredients.length > 0 ? data.ingredients : [''],
              instructions: data.instructions && data.instructions.length > 0 ? data.instructions : [''],
            });
            setNewImagePreview(data.imageUrl || null); // Mostrar la imagen actual como preview inicial
          } else {
            setError('Producto no encontrado.');
          }
        } catch (err) {
          console.error('Error fetching product for edit:', err);
          setError('Error al cargar el producto.');
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    } else if (!id) {
      setError('ID de producto no proporcionado.');
      setLoadingProduct(false);
    }
  }, [id, getProductById, formOptions, colorOptions, scentOptions, eventOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
    setError('');
    setSuccess('');
  };

  // Manejar selección de archivo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setNewImagePreview(URL.createObjectURL(file)); // Crear URL para vista previa
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setNewImagePreview(formData.imageUrl || null); // Volver a la URL original si no hay nueva imagen
    }
    setError('');
    setSuccess('');
  };

  const handleOptionChange = (type: 'colors' | 'scents', optionId: number, isChecked: boolean) => {
    setFormData(prev => {
      const currentOptions = prev[type];
      const newOptions = isChecked
        ? [...currentOptions, optionId]
        : currentOptions.filter(i => i !== optionId);
      return { ...prev, [type]: newOptions };
    });
    setError('');
    setSuccess('');
  };

  const handleArrayChange = (
    name: 'ingredients' | 'instructions',
    idx: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const addArrayItem = (name: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [name]: [...prev[name], ''],
    }));
  };

  const removeArrayItem = (name: 'ingredients' | 'instructions', idx: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!id) {
      setError('ID de producto inválido para actualizar.');
      return;
    }

    try {
      const dataToSubmit = new FormData();

      // Booleanos: Mantén '1' : '0' si eso funcionó antes.
      dataToSubmit.append('status', formData.status ? '1' : '0');
      dataToSubmit.append('featured', formData.featured ? '1' : '0');

      // Campos de texto y números (convertir números a string para FormData)
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('description', formData.description);
      dataToSubmit.append('price', String(formData.price));
      dataToSubmit.append('form_id', String(formData.form_id));
      dataToSubmit.append('event_id', String(formData.event_id));
      dataToSubmit.append('dimensions', formData.dimensions);
      dataToSubmit.append('burnTime', formData.burnTime);

      // **Manejo de arrays (colors, scents, ingredients, instructions)
      // Colores
      const validColors = formData.colors.filter(id => id > 0); // Filtra cualquier 0 o valor no válido
      validColors.forEach(colorId => {
          dataToSubmit.append('colors[]', String(colorId));
      });
      // Si no hay colores válidos seleccionados y necesitas enviar un array vacío:
      if (validColors.length === 0) {
          dataToSubmit.append('colors', '');
      }


      // Aromas
      const validScents = formData.scents.filter(id => id > 0); // Filtra cualquier 0 o valor no válido
      validScents.forEach(scentId => {
          dataToSubmit.append('scents[]', String(scentId));
      });
      if (validScents.length === 0) {
          dataToSubmit.append('scents', ''); // Idem
      }


      // Ingredientes
      // Aquí también puedes filtrar elementos vacíos si no quieres enviar strings vacíos
      const cleanedIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
      cleanedIngredients.forEach(ing => {
          dataToSubmit.append('ingredients[]', ing);
      });
      if (cleanedIngredients.length === 0) {
          dataToSubmit.append('ingredients', '');
      }


      // Instrucciones
      const cleanedInstructions = formData.instructions.filter(inst => inst.trim() !== '');
      cleanedInstructions.forEach(inst => {
          dataToSubmit.append('instructions[]', inst);
      });
      if (cleanedInstructions.length === 0) {
          dataToSubmit.append('instructions', '');
      }


      // Añadir la nueva imagen si existe
      if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }
      // No necesitamos `imageUrl` aquí, ya que el backend lo maneja si se sube una nueva imagen
      // o mantiene la anterior si no se sube ninguna nueva.

      // Depuración (comentar en producción)
      for (let [key, value] of dataToSubmit.entries()) {
          console.log(`${key}:`, value);
      }

      await updateProduct(id, dataToSubmit); // Pasar el FormData
      setSuccess('¡Producto actualizado exitosamente!');
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      // Asume que el error ya viene parseado del contexto o lo parseas aquí
      const apiError = (err as any)?.response?.data;
      const errorMessage = apiError?.message || 'Error al actualizar el producto. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
      // Si quieres mostrar errores específicos de validación de Laravel:
      // if (apiError?.errors) {
      //     console.log('Errores de validación del backend:', apiError.errors);
      //     // Puedes iterar sobre apiError.errors y mostrar cada error
      // }
    }
  };

  if (loadingProduct) {
    return <div className="max-w-lg mx-auto bg-white rounded-lg border border-gray-200 mt-8 p-6 text-center text-gray-500">Cargando datos del producto...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg border border-gray-200 mt-8 p-6">
      <nav className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a productos
        </button>
      </nav>
      <h1 className="text-xl font-bold mb-4 text-[#4A55A2]">Editar producto</h1>
      {success && <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
      {error && <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            required
          />
        </div>
        {/* Campo de Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            rows={3}
          />
        </div>
        {/* Campo de Precio */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            required
            min="0"
            step="0.01"
          />
        </div>
        {/* Selector de Forma */}
        <div>
          <label htmlFor="form_id" className="block text-sm font-medium text-gray-700">Forma</label>
          <select
            id="form_id"
            name="form_id"
            value={formData.form_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            required
          >
            <option value={0}>Selecciona una forma</option>
            {formOptions.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        {/* Checkboxes de Colores */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Colores</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {colorOptions.map(c => (
              <label key={c.id} className="flex items-center gap-1 text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={formData.colors.includes(Number(c.id))}
                  onChange={e => handleOptionChange('colors', Number(c.id), e.target.checked)}
                  className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        {/* Checkboxes de Aromas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Aromas</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {scentOptions.map(a => (
              <label key={a.id} className="flex items-center gap-1 text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={formData.scents.includes(Number(a.id))}
                  onChange={e => handleOptionChange('scents', Number(a.id), e.target.checked)}
                  className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
        {/* Campo de Dimensiones */}
        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensiones</label>
          <input
            type="text"
            id="dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
          />
        </div>

        {/* Sección de Imagen */}
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del producto
          </label>
          <div className="flex items-center space-x-4">
            {(newImagePreview || formData.imageUrl) && (
              <div className="flex-shrink-0">
                <img
                  src={newImagePreview || formData.imageUrl || ''}
                  alt="Vista previa del producto"
                  className="h-24 w-24 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
            <div className="flex-grow">
              <input
                type="file"
                id="image-upload"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // Ocultar el input de archivo por defecto
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <UploadCloud className="h-5 w-5 mr-2" />
                {newImagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </label>
              {formData.image && <p className="mt-1 text-xs text-gray-500">{formData.image.name}</p>}
            </div>
          </div>
        </div>


        {/* Selector de Evento */}
        <div>
          <label htmlFor="event_id" className="block text-sm font-medium text-gray-700">Evento</label>
          <select
            id="event_id"
            name="event_id"
            value={formData.event_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            required
          >
            <option value={0}>Selecciona un evento</option>
            {eventOptions.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        </div>
        {/* Campo de Tiempo de quemado */}
        <div>
          <label htmlFor="burnTime" className="block text-sm font-medium text-gray-700">Tiempo de quemado</label>
          <input
            type="text"
            id="burnTime"
            name="burnTime"
            value={formData.burnTime}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:border-[#4A55A2] focus:ring-[#4A55A2] sm:text-sm"
            placeholder="Ej: 40-50 horas"
          />
        </div>
        {/* Checkbox Destacado */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Destacado</label>
        </div>

        {/* Toggle de Estado (Activo/Inactivo) */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Estado del producto:</span>
          <label htmlFor="status-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="status-toggle"
                name="status"
                className="sr-only"
                checked={formData.status}
                onChange={handleChange}
              />
              <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                  formData.status ? 'translate-x-full bg-[#4A55A2]' : ''
                }`}
              ></div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-900">
              {formData.status ? 'Activo' : 'Inactivo'}
            </div>
          </label>
        </div>


        {/* Ingredientes dinámicos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
          {formData.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={ing}
                onChange={e => handleArrayChange('ingredients', idx, e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:border-[#4A55A2] focus:ring-[#4A55A2]"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('ingredients', idx)}
                  className="text-red-500 hover:text-red-700 text-2xl font-bold leading-none"
                  title="Eliminar ingrediente"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('ingredients')}
            className="text-blue-500 hover:text-blue-700 mt-1 text-sm font-semibold"
          >
            + Agregar ingrediente
          </button>
        </div>

        {/* Instrucciones dinámicas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones</label>
          {formData.instructions.map((ins, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={ins}
                onChange={e => handleArrayChange('instructions', idx, e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:border-[#4A55A2] focus:ring-[#4A55A2]"
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('instructions', idx)}
                  className="text-red-500 hover:text-red-700 text-2xl font-bold leading-none"
                  title="Eliminar instrucción"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('instructions')}
            className="text-blue-500 hover:text-blue-700 mt-1 text-sm font-semibold"
          >
            + Agregar instrucción
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-[#4A55A2] text-white py-2 px-4 rounded-md hover:bg-[#3b4780] transition duration-150 ease-in-out font-semibold"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditProduct;