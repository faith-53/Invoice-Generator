import React, { useState } from 'react';
import { Form, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { loginUser } = useAuth();


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await loginUser(credentials); // ✅ no need to pass headers here
    navigate('/invoices');
  } catch (error) {
    toast.error('Please check your credentials and try again.');
    console.error(error);
  }
};


  return (
    <div className="container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <button type="submit" className="w-100 mt-3 btn btn-primary">
              Login
            </button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/register">Need an account? Register</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;