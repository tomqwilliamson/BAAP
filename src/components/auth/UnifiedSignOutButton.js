import React from 'react';
import SignOutButton from './SignOutButton';
import MockSignOutButton from './MockSignOutButton';

const UnifiedSignOutButton = ({ className = "" }) => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true' || 
                      process.env.NODE_ENV === 'development' && 
                      !process.env.REACT_APP_AZURE_CLIENT_ID;

  if (useMockAuth) {
    return <MockSignOutButton className={className} />;
  }

  return <SignOutButton className={className} />;
};

export default UnifiedSignOutButton;