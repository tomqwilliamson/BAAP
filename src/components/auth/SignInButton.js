import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../authConfig';
import { LogIn } from 'lucide-react';

const SignInButton = ({ className = "", children }) => {
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === 'popup') {
      instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });
    }
  };

  const defaultClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors";
  const finalClasses = className || defaultClasses;

  return (
    <button
      onClick={() => handleLogin('redirect')}
      className={finalClasses}
    >
      <LogIn className="w-4 h-4 mr-2" />
      {children || 'Sign In'}
    </button>
  );
};

export default SignInButton;