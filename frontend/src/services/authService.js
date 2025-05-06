import axios from 'axios';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = async () => {
  localStorage.removeItem('token');
};

// Get user data
const getMe = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

export { register, login, logout, getMe };