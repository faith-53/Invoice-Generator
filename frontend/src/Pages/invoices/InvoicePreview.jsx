import React from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';

const InvoicePreview = ({ invoice }) => {
  const {
    invoiceNumber,
    client,
    items,
    subtotal,
    taxRate,
    taxAmount,
    discount,
    total,
    notes,
    status,
    dueDate,
    createdAt,
    user
  } = invoice;

  return (
    <Card className="p-4 my-4">
      <h2 className="text-center mb-4">Invoice #{invoiceNumber}</h2>

      <Row className="mb-3">
        <Col md={6}>
          <h5>From:</h5>
          <p className="mb-1 fw-bold">{user?.company || 'Your Company Name'}</p>
          <p>{user?.name}</p>
          <p>{user?.address}</p>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
        </Col>
        <Col md={6}>
          <h5>To:</h5>
          <p className="mb-1 fw-bold">{client?.name}</p>
          <p>{client?.address}</p>
          <p>{client?.email}</p>
          <p>{client?.phone}</p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}><strong>Status:</strong> {status}</Col>
        <Col md={4}><strong>Issue Date:</strong> {new Date(createdAt).toLocaleDateString()}</Col>
        <Col md={4}><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</Col>
      </Row>

      <Table bordered responsive className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th className="text-end">Quantity</th>
            <th className="text-end">Rate</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.description}</td>
              <td className="text-end">{item.quantity}</td>
              <td className="text-end">{item.rate.toFixed(2)}</td>
              <td className="text-end">{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="justify-content-end">
        <Col md={6}>
          <Table borderless>
            <tbody>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td className="text-end">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Tax ({taxRate}%)</strong></td>
                <td className="text-end">${taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Discount</strong></td>
                <td className="text-end">-${discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td className="text-end fw-bold">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {notes && (
        <Row className="mt-3">
          <Col>
            <h6>Notes</h6>
            <p>{notes}</p>
          </Col>
        </Row>
      )}

      <hr />
      <p className="text-center text-muted small mb-0">
        Thank you for your business! | {user?.company || 'InvoicePro'}
      </p>
    </Card>
  );
};

export default InvoicePreview;
