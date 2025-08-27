import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../../authConfig';
import { MockAuthProvider } from './MockAuth';

const msalInstance = new PublicClientApplication(msalConfig);

const AuthProvider = ({ children }) => {
  // Check if mock auth is enabled via environment variable
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

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