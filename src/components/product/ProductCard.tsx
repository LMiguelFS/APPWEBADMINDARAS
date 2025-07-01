// src/components/product/ProductCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { Product } from '../../types/product'; // Importamos el tipo Product enriquecido

interface ProductCardProps {
  product: Product; // Ahora ProductCard espera el tipo Product enriquecido
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  // Aseguramos que el precio sea un número para toFixed
  const displayPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
          <span className="font-bold">Sin imagen</span>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-[#4A55A2] mb-1">{product.name}</h2>
        <p className="text-xs text-gray-500 mb-2 truncate">{product.description}</p> {/* Usamos solo description, truncate para descripciones largas */}

        {/* Detalles de Colores, Aromas, Forma, Evento */}
        <div className="flex flex-wrap gap-2 mb-2 text-xs">
          {product.colorDetails && product.colorDetails.length > 0 && (
            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <span className="font-semibold">Colores:</span> {product.colorDetails.map(c => c.name).join(', ')}
            </span>
          )}
          {product.scentDetails && product.scentDetails.length > 0 && (
            <span className="inline-block bg-pink-50 text-pink-700 px-2 py-1 rounded">
              <span className="font-semibold">Aromas:</span> {product.scentDetails.map(s => s.name).join(', ')}
            </span>
          )}
          {product.form && (
            <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded">
              <span className="font-semibold">Forma:</span> {product.form.name}
            </span>
          )}
          {product.eventDetails && (
            <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded">
              <span className="font-semibold">Evento:</span> {product.eventDetails.name}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <span className="text-base font-bold text-gray-900">S/ {displayPrice.toFixed(2)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100"
              title="Editar"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic en el botón active el onClick del div padre
                navigate(`/products/edit/${product.id}`);
              }}
            >
              <Pencil className="h-5 w-5 text-[#4A55A2]" />
            </button>
            {/* Si en el futuro necesitas un botón de eliminar/desactivar, lo añadirías aquí */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Pencil } from 'lucide-react';

// interface ProductCardProps {
//   product: {
//     // id: number;
//     // name: string;
//     // description?: string | null;
//     // detail?: string | null;
//     // price: number | string;
//     // imageUrl?: string | null;
//     // colors?: { id: number; name: string }[];
//     // scents?: { id: number; name: string }[];
//     // form?: { id: number; name: string };
//     id: number; // Asegúrate de que tus productos siempre tengan un ID
//     name: string;
//     price: number;
//     description?: string | null; // Hago opcional y nullable para flexibilidad
//     dimensions?: string | null;
//     image?: File | null; // Para la subida, si es necesario
//     imageUrl?: string | null; // Para la URL de la imagen existente
//     form_id: number;
//     event_id: number;
//     burnTime?: string | null;
//     status?: boolean; // Asumo que `status` indica si está activo/inactivo
//     featured?: boolean;
//     ingredients?: string[];
//     instructions?: string[];
//     colors?: number[]; // IDs de colores asociados
//     scents?: number[]; // IDs de aromas asociados

//     // Propiedades que se "enriquecen" después de obtener los datos brutos
//     // Esto es para mostrar nombres en lugar de solo IDs
//     form?: { id: number; name: string };
//     colorDetails?: { id: number; name: string }[];
//     scentDetails?: { id: number; name: string }[];
//     eventDetails?: { id: number; name: string }; // Detalles del evento
//   };
//   // onDelete?: (id: number) => void;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
//     >
//       {product.imageUrl ? (
//         <img
//           src={product.imageUrl}
//           alt={product.name}
//           className="w-full h-48 object-cover"
//         />
//       ) : (
//         <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
//           <span className="font-bold">Sin imagen</span>
//         </div>
//       )}
//       <div className="p-5 flex-1 flex flex-col">
//         <h2 className="text-lg font-bold text-[#4A55A2] mb-1">{product.name}</h2>
//         <p className="text-xs text-gray-500 mb-2">{product.description || product.description}</p>
//         <div className="flex flex-wrap gap-2 mb-2">
//           {product.colors && product.colors.length > 0 && (
//             <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
//               <span className="font-semibold">Colores:</span> {product.colors.map(c => c.name).join(', ')}
//             </span>
//           )}
//           {product.scents && product.scents.length > 0 && (
//             <span className="inline-block bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded">
//               <span className="font-semibold">Aromas:</span> {product.scents.map(s => s.name).join(', ')}
//             </span>
//           )}
//           {product.form && (
//             <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
//               <span className="font-semibold">Forma:</span> {product.form.name}
//             </span>
//           )}
//         </div>
//         <div className="flex items-end justify-between mt-auto">
//           <span className="text-base font-bold text-gray-900">S/ {product.price}</span>
//           <div className="flex gap-2">
//             <button
//               type="button"
//               className="p-2 rounded hover:bg-gray-100"
//               title="Editar"
//               onClick={() => navigate(`/products/edit/${product.id}`)}
//             >
//               <Pencil className="h-5 w-5 text-[#4A55A2]" />
//             </button>
//             {/* <button
//               type="button"
//               className="p-2 rounded hover:bg-red-100"
//               title="Desactivar"
//               onClick={() => onDelete && onDelete(product.id)}
//             >
//             </button> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;