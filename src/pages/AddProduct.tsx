import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    dimensions: '',
    imageUrl: '', // Cambiaremos el manejo de este campo
    imageFile: null as File | null, // Nuevo campo para el archivo
    form_id: 0,
    event_id: 0,
    burnTime: '',
    featured: false,
    ingredients: [''],
    instructions: [''],
    colors: [] as number[],
    scents: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formas, setFormas] = useState<{ id: number; name: string }[]>([]);
  const [colores, setColores] = useState<{ id: number; name: string }[]>([]);
  const [aromas, setAromas] = useState<{ id: number; name: string }[]>([]);
  const [eventos, setEventos] = useState<{ id: number; name: string }[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    //const url = 'https://api.darasglowcandle.site';
    const url = 'http://127.0.0.1:8000'
    fetch(url + '/api/forms')
      .then(data => setFormas(data))
      .catch(() => setFormas([]));

    fetch(url + '/api/colors')
      .then(res => res.json())
      .then(data => setColores(data))
      .catch(() => setColores([]));

    fetch(url + '/api/scents')
      .then(res => res.json())
      .then(data => setAromas(data))
      .catch(() => setAromas([]));

    fetch(url + '/api/events')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(() => setEventos([]));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.form_id) newErrors.form_id = 'Selecciona una forma';
    if (!formData.event_id) newErrors.event_id = 'Selecciona un tipo de evento';
    if (!formData.colors.length) newErrors.colors = 'Selecciona al menos un color';
    if (!formData.scents.length) newErrors.scents = 'Selecciona al menos un aroma';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, multiple, options } = e.target as any;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (multiple) {
      const selected = Array.from(options)
        .filter((o: any) => o.selected)
        .map((o: any) => parseInt(o.value));
      setFormData({ ...formData, [name]: selected });
    } else if (name === 'price' || name === 'form_id' || name === 'event_id') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Para ingredientes e instrucciones dinámicos
  const handleArrayChange = (field: 'ingredients' | 'instructions', idx: number, value: string) => {
    const arr = [...formData[field]];
    arr[idx] = value;
    setFormData({ ...formData, [field]: arr });
  };
  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  const removeArrayItem = (field: 'ingredients' | 'instructions', idx: number) => {
    const arr = [...formData[field]];
    arr.splice(idx, 1);
    setFormData({ ...formData, [field]: arr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const url = 'http://127.0.0.1:8000'
    try {
      const res = await fetch(url + '/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al registrar');
      setSuccess('¡Producto registrado exitosamente!');
      setTimeout(() => {
        setSuccess('');
        navigate('/products');
      }, 1500);
    } catch {
      setErrors({ general: 'Error al registrar el producto' });
    }
  };

  return (
    <div>
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
            {success}
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

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-[#4A55A2] mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Agregar nuevo producto</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Completa el formulario para agregar un nuevo producto a tu inventario</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dimensiones
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagen (URL)
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Forma <span className="text-red-500">*</span>
              </label>
              <select
                name="form_id"
                value={formData.form_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.form_id ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3`}
              >
                <option value={0}>Selecciona una forma</option>
                {formas.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              {errors.form_id && <p className="mt-1 text-sm text-red-600">{errors.form_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de evento <span className="text-red-500">*</span>
              </label>
              <select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.event_id ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3`}
              >
                <option value={0}>Selecciona un evento</option>
                {eventos.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              {errors.event_id && <p className="mt-1 text-sm text-red-600">{errors.event_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tiempo de quemado
              </label>
              <input
                type="text"
                name="burnTime"
                value={formData.burnTime}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Destacado
              </label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="ml-2"
              />
            </div>

            {/* Ingredientes dinámicos */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ingredientes
              </label>
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleArrayChange('ingredients', idx, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                  {formData.ingredients.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('ingredients', idx)} className="text-red-500">-</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('ingredients')} className="text-blue-500 mt-1">+ Agregar ingrediente</button>
            </div>

            {/* Instrucciones dinámicas */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instrucciones
              </label>
              {formData.instructions.map((ins, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={ins}
                    onChange={e => handleArrayChange('instructions', idx, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                  {formData.instructions.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('instructions', idx)} className="text-red-500">-</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('instructions')} className="text-blue-500 mt-1">+ Agregar instrucción</button>
            </div>

            {/* Selección múltiple de colores con checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Colores <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3 mt-2">
                {colores.map(c => (
                  <label key={c.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(c.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData({ ...formData, colors: [...formData.colors, c.id] });
                        } else {
                          setFormData({ ...formData, colors: formData.colors.filter(id => id !== c.id) });
                        }
                        if (errors.colors) setErrors({ ...errors, colors: '' });
                      }}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
              {errors.colors && <p className="mt-1 text-sm text-red-600">{errors.colors}</p>}
            </div>

            {/* Selección múltiple de aromas con checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aromas <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3 mt-2">
                {aromas.map(a => (
                  <label key={a.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.scents.includes(a.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData({ ...formData, scents: [...formData.scents, a.id] });
                        } else {
                          setFormData({ ...formData, scents: formData.scents.filter(id => id !== a.id) });
                        }
                        if (errors.scents) setErrors({ ...errors, scents: '' });
                      }}
                    />
                    {a.name}
                  </label>
                ))}
              </div>
              {errors.scents && <p className="mt-1 text-sm text-red-600">{errors.scents}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f]"
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