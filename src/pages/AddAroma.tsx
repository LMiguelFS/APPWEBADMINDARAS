import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AddAroma: React.FC = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!name.trim()) {
        //     setError('El nombre es obligatorio');
        //     return;
        // }
        // try {
        //     await fetch('https://api.darasglowcandle.site/api/scents', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ name }),
        //     });
        //     setSuccess('¡Aroma registrado exitosamente!');
        //     setTimeout(() => {
        //         setSuccess('');
        //         navigate('/products');
        //     }, 1500);
        // } catch {
        //     setError('Error al guardar el aroma');
        // }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md mx-auto mt-8">
            {/* Toast emergente */}
            {success && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
                        {success}
                    </div>
                </div>
            )}
            <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Agregar nuevo Aroma</h1>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre del aroma <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={e => { setName(e.target.value); setError(''); setSuccess(''); }}
                        className={`mt-1 block w-full border ${error ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
                        Agregar aroma
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAroma;