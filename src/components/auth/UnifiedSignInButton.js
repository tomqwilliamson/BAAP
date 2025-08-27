import React from 'react';
import SignInButton from './SignInButton';
import MockSignInButton from './MockSignInButton';

const UnifiedSignInButton = ({ className = "", children }) => {
  // Check if mock auth is enabled via environment variable
  const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

  if (useMockAuth) {
    return (
      <MockSignInButton className={className}>
        {children}
      </MockSignInButton>
    );
  }

  return (
    <SignInButton className={className}>
      {children}
    </SignInButton>
  );
};

export default UnifiedSignInButton;