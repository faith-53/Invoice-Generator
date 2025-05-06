import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useAlert } from '../../context/alertContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { loginUser } = useAuth();
  const { alert, showAlert } = useAlert();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(credentials);
    } catch (error) {
      showAlert('Invalid credentials');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
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
            <Button type="submit" className="w-100 mt-3">
              Login
            </Button>
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