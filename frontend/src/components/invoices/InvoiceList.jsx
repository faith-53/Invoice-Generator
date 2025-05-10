import React, { useState, useEffect } from 'react';
import {Table, Badge, Form, Row, Col, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getInvoices } from '../../context/invoiceContext';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.status !== 'all') params.status = filters.status;
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;

        const response = await getInvoices(params);
        setInvoices(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, [filters]);

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
        
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
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
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
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
                  <td>{new Date(invoice.createdAt)}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <Badge variant={getStatusBadge(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      as={Link}
                      to={`/invoices/${invoice._id}`}
                      variant="info"
                      size="sm"
                      className="mr-2 btn btn-secondary"
                    >
                      View
                    </button>
                    <button
                      as={Link}
                      to={`/invoices/${invoice._id}/edit`}
                      variant="secondary"
                      className='btn btn-secodary'
                      size="sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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