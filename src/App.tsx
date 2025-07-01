import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { MetricsProvider } from './context/MetricsContext';
import { ProductProvider } from './context/ProductContext';
import { UsersProvider } from './context/UserContext';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Layout from './components/Layout';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
// import Reports from './pages/Reports';
// import AddSale from './pages/AddSale';
// import ForumAdmin from './pages/Forum';

import AddForma from './components/clasification/AddForma';
import AddColor from './components/clasification/AddColor';
import AddAroma from './components/clasification/AddAroma';
import AddEvento from './components/clasification/AddTEvento';
import EditProduct from './components/product/editProduct';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      {/* <InventoryProvider> */}
      <UsersProvider>
        <ProductProvider>
                <MetricsProvider>
                  <Router>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/" element={<ProtectedRoute><Layout />
                      </ProtectedRoute>}>
                        {/* Nested routes for admin dashboard */}
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="sales" element={<Sales />} />
                        {/* <Route path="sales/add" element={<AddSale />} /> */}
                        {/* <Route path="reports" element={<Reports />} /> */}
                        {/* <Route path="forum" element={<ForumAdmin />} /> */}
                        <Route path="formas/add" element={<AddForma />} />
                        <Route path="colors/add" element={<AddColor />} />
                        <Route path="scents/add" element={<AddAroma />} />
                        <Route path="products/edit/:id" element={<EditProduct />} />
                        <Route path="events/add" element={<AddEvento />} />
                      </Route>
                    </Routes>
                  </Router>
                </MetricsProvider>
        </ProductProvider>
      </UsersProvider>
      {/* </InventoryProvider> */}
    </AuthProvider >
  );
}

export default App;