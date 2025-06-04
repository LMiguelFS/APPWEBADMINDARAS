import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    detalles: '',
    price: 0,
    imageFile: null as File | null,
    form_id: 0,
    color_id: 0,
    scent_id: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formas, setFormas] = useState<{ id: number; name: string }[]>([]);
  const [colores, setColores] = useState<{ id: number; name: string }[]>([]);
  const [aromas, setAromas] = useState<{ id: number; name: string }[]>([]);
  const [success, setSuccess] = useState('');

  // Obtener formas, colores y aromas de la API
  useEffect(() => {
    fetch('https://api.darasglowcandle.site/api/forms')
      .then(res => res.json())
      .then(data => setFormas(data))
      .catch(() => setFormas([]));

    fetch('https://api.darasglowcandle.site/api/colors')
      .then(res => res.json())
      .then(data => setColores(data))
      .catch(() => setColores([]));

    fetch('https://api.darasglowcandle.site/api/scents')
      .then(res => res.json())
      .then(data => setAromas(data))
      .catch(() => setAromas([]));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio';
    if (!formData.detalles.trim()) newErrors.detalles = 'Los detalles son obligatorios';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.form_id || formData.form_id <= 0) newErrors.form_id = 'Selecciona una forma';
    if (!formData.color_id || formData.color_id <= 0) newErrors.color_id = 'Selecciona un color';
    if (!formData.scent_id || formData.scent_id <= 0) newErrors.scent_id = 'Selecciona un aroma';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Si no necesitas imagen, prueba enviar como JSON:
    const payload = {
      name: formData.name,
      detail: formData.detalles, 
      price: formData.price,
      form_id: formData.form_id,
      colors: formData.color_id ? [formData.color_id] : [],
      scents: formData.scent_id ? [formData.scent_id] : [],
    };

    try {
      const res = await fetch('https://api.darasglowcandle.site/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === 'form_id' || name === 'color_id' || name === 'scent_id') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  return (
    <div>
      {/* Toast emergente */}
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
            {success}
          </div>
        </div>
      )}

      {/* Navigation */}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="detalles" className="block text-sm font-medium text-gray-700">
                Detalles <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="detalles"
                id="detalles"
                value={formData.detalles}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.detalles ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.detalles && <p className="mt-1 text-sm text-red-600">{errors.detalles}</p>}
            </div>

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
                className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="form_id" className="block text-sm font-medium text-gray-700">
                Forma <span className="text-red-500">*</span>
              </label>
              <select
                name="form_id"
                id="form_id"
                value={formData.form_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.form_id ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              >
                <option value={0}>Selecciona una forma</option>
                {formas.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              {errors.form_id && <p className="mt-1 text-sm text-red-600">{errors.form_id}</p>}
            </div>

            <div>
              <label htmlFor="color_id" className="block text-sm font-medium text-gray-700">
                Color <span className="text-red-500">*</span>
              </label>
              <select
                name="color_id"
                id="color_id"
                value={formData.color_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.color_id ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              >
                <option value={0}>Selecciona un color</option>
                {colores.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.color_id && <p className="mt-1 text-sm text-red-600">{errors.color_id}</p>}
            </div>

            <div>
              <label htmlFor="scent_id" className="block text-sm font-medium text-gray-700">
                Aroma <span className="text-red-500">*</span>
              </label>
              <select
                name="scent_id" // Cambiado de aroma_id a scent_id
                id="scent_id"
                value={formData.scent_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${errors.scent_id ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
              >
                <option value={0}>Selecciona un aroma</option>
                {aromas.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              {errors.scent_id && <p className="mt-1 text-sm text-red-600">{errors.scent_id}</p>}
            </div>

            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                Imagen del producto
              </label>
              <input
                type="file"
                name="imageFile"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f] focus:outline-none"
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