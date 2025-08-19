import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMockAuth } from './MockAuth';

const MockProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useMockAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default MockProtectedRoute;