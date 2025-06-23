import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  X,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Panel', path: '/', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { name: 'Productos', path: '/products', icon: <Package className="mr-3 h-5 w-5" /> },
    { name: 'Clientes', path: '/customers', icon: <Users className="mr-3 h-5 w-5" /> },
    { name: 'Ventas', path: '/sales', icon: <ShoppingCart className="mr-3 h-5 w-5" /> },
    { name: 'Reportes', path: '/reports', icon: <BarChart3 className="mr-3 h-5 w-5" /> },
    { name: 'Configuración', path: '/settings', icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-[#96B7BC] text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Package className="h-8 w-8" />
            <span className="ml-2 text-xl font-semibold">Velas Artesanales</span>
          </div>
          <button
            className="rounded-md lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6">
          <nav className="space-y-1 px-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 hover:bg-[#7a9599] ${isActive ? 'bg-[#7a9599]' : ''
                  }`
                }
                end={link.path === '/'}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <div className="rounded-md bg-[#7a9599] p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-white bg-[#96B7BC] rounded-md hover:bg-[#859fa3] transition-colors duration-150"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;