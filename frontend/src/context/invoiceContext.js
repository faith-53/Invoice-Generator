import React, { createContext, useState } from 'react';
import api from '../services/api';
import { toast } from "react-toastify"

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]); // Changed to manage a list of invoices
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get all invoices
  const getInvoices = async (params = {}) => {
  try {
    setLoading(true);
    const response = await api.get('/api/invoices/list', { params });
    setInvoices(response.data);
    setError(null);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch invoices');
    console.error('Error fetching invoices:', err);
    toast.error('Failed to fetch invoices');
  } finally {
    setLoading(false);
  }
};

// Get single invoice
  const getInvoice = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/invoices/${id}`); // Fixed the endpoint
      return response.data;
    } catch (err) {
      console.error('Error fetching invoice:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create invoice
  const createInvoice = async (invoiceData) => {
    try {
      
      const response = await api.post('/api/invoices/create', invoiceData);; // Pass invoiceData
      await getInvoices(); // Refresh the list of invoices
      return response.data; // Return the created invoice
    } catch (error) {
      console.error("Error adding invoice:", error.response ? error.response.data : error.message);
      throw error; // Throw error for handling in the component
    }
  };

  // Update invoice
  const updateInvoice = async (invoiceId, invoiceData) => {
    try {
      const response = await api.put(`/api/invoices/update/${invoiceId}`, invoiceData);
      await getInvoices(); // Refresh the list of invoices
      return response.data; // Return the updated invoice
    } catch (error) {
      console.error("Error updating invoice:", error.response ? error.response.data : error.message);
      throw error; // Throw error for handling in the component
    }
  };

  // Delete invoice
  const deleteInvoice = async (id) => {
    try {
      await api.delete(`/api/invoices/delete/${id}`);
      await getInvoices(); // Refresh the list of invoices
    } catch (error) {
      console.error("Error deleting invoice:", error.response ? error.response.data : error.message);
      throw error; // Throw error for handling in the component
    }
  };

  // Download invoice as PDF
  const downloadInvoice = async (invoiceId) => {
    
    const response = await api.get(`/api/invoices/download/${invoiceId}/download`);
    return response.data;
  };

  // Send invoice via email
  const sendInvoice = async (invoiceId) => {
    const response = await api.post(`/api/invoices/send/${invoiceId}/send`);
    return response.data;
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices, // Provide the list of invoices
        error,
        loading,
        getInvoice,
        getInvoices,
        updateInvoice,
        deleteInvoice,
        createInvoice,
        sendInvoice,
        downloadInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = React.useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
