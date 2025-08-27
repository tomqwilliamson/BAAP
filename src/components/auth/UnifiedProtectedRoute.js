import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import MockProtectedRoute from './MockProtectedRoute';

const UnifiedProtectedRoute = ({ children }) => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

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