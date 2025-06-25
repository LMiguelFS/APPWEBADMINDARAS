import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { ColorProvider } from './context/ColorContext';
import { ScentsProvider } from './context/ScentsContext';
import { EventProvider } from './context/EventContext';
import { MetricsProvider } from './context/MetricsContext';
import { ProductProvider } from './context/ProductContext';
import { UsersProvider } from './context/UserContext';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
// import Reports from './pages/Reports';
import Layout from './components/Layout';
// import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
// import AddSale from './pages/AddSale';
import Login from './pages/Login';
// import ForumAdmin from './pages/Forum';

import AddForma from './components/AddForma';
import AddColor from './components/AddColor';
import AddAroma from './components/AddAroma';
import EditProduct from './components/product/editProduct';
import AddEvento from './components/AddTEvento';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
      <UsersProvider>
        <ProductProvider>
        <FormProvider>
          <ColorProvider>
            <ScentsProvider>
              <EventProvider>
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
                        {/* <Route path="products/:id" element={<ProductDetail />} /> */}
                        <Route path="customers" element={<Customers />} />
                        <Route path="sales" element={<Sales />} />
                        {/* <Route path="sales/add" element={<AddSale />} /> */}
                        {/* <Route path="reports" element={<Reports />} /> */}
                        {/* <Route path="forum" element={<ForumAdmin />} /> */}
                        <Route path="formas/add" element={<AddForma />} />
                        <Route path="color/add" element={<AddColor />} />
                        <Route path="aromas/add" element={<AddAroma />} />
                        <Route path="products/edit/:id" element={<EditProduct />} />
                        <Route path="evento/add" element={<AddEvento />} />
                      </Route>
                    </Routes>
                  </Router>
                </MetricsProvider>
              </EventProvider>
            </ScentsProvider>
          </ColorProvider>
        </FormProvider>
        </ProductProvider>
      </UsersProvider>
      </InventoryProvider>
    </AuthProvider >
  );
}

export default App;