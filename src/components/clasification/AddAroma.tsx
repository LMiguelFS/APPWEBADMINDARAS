// AddScent.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useProducts } from '../../context/ProductContext'; // Importa el contexto de productos
import { useReferenceCRUD } from '../../hooks/useReferenceCRUD'; // Importa el hook genérico de CRUD
import { Scent } from '../../types'; // Asegúrate de importar el tipo Scent

const AddScent: React.FC = () => {
  // Obtiene las funciones y opciones relacionadas con aromas del ProductContext
  const { scentOptions, createScent, updateScent, deleteScent } = useProducts();
  const navigate = useNavigate();

  // Utiliza el hook personalizado useReferenceCRUD para gestionar la lógica de aromas
  const {
    items: scents, // Renombra 'items' a 'scents' para mayor claridad en este componente
    name,
    setName,
    error,
    success,
    editingId,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
  } = useReferenceCRUD<Scent>(
    scentOptions, // Pasa la lista de aromas del contexto
    {
      // Adapta la función 'add': ahora espera un string y lo convierte a { name: string }
      add: async (scentName: string) => await createScent({ name: scentName }),
      // Adapta la función 'edit': ahora espera un id y un string para el nombre
      edit: async (id: number, scentName: string) => await updateScent(id, { name: scentName }),
      // remove se mantiene igual ya que solo requiere el id
      remove: async (id: number) => await deleteScent(id),
    }
  );

  // Simula un estado de carga, podrías agregar un estado 'loading' al useReferenceCRUD si fuera necesario
  const loading = false; // Por ahora, lo mantenemos simple. En una app real, vendría del hook o contexto.


  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto mt-8 p-4">
      {/* Mensaje de éxito flotante */}
      {success && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold">
            {success}
          </div>
        </div>
      )}

      {/* Panel de agregar/modificar aroma */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md w-full">
        <nav className="mb-6 px-6 pt-5">
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
              onChange={(e) => setName(e.target.value)} // setName es proporcionado por useReferenceCRUD
              className={`mt-1 block w-full border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {editingId ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit} // handleCancelEdit es proporcionado por useReferenceCRUD
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
                  Volver
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
          <div className="text-gray-500">Cargando aromas...</div>
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
                      <td className="px-4 py-2 text-sm text-gray-900">{scent.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{scent.name}</td>
                      <td className="px-4 py-2 text-center text-sm font-medium">
                        <button
                          onClick={() => handleEdit(scent.id)} // handleEdit es proporcionado por useReferenceCRUD
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          title="Editar"
                        >
                          <Pencil className="inline h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(scent.id)} // handleDelete es proporcionado por useReferenceCRUD
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