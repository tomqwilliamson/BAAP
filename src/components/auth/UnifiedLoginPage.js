import React from 'react';
import LoginPage from './LoginPage';
import MockLoginPage from './MockLoginPage';

const UnifiedLoginPage = () => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true' || 
                      process.env.NODE_ENV === 'development' && 
                      !process.env.REACT_APP_AZURE_CLIENT_ID;

  if (useMockAuth) {
    return <MockLoginPage />;
  }

  return <LoginPage />;
};

export default UnifiedLoginPage;