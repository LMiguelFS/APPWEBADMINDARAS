import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    form_id: 0,
    colors: [] as number[],
    scents: [] as number[],
    dimensions: '',
    imageUrl: '',
    event_id: 0,
    burnTime: '',
    featured: false,
    ingredients: [] as string[],
    instructions: [] as string[],
  });
  const [formas, setFormas] = useState<{ id: number; name: string }[]>([]);
  const [colores, setColores] = useState<{ id: number; name: string }[]>([]);
  const [aromas, setAromas] = useState<{ id: number; name: string }[]>([]);
  const [eventos, setEventos] = useState<{ id: number; name: string }[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar producto
    fetch(`https://api.darasglowcandle.site/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          form_id: data.form_id || 0,
          colors: data.colors ? data.colors.map((c: any) => Number(c.id)) : [],
          scents: data.scents ? data.scents.map((s: any) => Number(s.id)) : [],
          dimensions: data.dimensions || '',
          imageUrl: data.imageUrl || '',
          event_id: data.event_id || 0,
          burnTime: data.burnTime || '',
          featured: data.featured || false,
          ingredients: data.ingredients || [],
          instructions: data.instructions || [],
        });
      });

    // Cargar formas, colores y aromas
    fetch('https://api.darasglowcandle.site/api/forms')
      .then(res => res.json()).then(setFormas);
    fetch('https://api.darasglowcandle.site/api/colors')
      .then(res => res.json()).then(setColores);
    fetch('https://api.darasglowcandle.site/api/scents')
      .then(res => res.json()).then(setAromas);
    fetch('https://api.darasglowcandle.site/api/events')
      .then(res => res.json()).then(setEventos);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' && name === 'featured'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
    setError('');
    setSuccess('');
  };

  // Para manejar arrays de strings (ingredients, instructions)
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
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        form_id: Number(formData.form_id),
        colors: formData.colors,
        scents: formData.scents,
        dimensions: formData.dimensions,
        imageUrl: formData.imageUrl,
        event_id: Number(formData.event_id),
        burnTime: formData.burnTime,
        featured: formData.featured,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
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
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            rows={3}
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
          <label className="block text-sm font-medium text-gray-700">Colores</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {colores.map(c => (
              <label key={c.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.colors.includes(Number(c.id))}
                  onChange={e => {
                    const colorId = Number(c.id);
                    setFormData(prev => {
                      const exists = prev.colors.includes(colorId);
                      return {
                        ...prev,
                        colors: e.target.checked
                          ? exists
                            ? prev.colors
                            : [...prev.colors, colorId]
                          : prev.colors.filter(id => id !== colorId),
                      };
                    });
                  }}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Aromas</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {aromas.map(a => (
              <label key={a.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.scents.includes(Number(a.id))}
                  onChange={e => {
                    const scentId = Number(a.id);
                    setFormData(prev => {
                      const exists = prev.scents.includes(scentId);
                      return {
                        ...prev,
                        scents: e.target.checked
                          ? exists
                            ? prev.scents
                            : [...prev.scents, scentId]
                          : prev.scents.filter(id => id !== scentId),
                      };
                    });
                  }}
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
        {/* Dimensiones */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensiones</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
          />
        </div>
        {/* Imagen URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">URL de la imagen</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
          />
        </div>
        {/* Evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Evento</label>
          <select
            name="event_id"
            value={formData.event_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            required
          >
            <option value={0}>Selecciona un evento</option>
            {eventos.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        </div>
        {/* Tiempo de quemado */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiempo de quemado</label>
          <input
            type="text"
            name="burnTime"
            value={formData.burnTime}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
          />
        </div>
        {/* Destacado */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-gray-700">Destacado</label>
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
        <button
          type="submit"
          className="w-full bg-[#4A55A2] text-white py-2 px-4 rounded hover:bg-[#3b4780] transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditProduct;