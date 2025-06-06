const Invoice = require('../models/invoice.js');
const sendEmail = require('../config/email.js');
const generatePDF = require('../utils/generatePDF.js');

// Get all invoices
// @route   GET /api/invoices/list
const getInvoices = async (req, res) => {
  try {
    console.log('Request user:', req.user);
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    console.log('Fetching invoices for user:', req.user._id);
    const invoices = await Invoice.find({ user: req.user._id });
    console.log('Found invoices:', invoices.length);
    
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

//Get single invoice
// @route   GET /api/invoices/:id
const getInvoice = async (req, res, next) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).json({ message: 'Invalid invoice ID' });
  }
  try {
    const invoice = await Invoice.findById(req.params.id).populate({
      path: 'user',
      select: 'name email company address phone'
    });

    if (!invoice) {
      return res.status(404).json({ message: `Invoice not found with id of ${req.params.id}` });
    }

    // 🔐 Ensure req.user is set by protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 🔐 Check user owns invoice or is admin
    if (invoice.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: `User ${req.user.id} is not authorized to access this invoice` });
    }

    res.status(200).json(invoice); 

  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Create new invoice
// @route   POST /api/invoices
const createInvoice = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Calculate amounts
  const { items, taxRate, discount, notes, status, client } = req.body;
  
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  
  req.body.subtotal = subtotal;
  req.body.taxAmount = taxAmount;
  req.body.total = total;

  const invoice = await Invoice.create(req.body);

  res.status(201).json({
    success: true,
    data: invoice
  });
};

//  Update invoice
// @route   PUT /api/invoices/:id

const updateInvoice = async (req, res, next) => {
  req.body.user = req.user.id;
  let invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({'message':`Invoice with id of ${req.params.id} not found`}); 
  }

  // Make sure user is invoice owner
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({'message': `User ${req.user.id} is not authorized to update this invoice`});
  }

  // Recalculate amounts if items are modified
  if (req.body.items) {
    const { items, taxRate, discount } = req.body;
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount - discount;
    
    req.body.subtotal = subtotal;
    req.body.taxAmount = taxAmount;
    req.body.total = total;
  }

  invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: invoice
  });
};

// Delete invoice
// @route   DELETE /api/invoices/:id
const deleteInvoice = async (req, res, next) => {
  req.body.user = req.user.id;
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({'message':`Invoice with id of ${req.params.id} not found`}); 
  }

  // Make sure user is invoice owner
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({'message': `User ${req.user.id} is not authorized to delete this invoice`});
  }

  await invoice.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
};

//Download invoice as PDF
// @route   GET /api/invoices/:id/download
const downloadInvoice = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized - Please log in' });
    }

    const invoice = await Invoice.findById(req.params.id).populate({
      path: 'user',
      select: 'name email company address phone'
    });

    if (!invoice) {
      return res.status(404).json({ message: `Invoice not found with id of ${req.params.id}` }); 
    }

    // Make sure user is invoice owner
    if (invoice.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: `User ${req.user.id} is not authorized to access this invoice` });
    }

    // Generate PDF
    const pdfDoc = await generatePDF(invoice);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`
    );

    // Send the PDF
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

// @desc    Send invoice via email
// @route   POST /api/invoices/:id/send
// @access  Private
const sendInvoice = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized - Please log in' });
    }

    const invoice = await Invoice.findById(req.params.id).populate({
      path: 'user',
      select: 'name email company address phone'
    });

    if (!invoice) {
      return res.status(404).json({ message: `Invoice not found with id of ${req.params.id}` }); 
    }

    // Make sure user is invoice owner
    if (invoice.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: `User ${req.user.id} is not authorized to access this invoice` });
    }

    // Generate PDF
    const pdfDoc = await generatePDF(invoice);

    // Format the due date if it exists
    const formattedDueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Not specified';

    // Create email message
    const message = `
      <h1>Invoice ${invoice.invoiceNumber}</h1>
      <p>Dear ${invoice.client.name},</p>
      <p>Please find attached your invoice for your records.</p>
      <p>Total Amount: $${invoice.total.toFixed(2)}</p>
      <p>Due Date: ${formattedDueDate}</p>
      <p>Thank you for your business!</p>
      <p>${invoice.user.company}</p>
    `;

    try {
      await sendEmail({
        email: invoice.client.email,
        subject: `Invoice ${invoice.invoiceNumber} from ${invoice.user.company}`,
        message,
        attachments: [
          {
            filename: `invoice_${invoice.invoiceNumber}.pdf`,
            content: pdfDoc
          }
        ]
      });

      // Update invoice status to sent
      invoice.status = 'sent';
      await invoice.save();

      res.status(200).json({
        success: true,
        data: 'Email sent successfully'
      });
    } catch (err) {
      console.error('Email sending error:', err);
      return res.status(500).json({ 
        message: 'Failed to send email',
        error: err.message
      }); 
    }
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  sendInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  downloadInvoice,
  getInvoice,
  getInvoices,
};