import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Button, Card, Row, Col, Table, Alert, Spinner, Badge, Modal} from 'react-bootstrap';
import { useInvoice } from '../../context/invoiceContext';
import { useAuth } from '../../context/authContext';
import { toast } from 'react-toastify';

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const { getInvoice, downloadInvoice, sendInvoice } = useInvoice();

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
      console.log('id from URL:', id);
      try {
        setLoading(true);
        console.log('Fetching invoice...');
        const response = await getInvoice(id);
        console.log('Invoice response:', response);
        setInvoice(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error(`Failed to load invoice: ${error.response?.data?.message || error.message}`);
        setLoading(false);
      }
    };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await downloadInvoice(id);
      
      // Create blob from the PDF data
      const blob = new Blob([response.data], { 
        type: 'application/pdf'
      });
      
      // Validate blob size
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoice.invoiceNumber || id}.pdf`);
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      
      // Cleanup after small delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
      }, 100);
      
      setLoading(false);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      let errorMessage;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to download invoice';
      }
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      setSending(true);
      const result = await sendInvoice(id);
      toast.success(result.data || 'Invoice sent successfully');
      setShowSendModal(false);
      setSending(false);
      
      // Refresh invoice data to update status
      const response = await getInvoice(id);
      setInvoice(response.data);
    } catch (error) {
      console.error('Send error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send invoice';
      toast.error(errorMessage);
      setSending(false);
    }
  };

  const getStatusBadge = () => {
    switch (invoice?.status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="info">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return <Alert variant="danger">Invoice not found</Alert>;
  }

  return (
    <div className="invoice-preview">
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <div>
              <h2>Invoice #{invoice.invoiceNumber}</h2>
              {getStatusBadge()}
            </div>
            <div>
              <Button
                variant="primary"
                onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="success"
                onClick={handleDownload}
                disabled={loading}
                className="mr-2"
              >
                {loading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button
                variant="info"
                onClick={() => setShowSendModal(true)}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send to Client'}
              </Button>
            </div>
          </div>

          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>From</Card.Header>
                  <Card.Body>
                    <h5>{user?.company || 'Company Name'}</h5>
                    <p>{user?.address}</p>
                    <p>Email: {user?.email}</p>
                    {user?.phone && <p>Phone: {user.phone}</p>}
                  </Card.Body>

              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Bill To</Card.Header>
                <Card.Body>
                  <h5>{invoice.client.name}</h5>
                  <p>{invoice.client.address}</p>
                  <p>Email: {invoice.client.email}</p>
                  {invoice.client.phone && <p>Phone: {invoice.client.phone}</p>}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <p>
                <strong>Invoice Date:</strong> {invoice.createdAt}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Due Date:</strong> {invoice.dueDate}
              </p>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.rate.toFixed(2)}</td>
                  <td>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row>
            <Col md={{ span: 4, offset: 8 }}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td>${invoice.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Tax ({invoice.taxRate}%):</strong></td>
                    <td>${invoice.taxAmount.toFixed(2)}</td>
                  </tr>
                  {invoice.discount > 0 && (
                    <tr>
                      <td><strong>Discount:</strong></td>
                      <td>-${invoice.discount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>Total:</strong></td>
                    <td>${invoice.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {invoice.notes && (
            <Card className="mt-4">
              <Card.Header>Notes</Card.Header>
              <Card.Body>
                <p>{invoice.notes}</p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>

      {/* Send Invoice Modal */}
      <Modal show={showSendModal} onHide={() => setShowSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This will send the invoice to <strong>{invoice.client.email}</strong>.
            Are you sure you want to proceed?
          </p>
          <p className="text-muted">
            A PDF copy of the invoice will be attached to the email.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSendModal(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendInvoice}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Invoice'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoicePreview;