// import React, { useEffect, useState } from 'react';
// import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

// interface Venta {
//   id: number;
//   date: string;
//   product: string;
//   quantity: number;
//   salePrice: number;
//   customer: string;
//   total: number;
// }

// interface SalesTableProps {
//   limit?: number;
// }

// const SalesTable: React.FC<SalesTableProps> = ({ limit }) => {
//   const [ventas, setVentas] = useState<Venta[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState<keyof Venta>('date');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
//   const [totalPages, setTotalPages] = useState(1);
//   const pageSize = 5;

//   useEffect(() => {
//     const fetchVentas = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/ventas.php?page=${currentPage}&perPage=${pageSize}&sort=${sortField}&direction=${sortDirection}`
//         );
//         if (!res.ok) throw new Error('No se pudieron cargar las ventas');
//         const data = await res.json();
//         setVentas(
//           data.data.map((v: any) => ({
//             id: v.id,
//             date: v.date,
//             product: v.producto, // mapeo correcto
//             quantity: v.quantity,
//             salePrice: v.salePrice,
//             customer: v.cliente, // mapeo correcto
//             total: v.total,
//           }))
//         );
//         setTotalPages(data.pagination.totalPages);
//       } catch (err: any) {
//         alert(err.message);
//       }
//     };
//     fetchVentas();
//     // eslint-disable-next-line
//   }, [currentPage, sortField, sortDirection]);

//   const handleSort = (field: keyof Venta) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('desc');
//     }
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('es-PE', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const renderSortIcon = (field: keyof Venta) => {
//     if (sortField !== field) return null;
//     return sortDirection === 'asc'
//       ? <ArrowUp className="h-4 w-4 ml-1" />
//       : <ArrowDown className="h-4 w-4 ml-1" />;
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('date')}
//               >
//                 <div className="flex items-center">
//                   Fecha {renderSortIcon('date')}
//                 </div>
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Producto
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('quantity')}
//               >
//                 <div className="flex items-center">
//                   Cantidad {renderSortIcon('quantity')}
//                 </div>
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('salePrice')}
//               >
//                 <div className="flex items-center">
//                   Precio {renderSortIcon('salePrice')}
//                 </div>
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Cliente
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {ventas.map((sale) => (
//               <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-150">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {formatDate(sale.date)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{sale.product}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {sale.quantity}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   S/.{sale.salePrice.toFixed(2)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {sale.customer}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   S/.{sale.total.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {!limit && totalPages > 1 && (
//         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//           <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
//                 <span className="font-medium">{totalPages}</span>
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginación">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
//                     }`}
//                 >
//                   <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                 </button>
//                 {Array.from({ length: totalPages }).map((_, idx) => {
//                   const pageNumber = idx + 1;
//                   return (
//                     <button
//                       key={pageNumber}
//                       onClick={() => setCurrentPage(pageNumber)}
//                       className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === pageNumber
//                         ? 'z-10 bg-[#4A55A2] border-[#4A55A2] text-white'
//                         : 'text-gray-500 hover:bg-gray-50'
//                         }`}
//                     >
//                       {pageNumber}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
//                     }`}
//                 >
//                   <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesTable;