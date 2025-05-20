import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';

const Header = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className='nav nav-pills flex-column flex-sm-row'>
      <Navbar.Brand as={Link} to="/">
        Invoice App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/invoices">
            Invoices
          </Nav.Link>
        </Nav>
        <Nav>
          <Navbar.Text className="mr-3">
            Welcome, {user?.name}
          </Navbar.Text>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;