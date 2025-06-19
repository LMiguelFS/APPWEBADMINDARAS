import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Search inventory..."
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A55A2]"
            >
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-[#4A55A2] flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="px-4 py-2 md:hidden">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search inventory..."
            type="search"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;