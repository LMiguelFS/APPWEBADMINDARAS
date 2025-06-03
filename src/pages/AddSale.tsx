import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Search } from 'lucide-react';
import { useInventory, Product } from '../context/InventoryContext';

const AddSale: React.FC = () => {
  const navigate = useNavigate();
  const { products, addSale } = useInventory();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedProduct) {
      newErrors.product = 'Please select a product';
    }
    
    if (quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (selectedProduct && quantity > selectedProduct.stock) {
      newErrors.quantity = `Only ${selectedProduct.stock} units available`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedProduct) {
      addSale({
        productId: selectedProduct.id,
        quantity,
        salePrice: selectedProduct.price,
        customer: customer || undefined,
      });
      
      navigate('/sales');
    }
  };
  
  return (
    <div>
      {/* Navigation */}
      <nav className="mb-6">
        <button
          onClick={() => navigate('/sales')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sales
        </button>
      </nav>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-[#4A55A2] mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Record New Sale</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Complete the form below to record a new sales transaction</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Product selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product <span className="text-red-500">*</span>
              </label>
              
              {/* Search input */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-1">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      if (errors.product) {
                        setErrors({ ...errors, product: '' });
                      }
                    }}
                    className={`border rounded-md p-3 cursor-pointer transition-colors duration-150 ${
                      selectedProduct?.id === product.id
                        ? 'border-[#4A55A2] bg-[#4A55A2] bg-opacity-5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{product.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or add a new product first.
                    </p>
                  </div>
                )}
              </div>
              
              {errors.product && <p className="mt-2 text-sm text-red-600">{errors.product}</p>}
            </div>
            
            {selectedProduct && (
              <>
                {/* Selected product summary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Product</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedProduct.imageUrl ? (
                        <img 
                          src={selectedProduct.imageUrl} 
                          alt={selectedProduct.name} 
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {selectedProduct.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{selectedProduct.name}</h3>
                        <p className="text-xs text-gray-500">
                          {selectedProduct.category} • SKU: {selectedProduct.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${selectedProduct.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{selectedProduct.stock} in stock</p>
                    </div>
                  </div>
                </div>
                
                {/* Quantity and customer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(parseInt(e.target.value) || 0);
                        if (errors.quantity) {
                          setErrors({ ...errors, quantity: '' });
                        }
                      }}
                      className={`mt-1 block w-full border ${
                        errors.quantity ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm`}
                    />
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customer"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                {/* Sale summary */}
                <div className="bg-[#4A55A2] bg-opacity-5 rounded-lg p-4 border border-[#4A55A2] border-opacity-20">
                  <h3 className="text-sm font-medium text-[#4A55A2] mb-2">Sale Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price per unit:</span>
                      <span className="text-sm text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <span className="text-sm text-gray-900">{quantity}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      <span className="text-lg font-bold text-[#4A55A2]">
                        ${(selectedProduct.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/sales')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A55A2] hover:bg-[#38467f] focus:outline-none"
              disabled={!selectedProduct}
            >
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSale;