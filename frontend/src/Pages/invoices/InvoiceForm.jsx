import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Alert, Spinner, Modal, Button } from 'react-bootstrap';
import { useForm } from '../../hooks/useForm';
import { useInvoice } from '../../context/invoiceContext';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const sanitizeNumber = (val) => (isNaN(val) ? '' : val);
  const { getInvoice, updateInvoice, createInvoice } = useInvoice();

  console.log('Form mounted with ID:', id); // Debug log

  const { values, setValues, handleChange, handleArrayChange } = useForm({
    client: {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    items:
    [
      {
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    invoiceNumber: '',
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    notes: '',
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      console.log('Fetching invoice for edit:', id); // Debug log
      setIsEdit(true);
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Making API call to fetch invoice:', id); // Debug log
      const response = await getInvoice(id);
      console.log('Received invoice data:', response); // Debug log
      
      if (response && response.data) {
        setValues({
          ...response.data,
        });
        console.log('Updated form values:', response.data); // Debug log
      } else {
        throw new Error('No invoice data received');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError(error.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setValues({
      ...values,
      items: [
        ...values.items,
        {
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...values.items];
    newItems.splice(index, 1);
    calculateTotals({ ...values, items: newItems });
  };

  const calculateItemAmount = (index) => {
    const newItems = [...values.items];
    const item = newItems[index];
    
    // Ensure we have valid numbers
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    
    newItems[index].amount = quantity * rate;
    calculateTotals({ ...values, items: newItems });
  };

  const calculateTotals = (data) => {
    const subtotal = data.items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0), 
      0
    );
    
    const taxRate = parseFloat(data.taxRate) || 0;
    const discount = parseFloat(data.discount) || 0;
    
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount - discount;
    
    setValues({
      ...data,
      subtotal,
      taxAmount,
      total
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await updateInvoice(id, values);
        console.log('Invoice updated successfully', 'success');
      } else {
        await createInvoice(values);
        console.log('Invoice created successfully', 'success');
      }
      navigate('/invoices');
    } catch (error) {
      console.log('Failed to save invoice');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading invoice data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className='card mb-5'>
      <div className='card-body'>
        <h2 className="mb-4">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <h4>Client Details</h4>
              <Button
                variant="link"
                onClick={() => setShowClientModal(true)}
              >
                Select from existing clients
              </Button>
              <Form.Group>
                <Form.Label htmlFor='name'>Name</Form.Label>
                <Form.Control
                id='name'
                  type="text"
                  name="client.name"
                  value={values.client.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='email'>Email</Form.Label>
                <Form.Control
                id='rmail'
                  type="email"
                  name="client.email"
                  value={values.client.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='address'>Address</Form.Label>
                <Form.Control
                id='address'
                  as="textarea"
                  rows={3}
                  name="client.address"
                  value={values.client.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='phone'>Phone</Form.Label>
                <Form.Control
                id='phone'
                  type="text"
                  name="client.phone"
                  value={values.client.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <h4>Invoice Details</h4>
              
              <Form.Group>
                <Form.Label htmlFor='status'>Status</Form.Label>
                <Form.Control
                id='status'
                  as="select"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  disabled={isEdit}
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='invoiceNumber'>Invoice Number</Form.Label>
                <Form.Control
                id='invoiceNumber'
                  type="text"
                  name="invoiceNumber"
                  value={values.invoiceNumber} // Controlled value
                  onChange={handleChange} // Update state on change
                />
            </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4">Items</h4>
          {values.items.map((item, index) => (
            <Row key={index} className="mb-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label htmlFor='description'>Description</Form.Label>
                  <Form.Control
                  id='description'
                    type="text"
                    name={`items[${index}].description`}
                    value={item.description}
                    onChange={handleArrayChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label htmlFor='quantity'>Quantity</Form.Label>
                  <Form.Control
                  id='quantiyt'
                    type="number"
                    min="1"
                    name={`items[${index}].quantity`}
                    value={sanitizeNumber(item.quantity)}
                    onChange={(e) => {
                      handleArrayChange(e);
                      calculateItemAmount(index);
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label htmlFor='rate'>Rate</Form.Label>
                  <Form.Control
                  id='rate'
                    type="number"
                    min="0"
                    step="1"
                    name={`items[${index}].rate`}
                    value={sanitizeNumber(item.rate)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0; // Default to 0 if invalid
                      handleArrayChange({
                        target: {
                          name: e.target.name,
                          value: value
                        }
                      });
                      calculateItemAmount(index);
                    }}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label htmlFor='amount'>Amount</Form.Label>
                  <Form.Control
                  id='amount'
                    type="number"
                    min="0"
                    step="0.01"
                    name={`items[${index}].amount`}
                    value={item.amount}
                    readOnly
                  />
                </Form.Group>
              </Col>
              
              <Col md={1} className="d-flex align-items-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  disabled={values.items.length <= 1}
                >
                  ×
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={handleAddItem} className="mb-3">
            Add Item
          </Button>

          <Row className="mt-3">
            <Col md={{ span: 4, offset: 8 }}>
              <Form.Group>
                <Form.Label htmlFor='subtotal'>Subtotal</Form.Label>
                <Form.Control
                id='subtotal'
                  type="number"
                  name="subtotal"
                  value={values.subtotal}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='taxRate'>Tax Rate (%)</Form.Label>
                <Form.Control
                id='taxRate'
                  type="number"
                  min="0"
                  max="100"
                  name="taxRate"
                  value={sanitizeNumber(values.taxRate)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    handleChange({
                      target: {
                        name: 'taxRate',
                        value: value
                      }
                    });
                    calculateTotals({
                      ...values,
                      taxRate: value
                    });
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='taxAmount'>Tax Amount</Form.Label>
                <Form.Control
                id='taxAmount'
                  type="number"
                  name="taxAmount"
                  value={values.taxAmount}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='discount'>Discount</Form.Label>
                <Form.Control
                id='discount'
                  type="number"
                  min="0"
                  name="discount"
                  value={sanitizeNumber(values.discount)}
                  onChange={(e) => {
                    handleChange(e);
                    calculateTotals({
                      ...values,
                      discount: parseFloat(e.target.value)
                    });
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor='total'>Total</Form.Label>
                <Form.Control
                id='total'
                  type="number"
                  name="total"
                  value={values.total}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label htmlFor='notes'>Notes</Form.Label>
            <Form.Control
            id='notes'
              as="textarea"
              rows={3}
              name="notes"
              value={values.notes}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </Form>
      </div>

      <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Client selection logic would go here */}
          <p>Client selection functionality to be implemented</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClientModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Set selected client logic
              setShowClientModal(false);
            }}
          >
            Select Client
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceForm;