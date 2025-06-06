import React, { createContext, useState } from 'react';
import api from '../services/api';
import { toast } from "react-toastify"
import { useParams } from 'react-router-dom';

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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch invoices';
      setError(errorMessage);
      console.error('Error fetching invoices:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
// Get single invoice

  const getInvoice = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/invoices/${id}`);
      console.log('Raw API response:', response);  // Add this log
      return response;  // Return the entire response
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
    try {
      const response = await api.get(`/api/invoices/download/${invoiceId}`, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      if (error.response?.data) {
        try {
          // Try to parse as JSON first
          const errorMessage = new TextDecoder().decode(error.response.data);
          try {
            error.response.data = JSON.parse(errorMessage);
          } catch (parseError) {
            // If JSON parsing fails, use the text message directly
            error.response.data = { message: errorMessage };
          }
        } catch (decodeError) {
          // If decoding fails, provide a generic error
          error.response.data = { message: 'Failed to download invoice' };
        }
      }
      throw error;
    }
  };

  // Send invoice via email
  const sendInvoice = async (invoiceId) => {
    try {
      const response = await api.post(`/api/invoices/send/${invoiceId}`, {});
      return response.data;
    } catch (error) {
      console.error("Error sending invoice:", error);
      if (error.response?.data?.message) {
        throw error;
      } else {
        throw new Error(error.message || 'Failed to send invoice');
      }
    }
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
