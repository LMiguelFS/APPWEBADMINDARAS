// AddProduct.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductFormData } from '../types/product';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, formOptions, colorOptions, scentOptions, eventOptions } = useProducts();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    dimensions: '',
    image: null,
    form_id: 0,
    event_id: 0,
    burnTime: '',
    featured: false,
    ingredients: [''],
    instructions: [''],
    colors: [],
    scents: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.image) newErrors.image = 'La imagen es obligatoria';
    if (formData.form_id === 0) newErrors.form_id = 'Selecciona una forma'; // Usar 0 para validar el valor inicial
    if (formData.event_id === 0) newErrors.event_id = 'Selecciona un tipo de evento'; // Usar 0 para validar el valor inicial
    if (!formData.colors.length) newErrors.colors = 'Selecciona al menos un color';
    if (!formData.scents.length) newErrors.scents = 'Selecciona al menos un aroma';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        // Asegurarse de que el elemento existe antes de hacer scroll
        const element = document.getElementsByName(firstErrorField)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    try {
      await createProduct(formData);
      setSuccess('¡Producto registrado exitosamente!');
      setFormData({
        name: '',
        price: 0,
        description: '',
        dimensions: '',
        image: null,
        form_id: 0,
        event_id: 0,
        burnTime: '',
        featured: false,
        ingredients: [''],
        instructions: [''],
        colors: [],
        scents: [],
      });
      setErrors({});
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error al registrar el producto:', error);
      setErrors({ general: 'Error al registrar el producto. Inténtalo de nuevo.' });
      setTimeout(() => setErrors({}), 3000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Explicitly type the target element
    const target = e.target; // No direct casting here, let TypeScript infer the union

    setSuccess('');
    // Use target.name directly as it exists on all types in the union
    if (errors[target.name]) setErrors(prev => ({ ...prev, [target.name]: '' }));

    if (target instanceof HTMLInputElement) {
      if (target.type === 'checkbox') {
        // Now target is confirmed to be HTMLInputElement, so 'checked' exists
        setFormData(prev => ({ ...prev, [target.name]: target.checked }));
      } else if (target.name === 'price') {
        setFormData(prev => ({ ...prev, [target.name]: parseFloat(target.value) || 0 }));
      } else {
        setFormData(prev => ({ ...prev, [target.name]: target.value }));
      }
    } else if (target instanceof HTMLSelectElement) {
      // Now target is confirmed to be HTMLSelectElement, so 'multiple' and 'options' exist
      if (target.multiple) {
        const selected = Array.from(target.options)
          .filter((option: HTMLOptionElement) => option.selected)
          .map((option: HTMLOptionElement) => parseInt(option.value));
        setFormData(prev => ({ ...prev, [target.name]: selected }));
      } else {
        setFormData(prev => ({ ...prev, [target.name]: parseInt(target.value) || 0 }));
      }
    } else if (target instanceof HTMLTextAreaElement) {
      // Now target is confirmed to be HTMLTextAreaElement
      setFormData(prev => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', idx: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', idx: number) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleCheckboxChange = (field: 'colors' | 'scents', id: number, checked: boolean) => {
    setFormData(prev => {
      const currentItems = prev[field];
      const updatedItems = checked
        ? [...currentItems, id]
        : currentItems.filter(itemId => itemId !== id);
      return { ...prev, [field]: updatedItems };
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
            {success}
          </div>
        </div>
      )}
      {errors.general && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
            {errors.general}
          </div>
        </div>
      )}

      <nav className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a productos
        </button>
      </nav>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-[#4A55A2] mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Agregar nuevo producto</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Completa el formulario para agregar un nuevo producto a tu inventario</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del producto */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Dimensiones */}
            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                Dimensiones
              </label>
              <input
                type="text"
                name="dimensions"
                id="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
              />
            </div>

            {/* Tiempo de quemado */}
            <div>
              <label htmlFor="burnTime" className="block text-sm font-medium text-gray-700">
                Tiempo de quemado
              </label>
              <input
                type="text"
                name="burnTime"
                id="burnTime"
                value={formData.burnTime}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
              />
            </div>

            {/* Imagen */}
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Imagen <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className={`mt-1 block w-full border ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#E0E7FF] file:text-[#4A55A2] hover:file:bg-[#C5D2FF] focus:outline-none`}
              />
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              {formData.image && (
                <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {formData.image.name}</p>
              )}
            </div>

            {/* Forma */}
            <div>
              <label htmlFor="form_id" className="block text-sm font-medium text-gray-700">
                Forma <span className="text-red-500">*</span>
              </label>
              <select
                name="form_id"
                id="form_id"
                value={formData.form_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.form_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              >
                <option value={0}>Selecciona una forma</option>
                {formOptions.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              {errors.form_id && <p className="mt-1 text-sm text-red-600">{errors.form_id}</p>}
            </div>

            {/* Tipo de evento */}
            <div>
              <label htmlFor="event_id" className="block text-sm font-medium text-gray-700">
                Tipo de evento <span className="text-red-500">*</span>
              </label>
              <select
                name="event_id"
                id="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.event_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              >
                <option value={0}>Selecciona un evento</option>
                {eventOptions.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {errors.event_id && <p className="mt-1 text-sm text-red-600">{errors.event_id}</p>}
            </div>

            {/* Destacado */}
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
              />
              <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                Destacado (Mostrar en la página principal)
              </label>
            </div>

            {/* Ingredientes dinámicos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredientes
              </label>
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleArrayChange('ingredients', idx, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                    placeholder={`Ingrediente ${idx + 1}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', idx)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Eliminar ingrediente"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="text-[#4A55A2] hover:text-[#38467f] font-medium mt-1 px-3 py-1 rounded-md transition-colors"
              >
                + Agregar ingrediente
              </button>
            </div>

            {/* Instrucciones dinámicas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones
              </label>
              {formData.instructions.map((ins, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={ins}
                    onChange={e => handleArrayChange('instructions', idx, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                    placeholder={`Instrucción ${idx + 1}`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('instructions', idx)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Eliminar instrucción"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('instructions')}
                className="text-[#4A55A2] hover:text-[#38467f] font-medium mt-1 px-3 py-1 rounded-md transition-colors"
              >
                + Agregar instrucción
              </button>
            </div>

            {/* Selección múltiple de colores con checkboxes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colores <span className="text-red-500">*</span>
              </label>
              <div className={`flex flex-wrap gap-4 ${errors.colors ? 'border border-red-300 rounded-md p-3' : ''}`}>
                {colorOptions.map(c => (
                  <label key={c.id} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(c.id)}
                      onChange={e => handleCheckboxChange('colors', c.id, e.target.checked)}
                      className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
              {errors.colors && <p className="mt-1 text-sm text-red-600">{errors.colors}</p>}
            </div>

            {/* Selección múltiple de aromas con checkboxes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aromas <span className="text-red-500">*</span>
              </label>
              <div className={`flex flex-wrap gap-4 ${errors.scents ? 'border border-red-300 rounded-md p-3' : ''}`}>
                {scentOptions.map(a => (
                  <label key={a.id} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.scents.includes(a.id)}
                      onChange={e => handleCheckboxChange('scents', a.id, e.target.checked)}
                      className="h-4 w-4 text-[#4A55A2] border-gray-300 rounded focus:ring-[#4A55A2]"
                    />
                    {a.name}
                  </label>
                ))}
              </div>
              {errors.scents && <p className="mt-1 text-sm text-red-600">{errors.scents}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A55A2]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A55A2]"
            >
              Agregar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
