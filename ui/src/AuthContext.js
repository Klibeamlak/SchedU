import React, { createContext, useContext, useState, useEffect } from 'react';

// In effect, this file handles the authentification token 

const AuthContext = createContext();

// The main holder
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') // Convert to boolean
  );
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // Handler for logging in 
  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  // Handler for logging out
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
  };

  useEffect(() => {
    // Update isAuthenticated state on load based on the presence of a token
    setIsAuthenticated(!!localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
