import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 fixed-bottom">
      <Container>
        <Row className="text-center text-md-start align-items-center">
          <Col md={4} className=" mb-md-0">
            <h5 className="fw-bold">InvoicePro</h5>
            <p className="mb-0">Simplify your billing.</p>
          </Col>
          <Col md={4} className="mb-md-0">
            <h6>Contact Us</h6>
            <p className="mb-0">Email: support@invoicepro.com</p>
            <p className="mb-0">Phone: +254 700 123 456</p>
          </Col>
          <Col md={4}>
            <h6>Links</h6>
            <ul className="list-unstyled">
              <li><a href="/terms" className="text-light text-decoration-none">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="/help" className="text-light text-decoration-none">Help Center</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="border-light my-3" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} InvoicePro. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
