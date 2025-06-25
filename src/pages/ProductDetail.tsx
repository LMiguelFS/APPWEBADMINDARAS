// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Package,
//   Edit,
//   Trash,
//   ArrowLeft,
//   AlertTriangle,
//   ShoppingCart,
//   Clock
// } from 'lucide-react';
// import { useInventory } from '../context/InventoryContext';

// const ProductDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { getProduct, updateProduct, deleteProduct, addSale } = useInventory();

//   const product = getProduct(id || '');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showSaleModal, setShowSaleModal] = useState(false);
//   const [saleQuantity, setSaleQuantity] = useState(1);
//   const [saleSuccess, setSaleSuccess] = useState('');

//   const [editFormData, setEditFormData] = useState({
//     name: product?.name || '',
//     category: product?.category || '',
//     price: product?.price || 0,
//     cost: product?.cost || 0,
//     stock: product?.stock || 0,
//     sku: product?.sku || '',
//     description: product?.description || '',
//     imageUrl: product?.imageUrl || '',
//   });

//   if (!product) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <Package className="h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The product you're looking for doesn't exist or has been removed.
//         </p>
//         <div className="mt-6">
//           <button
//             onClick={() => navigate('/products')}
//             className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#4A55A2] hover:bg-[#38467f]"
//           >
//             <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleUpdateProduct = () => {
//     updateProduct(product.id, editFormData);
//     setIsEditing(false);
//   };

//   const handleDeleteProduct = () => {
//     deleteProduct(product.id);
//     navigate('/products');
//   };


//   const isLowStock = product.stock <= 5;
//   const profit = product.price - product.cost;
//   const profitMargin = (profit / product.price) * 100;

//   return (
//     <div>
//       {/* Navigation */}
//       <nav className="mb-6">
//         <button
//           onClick={() => navigate('/products')}
//           className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Products
//         </button>
//       </nav>

//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         {/* Header */}
//         <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
//             <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
//           </div>
//           <div className="mt-4 sm:mt-0 flex space-x-3">
//             <button
//               onClick={() => setShowSaleModal(true)}
//               className="flex items-center px-4 py-2 bg-[#4A55A2] text-white rounded-md hover:bg-[#38467f] transition-colors duration-150"
//               disabled={product.stock === 0}
//             >
//               <ShoppingCart className="h-5 w-5 mr-1" />
//               Record Sale
//             </button>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150"
//             >
//               <Edit className="h-5 w-5 mr-1" />
//               Edit
//             </button>
//             <button
//               onClick={() => setIsDeleting(true)}
//               className="flex items-center px-4 py-2 bg-white border border-gray-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-150"
//             >
//               <Trash className="h-5 w-5 mr-1" />
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Product details */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
//           {/* Left column: Image */}
//           <div className="md:col-span-1">
//             {product.imageUrl ? (
//               <img
//                 src={product.imageUrl}
//                 alt={product.name}
//                 className="w-full h-auto rounded-lg object-cover"
//               />
//             ) : (
//               <div className="w-full h-64 rounded-lg bg-gray-200 flex items-center justify-center">
//                 <Package className="h-12 w-12 text-gray-400" />
//               </div>
//             )}

//             {/* Stock status */}
//             <div className={`mt-4 p-3 rounded-md ${isLowStock ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
//               }`}>
//               <div className="flex items-center">
//                 {isLowStock ? (
//                   <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
//                 ) : (
//                   <Package className="h-5 w-5 text-green-500 mr-2" />
//                 )}
//                 <div>
//                   <p className={`text-sm font-medium ${isLowStock ? 'text-red-800' : 'text-green-800'}`}>
//                     {isLowStock ? 'Low Stock Alert' : 'In Stock'}
//                   </p>
//                   <p className={`text-sm ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
//                     {product.stock} units available
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Product timestamps */}
//             <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
//               <div className="flex items-center mb-2">
//                 <Clock className="h-4 w-4 text-gray-500 mr-2" />
//                 <p className="text-xs text-gray-500">
//                   Created: {new Date(product.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <Clock className="h-4 w-4 text-gray-500 mr-2" />
//                 <p className="text-xs text-gray-500">
//                   Updated: {new Date(product.updatedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right column: Details */}
//           <div className="md:col-span-2">
//             {isEditing ? (
//               /* Edit form */
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Product Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={editFormData.name}
//                     onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       id="category"
//                       value={editFormData.category}
//                       onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
//                       SKU
//                     </label>
//                     <input
//                       type="text"
//                       id="sku"
//                       value={editFormData.sku}
//                       onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       id="price"
//                       value={editFormData.price}
//                       onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
//                       Cost ($)
//                     </label>
//                     <input
//                       type="number"
//                       id="cost"
//                       value={editFormData.cost}
//                       onChange={(e) => setEditFormData({ ...editFormData, cost: parseFloat(e.target.value) })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
//                       Stock
//                     </label>
//                     <input
//                       type="number"
//                       id="stock"
//                       value={editFormData.stock}
//                       onChange={(e) => setEditFormData({ ...editFormData, stock: parseInt(e.target.value) })}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     rows={4}
//                     value={editFormData.description}
//                     onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
//                     Image URL
//                   </label>
//                   <input
//                     type="text"
//                     id="imageUrl"
//                     value={editFormData.imageUrl}
//                     onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleUpdateProduct}
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f] focus:outline-none"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* Product details view */
//               <div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <p className="text-sm font-medium text-gray-500">Sale Price</p>
//                     <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <p className="text-sm font-medium text-gray-500">Profit Margin</p>
//                     <div className="flex items-baseline">
//                       <p className="text-2xl font-bold text-gray-900">${profit.toFixed(2)}</p>
//                       <p className="ml-2 text-sm text-gray-500">({profitMargin.toFixed(1)}%)</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Description</h3>
//                     <p className="mt-1 text-sm text-gray-900">{product.description}</p>
//                   </div>

//                   <div className="border-t border-gray-200 pt-4">
//                     <h3 className="text-sm font-medium text-gray-500 mb-2">Product Details</h3>
//                     <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
//                       <div className="sm:col-span-1">
//                         <dt className="text-xs text-gray-500">Category</dt>
//                         <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
//                       </div>
//                       <div className="sm:col-span-1">
//                         <dt className="text-xs text-gray-500">SKU</dt>
//                         <dd className="mt-1 text-sm text-gray-900">{product.sku}</dd>
//                       </div>
//                       <div className="sm:col-span-1">
//                         <dt className="text-xs text-gray-500">Cost</dt>
//                         <dd className="mt-1 text-sm text-gray-900">${product.cost.toFixed(2)}</dd>
//                       </div>
//                       <div className="sm:col-span-1">
//                         <dt className="text-xs text-gray-500">Current Stock</dt>
//                         <dd className="mt-1 text-sm text-gray-900">{product.stock} units</dd>
//                       </div>
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete confirmation modal */}
//       {isDeleting && (
//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <Trash className="h-6 w-6 text-red-600" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete this product? This action cannot be undone.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={handleDeleteProduct}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setIsDeleting(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Record sale modal */}
//       {showSaleModal && (
//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#4A55A2] bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
//                     <ShoppingCart className="h-6 w-6 text-[#4A55A2]" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Record Sale</h3>
//                     <div className="mt-4">
//                       <div className="flex items-center justify-between mb-4">
//                         <p className="text-sm text-gray-500">Product:</p>
//                         <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                       </div>
//                       <div className="flex items-center justify-between mb-4">
//                         <p className="text-sm text-gray-500">Price:</p>
//                         <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
//                       </div>
//                       <div className="flex items-center justify-between mb-4">
//                         <p className="text-sm text-gray-500">Available Stock:</p>
//                         <p className="text-sm font-medium text-gray-900">{product.stock} units</p>
//                       </div>
//                       <div>
//                         <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
//                           Quantity
//                         </label>
//                         <input
//                           type="number"
//                           id="quantity"
//                           min="1"
//                           max={product.stock}
//                           value={saleQuantity}
//                           onChange={(e) => setSaleQuantity(parseInt(e.target.value))}
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
//                         />
//                       </div>
//                       <div className="mt-4 bg-gray-50 rounded-md p-3">
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm font-medium text-gray-700">Total:</p>
//                           <p className="text-lg font-bold text-[#4A55A2]">
//                             ${(saleQuantity * product.price).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#4A55A2] text-base font-medium text-white hover:bg-[#38467f] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
//                   disabled={saleQuantity <= 0 || saleQuantity > product.stock}
//                 >
//                   Confirm Sale
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setShowSaleModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetail;