import api from '../services/api';

// Get all invoices
const getInvoices = async (params = {}) => {
  const response = await api.get('/invoices');
  return response.data;
};

// Get single invoice
const getInvoice = async (invoiceId) => {
  const response = await api.get(`/${invoiceId}`);
  return response.data;
};

// Create invoice
const createInvoice = async (invoiceData) => {
  const response = await api.post('/', invoiceData);
  return response.data;
};

// Update invoice
const updateInvoice = async (invoiceId, invoiceData) => {
  const response = await api.put(`/${invoiceId}`, invoiceData);
  return response.data;
};

// Delete invoice
const deleteInvoice = async (invoiceId) => {
  const response = await api.delete(`/${invoiceId}`);
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
  const response = await api.get(`/${invoiceId}/download`, config);
  return response.data;
};

// Send invoice via email
const sendInvoice = async (invoiceId) => {
  const response = await api.post(`/${invoiceId}/send`, {},);
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