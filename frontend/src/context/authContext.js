import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { login, register, logout, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const userData = await login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      history.push('/');
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      await register(userData);
      history.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      history.push('/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);