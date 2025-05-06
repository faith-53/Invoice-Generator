const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      // Add header
      generateHeader(doc, invoice);
      // Add customer information
      generateCustomerInformation(doc, invoice);
      // Add invoice items table
      generateInvoiceTable(doc, invoice);
      // Add footer
      generateFooter(doc, invoice);

      resolve(doc);
    } catch (err) {
      reject(err);
    }
  });
};

function generateHeader(doc, invoice) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text(invoice.user.company, 50, 50)
    .fontSize(10)
    .text(invoice.user.address, 50, 70)
    .text(`Phone: ${invoice.user.phone}`, 50, 85)
    .text(`Email: ${invoice.user.email}`, 50, 100)
    .moveDown();

  // Invoice title and number
  doc
    .fontSize(20)
    .text('INVOICE', 200, 50, { align: 'right' })
    .fontSize(10)
    .text(`Invoice Number: ${invoice.invoiceNumber}`, 200, 70, { align: 'right' })
    .text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 200, 85, { align: 'right' })
    .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 200, 100, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Bill To:', 50, 150)
    .fontSize(10)
    .text(invoice.client.name, 50, 170)
    .text(invoice.client.address, 50, 185)
    .text(`Email: ${invoice.client.email}`, 50, 200)
    .text(`Phone: ${invoice.client.phone}`, 50, 215)
    .moveDown();
}

function generateInvoiceTable(doc, invoice) {
  const invoiceTableTop = 280;
  const itemCodeX = 50;
  const descriptionX = 100;
  const quantityX = 350;
  const priceX = 400;
  const amountX = 450;

  doc
    .fontSize(10)
    .text('#', itemCodeX, invoiceTableTop, { bold: true })
    .text('Description', descriptionX, invoiceTableTop, { bold: true })
    .text('Qty', quantityX, invoiceTableTop, { bold: true })
    .text('Rate', priceX, invoiceTableTop, { bold: true })
    .text('Amount', amountX, invoiceTableTop, { bold: true });

  let i = 0;
  for (const item of invoice.items) {
    const position = invoiceTableTop + 25 + i * 25;
    doc
      .fontSize(10)
      .text(i + 1, itemCodeX, position)
      .text(item.description, descriptionX, position)
      .text(item.quantity, quantityX, position, { width: 40, align: 'right' })
      .text(`$${item.rate.toFixed(2)}`, priceX, position, { width: 60, align: 'right' })
      .text(`$${item.amount.toFixed(2)}`, amountX, position, { width: 60, align: 'right' });
    i++;
  }

  // Subtotal
  const subtotalPosition = invoiceTableTop + 25 + invoice.items.length * 25;
  doc
    .text('Subtotal:', priceX, subtotalPosition, { bold: true, align: 'right' })
    .text(`$${invoice.subtotal.toFixed(2)}`, amountX, subtotalPosition, { width: 60, align: 'right' });

  // Tax
  const taxPosition = subtotalPosition + 25;
  doc
    .text(`Tax (${invoice.taxRate}%):`, priceX, taxPosition, { bold: true, align: 'right' })
    .text(`$${invoice.taxAmount.toFixed(2)}`, amountX, taxPosition, { width: 60, align: 'right' });

  // Discount
  const discountPosition = taxPosition + 25;
  doc
    .text('Discount:', priceX, discountPosition, { bold: true, align: 'right' })
    .text(`$${invoice.discount.toFixed(2)}`, amountX, discountPosition, { width: 60, align: 'right' });

  // Total
  const totalPosition = discountPosition + 25;
  doc
    .fontSize(12)
    .text('Total:', priceX, totalPosition, { bold: true, align: 'right' })
    .text(`$${invoice.total.toFixed(2)}`, amountX, totalPosition, { width: 60, align: 'right' });
}

function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .text(invoice.notes, 50, 700, { align: 'center', width: 500 })
    .text('Thank you for your business!', 50, 730, { align: 'center', width: 500 });
}

module.exports = generatePDF;