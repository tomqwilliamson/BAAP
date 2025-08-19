import React from 'react';
import { LogOut } from 'lucide-react';
import { useMockAuth } from './MockAuth';

const MockSignOutButton = ({ className = "" }) => {
  const { logout } = useMockAuth();

  const handleLogout = () => {
    logout().then(() => {
      window.location.href = '/';
    });
  };

  return (
    <button
      onClick={handleLogout}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </button>
  );
};

export default MockSignOutButton;