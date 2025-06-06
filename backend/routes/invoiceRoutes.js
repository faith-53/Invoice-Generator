const express = require('express');
const invoiceRoutes = express.Router();
const { protect } = require('../middlewares/auth');
const {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    downloadInvoice,
    sendInvoice
} = require('../controllers/invoiceController');

invoiceRoutes.get('/list',protect ,getInvoices);
invoiceRoutes.post('/create', protect,createInvoice);
invoiceRoutes.get('/:id',protect, getInvoice);
invoiceRoutes.put('/update/:id',protect, updateInvoice);
invoiceRoutes.post('/delete/:id', protect, deleteInvoice);
invoiceRoutes.get('/download/:id', protect, downloadInvoice);
invoiceRoutes.post('/send/:id', protect, sendInvoice);

module.exports = invoiceRoutes; 
