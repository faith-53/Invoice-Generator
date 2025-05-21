import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import api from '../services/api'; 
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser  = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      });
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setUser (response.data.user); 
        setIsAuthenticated(true);
        navigate('/invoices');
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser  = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      });
   
      console.log(response.data);
      navigate('/login');
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // You might want to handle this differently
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser  = async () => {
    try {
      localStorage.removeItem('token');
      setUser (null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginUser ,
        registerUser ,
        logoutUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
