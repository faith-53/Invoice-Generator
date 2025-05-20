import axios from 'axios';
//import api from './api';


// Register user
const register = async (userData) => {
  const response = await axios.post('http://localhost:5000/api/auth/register', userData);
  return response.data;
};

// Login user
const login = async (credentials) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = async () => {
  localStorage.removeItem('token');
};



export { register, login, logout };