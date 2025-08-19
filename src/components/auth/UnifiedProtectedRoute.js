import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import MockProtectedRoute from './MockProtectedRoute';

const UnifiedProtectedRoute = ({ children }) => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true' || 
                      process.env.NODE_ENV === 'development' && 
                      !process.env.REACT_APP_AZURE_CLIENT_ID;

  if (useMockAuth) {
    return (
      <MockProtectedRoute>
        {children}
      </MockProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

export default UnifiedProtectedRoute;