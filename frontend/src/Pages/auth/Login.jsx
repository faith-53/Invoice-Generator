import { useState } from 'react';
import { Form, Card, Container } from 'react-bootstrap';
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
    <Container 
          className="mt-5" 
          style={{
            minHeight: 'calc(100vh - 120px)', 
            overflowY: 'auto',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
      <Card className="auth-card mx-auto">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group>
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
            <Form.Group>
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
            <button type="submit" className="w-100 mt-3 btn btn-primary">
              Login
            </button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/register">Need an account? Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;