const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Invoice = require('../models/invoice');

const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  downloadInvoice,
  sendInvoice
} = require('../controllers/invoiceController');

router
  .route('/')
  .get(protect, advancedResults(Invoice, 'user'), getInvoices)
  .post(protect, createInvoice);

router
  .route('/:id')
  .get(protect, getInvoice)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

router.route('/:id/download').get(protect, downloadInvoice);
router.route('/:id/send').post(protect, sendInvoice);

module.exports = router;