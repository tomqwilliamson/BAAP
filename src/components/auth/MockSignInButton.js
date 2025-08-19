import React from 'react';
import { LogIn } from 'lucide-react';
import { useMockAuth } from './MockAuth';

const MockSignInButton = ({ className = "", children }) => {
  const { login } = useMockAuth();

  const handleLogin = () => {
    if (login) {
      login().then(() => {
        window.location.href = '/app/dashboard';
      }).catch((error) => {
        console.error('Mock login failed:', error);
      });
    }
  };

  const defaultClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors";
  const finalClasses = className || defaultClasses;

  return (
    <button
      onClick={handleLogin}
      className={finalClasses}
    >
      <LogIn className="w-4 h-4 mr-2" />
      {children || 'Sign In (Dev Mode)'}
    </button>
  );
};

export default MockSignInButton;