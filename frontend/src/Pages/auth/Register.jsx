import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { toast } from 'react-toastify'

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    address: '',
    phone: ''
  });
  const [alert, setAlert] = useState(null);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(credentials); 
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <Container 
      className="mt-5 mb-5" 
      style={{
        minHeight: 'calc(150vh - 120px)', // Adjust based on navbar/footer height
        overflowY: 'auto',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}
    >
      <Card className="mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='name'>Name</Form.Label>
              <Form.Control
              id='name'
                type="text"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='email'>Email</Form.Label>
              <Form.Control
              id='email'
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='password'>Password</Form.Label>
              <Form.Control
              id='password'
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='company'>Company</Form.Label>
              <Form.Control
              id='company'
                type="text"
                name="company"
                value={credentials.company}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='address'>Address</Form.Label>
              <Form.Control
              id='address'
                type="text"
                name="address"
                value={credentials.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='phone'>Phone</Form.Label>
              <Form.Control
              id='phone'
                type="text"
                name="phone"
                value={credentials.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 mt-3">
              Create Account
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;