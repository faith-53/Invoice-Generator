import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="text-center text-md-start align-items-center">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">InvoicePro</h5>
            <p className="mb-0 opacity-75">Simplify your billing with our professional invoice management system.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <p className="mb-2 opacity-75">
              <i className="bi bi-envelope me-2"></i>
              support@invoicepro.com
            </p>
            <p className="mb-0 opacity-75">
              <i className="bi bi-telephone me-2"></i>
              +254 700 123 456
            </p>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/terms" className="text-decoration-none text-white opacity-75 hover-opacity-100">
                  Terms & Conditions
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-decoration-none text-white opacity-75 hover-opacity-100">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/help" className="text-decoration-none text-white opacity-75 hover-opacity-100">
                  Help Center
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="border-light opacity-25 my-4" />
        <div className="text-center">
          <p className="mb-0 opacity-75">
            &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;