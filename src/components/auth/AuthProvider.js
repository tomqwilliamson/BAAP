import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../../authConfig';
import { MockAuthProvider } from './MockAuth';

const msalInstance = new PublicClientApplication(msalConfig);

const AuthProvider = ({ children }) => {
  // For development, always use mock auth unless explicitly configured otherwise
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH !== 'false' && 
                      (process.env.NODE_ENV === 'development' || 
                       process.env.REACT_APP_USE_MOCK_AUTH === 'true');

  if (useMockAuth) {
    return (
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};

export default AuthProvider;