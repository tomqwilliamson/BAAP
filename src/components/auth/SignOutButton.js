import React from 'react';
import { useMsal } from '@azure/msal-react';
import { LogOut } from 'lucide-react';

const SignOutButton = ({ className = "" }) => {
  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    if (logoutType === 'popup') {
      instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
        mainWindowRedirectUri: window.location.origin
      });
    } else if (logoutType === 'redirect') {
      instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    }
  };

  return (
    <button
      onClick={() => handleLogout('redirect')}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </button>
  );
};

export default SignOutButton;