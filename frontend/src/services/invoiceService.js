import axios from 'axios';

const API_URL = '/api/invoices';

// Get all invoices
const getInvoices = async (params = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get single invoice
const getInvoice = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(`${API_URL}/${invoiceId}`, config);
  return response.data;
};

// Create invoice
const createInvoice = async (invoiceData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.post(API_URL, invoiceData, config);
  return response.data;
};

// Update invoice
const updateInvoice = async (invoiceId, invoiceData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.put(`${API_URL}/${invoiceId}`, invoiceData, config);
  return response.data;
};

// Delete invoice
const deleteInvoice = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.delete(`${API_URL}/${invoiceId}`, config);
  return response.data;
};

// Download invoice as PDF
const downloadInvoice = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  };
  const response = await axios.get(`${API_URL}/${invoiceId}/download`, config);
  return response.data;
};

// Send invoice via email
const sendInvoice = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.post(`${API_URL}/${invoiceId}/send`, {}, config);
  return response.data;
};

export {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  downloadInvoice,
  sendInvoice
};