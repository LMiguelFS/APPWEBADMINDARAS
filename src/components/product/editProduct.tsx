import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    price: '',
    form_id: 0,
    color_id: 0,
    scent_id: 0,
  });
  const [formas, setFormas] = useState<{ id: number; name: string }[]>([]);
  const [colores, setColores] = useState<{ id: number; name: string }[]>([]);
  const [aromas, setAromas] = useState<{ id: number; name: string }[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar producto
    fetch(`https://api.darasglowcandle.site/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          detail: data.detail || '',
          price: data.price || '',
          form_id: data.form_id || 0,
          color_id: data.colors && data.colors[0] ? data.colors[0].id : 0,
          scent_id: data.scents && data.scents[0] ? data.scents[0].id : 0,
        });
      });

    // Cargar formas, colores y aromas
    fetch('https://api.darasglowcandle.site/api/forms')
      .then(res => res.json()).then(setFormas);
    fetch('https://api.darasglowcandle.site/api/colors')
      .then(res => res.json()).then(setColores);
    fetch('https://api.darasglowcandle.site/api/scents')
      .then(res => res.json()).then(setAromas);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value : value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: formData.name,
        detail: formData.detail,
        price: formData.price,
        form_id: Number(formData.form_id),
        colors: formData.color_id ? [Number(formData.color_id)] : [],
        scents: formData.scent_id ? [Number(formData.scent_id)] : [],
      };
      const res = await fetch(`https://api.darasglowcandle.site/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setSuccess('¡Producto actualizado!');
      setTimeout(() => navigate('/products'), 1200);
    } catch {
      setError('Error al actualizar el producto');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg border border-gray-200 mt-8 p-6">
      <h1 className="text-xl font-bold mb-4 text-[#4A55A2]">Editar producto</h1>
      {success && <div className="mb-3 text-green-600">{success}</div>}
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Detalles</label>
          <input
            type="text"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Forma</label>
          <select
            name="form_id"
            value={formData.form_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          >
            <option value={0}>Selecciona una forma</option>
            {formas.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <select
            name="color_id"
            value={formData.color_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          >
            <option value={0}>Selecciona un color</option>
            {colores.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Aroma</label>
          <select
            name="scent_id"
            value={formData.scent_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          >
            <option value={0}>Selecciona un aroma</option>
            {aromas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md text-white bg-[#4A55A2] hover:bg-[#38467f]"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;