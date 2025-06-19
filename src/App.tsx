import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import AddSale from './pages/AddSale';
import Login from './pages/Login';
import ForumAdmin from './pages/Forum';
import AddForma from './pages/AddForma';
import AddColor from './pages/AddColor';
import AddAroma from './pages/AddAroma';
import AddEvento from './pages/AddTEvento';
import EditProduct from './components/editProduct';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="sales" element={<Sales />} />
              <Route path="sales/add" element={<AddSale />} />
              <Route path="reports" element={<Reports />} />
              <Route path="forum" element={<ForumAdmin />} />
              <Route path="formas/add" element={<AddForma />} />
              <Route path="color/add" element={<AddColor />} />
              <Route path="aromas/add" element={<AddAroma />} />
              <Route path="evento/add" element={<AddEvento />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
            </Route>
          </Routes>
        </Router>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;