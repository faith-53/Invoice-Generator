const express = require('express');
const router = express.Router();
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

// Route for getting and creating invoices
router.route('/')
    .get(protect, getInvoices)      // Get all invoices
    .post(protect, createInvoice);  // Create a new invoice

// Route for handling specific invoice by ID
router.route('/:id')
    .get(protect, getInvoice)       // Get a specific invoice
    .put(protect, updateInvoice)     // Update a specific invoice
    .delete(protect, deleteInvoice); // Delete a specific invoice

// Route for downloading and sending invoices
router.route('/:id/download')
    .get(protect, downloadInvoice);  // Download a specific invoice

router.route('/:id/send')
    .post(protect, sendInvoice);     // Send a specific invoice

module.exports = router; // Use CommonJS export
