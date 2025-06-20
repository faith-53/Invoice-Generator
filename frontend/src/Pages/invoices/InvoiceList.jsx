import React, { useEffect, useState } from 'react';
import { Table, Badge, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useInvoice } from '../../context/invoiceContext';

const InvoiceList = () => {
  const { invoices, getInvoices, loading, error } = useInvoice(); // Use invoices from context
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
      try {
        const params = {};
        if (filters.status !== 'all') params.status = filters.status;
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;

        await getInvoices(params); // Call getInvoices without expecting a return value
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className='card'>
      <div className="card-body">
        <h2 className="mb-4">Invoices</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label htmlFor='status'>Status</Form.Label>
              <Form.Control
              id='status'
                as="select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label htmlFor='fromdate'>From Date</Form.Label>
              <Form.Control
              id='fromdate'
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label htmlFor='todate'>To Date</Form.Label>
              <Form.Control
              id='todate'
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Link to="/invoices/new" className='btn btn-primary'>
              New Invoice
            </Link>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.client.name}</td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <Badge variant={getStatusBadge(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/invoices/${invoice._id}`} className="btn btn-secondary btn-sm mr-2">
                      View
                    </Link>
                    <Link to={`/invoices/${invoice._id}/edit`} className='btn btn-secondary btn-sm'>
                      Edit
                    </Link>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceList;
