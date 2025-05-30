import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  
const loginUser = async (credentials) => {
  setIsLoading(true);
  try {
    const response = await api.post(
      '/api/auth/login',            
      credentials,                  
      {                             // 3) config / headers
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);

      // use the fresh value if you want to log it
      console.log(response.data.token);

      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setIsLoading(false);
  }
};


const registerUser = async (credentials) => {
  setIsLoading(true);
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/register', 
      credentials,                               
      {
        headers: { 'Content-Type': 'application/json' }, // config / headers
      }
    );

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Registration successful!');
    } else {
      toast.error(response.data.message);
      console.log(response.data);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    toast.error(
      error.response?.data?.message || 'Registration failed. Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
  };

  const logoutUser  = async () => {
    try {
      localStorage.removeItem('token');
      setToken('');
      setUser (null);
      setIsAuthenticated(false);
      navigate('/login');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed')
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        token,
        setToken,
        loginUser ,
        registerUser ,
        logoutUser ,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
