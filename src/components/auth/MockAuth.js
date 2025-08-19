import React, { createContext, useContext, useState, useEffect } from 'react';

const MockAuthContext = createContext();

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return context;
};

export const MockAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('mockAuth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
  }, []);

  const login = (userData = null) => {
    const mockUser = userData || {
      id: 'mock-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      username: 'demo.user',
      idTokenClaims: {
        jobTitle: 'Solution Architect',
        given_name: 'Demo',
        family_name: 'User'
      }
    };

    setIsAuthenticated(true);
    setUser(mockUser);
    
    // Save to localStorage for persistence
    localStorage.setItem('mockAuth', JSON.stringify({
      isAuthenticated: true,
      user: mockUser
    }));
    
    return Promise.resolve();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('mockAuth');
    return Promise.resolve();
  };

  const value = {
    isAuthenticated,
    user,
    accounts: user ? [user] : [],
    login,
    logout
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

export default MockAuthContext;