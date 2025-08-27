import React from 'react';
import LoginPage from './LoginPage';
import MockLoginPage from './MockLoginPage';

const UnifiedLoginPage = () => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

  if (useMockAuth) {
    return <MockLoginPage />;
  }

  return <LoginPage />;
};

export default UnifiedLoginPage;