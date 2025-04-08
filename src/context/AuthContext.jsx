// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext with default values
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You can replace this with your authentication logic
    // For example, checking local storage for a logged-in user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoading(false)
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setLoading(false)
  };




  return (
    // <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
