import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    detalles: '', // Cambiado de category a detalles
    price: 0,
    imageFile: null as File | null, // Nuevo campo para archivo de imagen
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }

    if (!formData.detalles.trim()) {
      newErrors.detalles = 'Los detalles son obligatorios';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí puedes manejar la subida de la imagen junto con los datos
      // Por ejemplo, usando FormData para enviar a un backend
      // const data = new FormData();
      // data.append('name', formData.name);
      // data.append('detalles', formData.detalles);
      // data.append('price', formData.price.toString());
      // if (formData.imageFile) data.append('image', formData.imageFile);

      addProduct(formData);
      navigate('/products');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imageFile: e.target.files[0],
      });
    }
  };

  return (
    <div>
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