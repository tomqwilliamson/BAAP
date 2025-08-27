import React from 'react';
import SignOutButton from './SignOutButton';
import MockSignOutButton from './MockSignOutButton';

const UnifiedSignOutButton = ({ className = "" }) => {
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

  if (useMockAuth) {
    return <MockSignOutButton className={className} />;
  }

  return <SignOutButton className={className} />;
};

export default UnifiedSignOutButton;