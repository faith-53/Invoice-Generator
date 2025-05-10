const Invoice = require('../models/invoice.js');
const sendEmail = require('../utils/email.js');
const generatePDF = require('../utils/generatePDF.js');

// Get all invoices
// @route   GET /api/invoices
const getInvoices = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

//Get single invoice
// @route   GET /api/invoices/:id
const getInvoice = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).populate({
    path: 'user',
    select: 'name email company address phone'
  });

  if (!invoice) {
    return res.status(404).json({'message':`Invoice not found with id of ${req.params.id}`});
  }

  // Make sure user is invoice owner
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({'message':`User ${req.user.id} is not authorized to access this invoice`});
  }

  res.status(200).json({
    success: true,
    data: invoice
  });
};

// Create new invoice
// @route   POST /api/invoices
const createInvoice = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Calculate amounts
  const { items, taxRate, discount } = req.body;
  
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
  const invoice = await Invoice.findById(req.params.id).populate({
    path: 'user',
    select: 'name email company address phone'
  });

  if (!invoice) {
    return res.status(404).json({'message':`Invoice with id of ${req.params.id} not found`}); 
  }

  // Make sure user is invoice owner
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({'message': `User ${req.user.id} is not authorized to access this invoice`});
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
};

// @desc    Send invoice via email
// @route   POST /api/invoices/:id/send
// @access  Private
const sendInvoice = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).populate({
    path: 'user',
    select: 'name email company address phone'
  });

  if (!invoice) {
    return res.status(404).json({'message':`Invoice with id of ${req.params.id} not found`}); 
  }

  // Make sure user is invoice owner
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({'message': `User ${req.user.id} is not authorized to access this invoice`});
  }

  // Generate PDF
  const pdfDoc = await generatePDF(invoice);

  // Create email message
  const message = `
    <h1>Invoice ${invoice.invoiceNumber}</h1>
    <p>Dear ${invoice.client.name},</p>
    <p>Please find attached your invoice for your records.</p>
    <p>Total Amount: $${invoice.total.toFixed(2)}</p>
    <p>Due Date: ${invoice.dueDate.toLocaleDateString()}</p>
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
    console.error(err);
    return res.status(500).json({'message':'Email could not be sent'}); 
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