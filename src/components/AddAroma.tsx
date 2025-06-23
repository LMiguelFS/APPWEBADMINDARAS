import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useScentsContext } from '../context/ScentsContext';

const AddScent: React.FC = () => {
    const { scents, loading, addScent, editScent, removeScent } = useScentsContext();

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        try {
            if (editingId) {
                await editScent(editingId, name);
                setSuccess('¡Scent actualizado!');
            } else {
                await addScent(name);
                setSuccess('¡Scent agregado!');
            }
            setName('');
            setEditingId(null);
            setTimeout(() => setSuccess(''), 1500);
        } catch {
            setError('Error al guardar el scent');
        }
    };

    const handleEdit = (id: number) => {
        const scent = scents.find(s => s.id === id);
        if (scent) {
            setName(scent.name);
            setEditingId(id);
            setError('');
            setSuccess('');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar este scent?')) return;
        try {
            await removeScent(id);
            setSuccess('Scent eliminado');
            setTimeout(() => setSuccess(''), 1500);
        } catch {
            setError('Error al eliminar el scent');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setError('');
        setSuccess('');
    };
    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto mt-8">
            {/* Panel de agregar/modificar aroma */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md w-full">
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

                <div className="px-6 py-5 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">
                        {editingId ? 'Modificar Aroma' : 'Agregar nuevo Aroma'}
                    </h1>
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
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                                setSuccess('');
                            }}
                            className={`mt-1 block w-full border ${error ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        {editingId ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f] focus:outline-none"
                                >
                                    Guardar cambios
                                </button>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </form>
            </div>

            {/* Panel lateral: lista de aromas */}
            <div className="bg-white rounded-lg border border-gray-200 flex-1 p-6 overflow-auto">
                <h2 className="text-lg font-semibold mb-4">Aromas existentes</h2>
                {loading ? (
                    <div className="text-gray-500">Cargando...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scents.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                            No hay aromas registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    scents.map((scent) => (
                                        <tr key={scent.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{scent.id}</td>
                                            <td className="px-4 py-2">{scent.name}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleEdit(scent.id)}
                                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                                    title="Editar"
                                                >
                                                    <Pencil className="inline h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(scent.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="inline h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddScent;
