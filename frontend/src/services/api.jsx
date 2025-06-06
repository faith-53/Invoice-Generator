import axios from 'axios';
console.log('API base URL:', process.env.REACT_APP_BASE_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ critical
  }
  return config;
});


export default api;