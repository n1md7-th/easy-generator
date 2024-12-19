import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { signIn, isLoading, error, fieldErrors } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check for email from successful sign-up
    const lastSignUpEmail = sessionStorage.getItem('lastSignUpEmail');
    if (lastSignUpEmail) {
      setEmail(lastSignUpEmail);
      setShowSuccessMessage(true);
      // Clean up after showing the message
      sessionStorage.removeItem('lastSignUpEmail');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  return (
    <div className="auth-container">
      <h2 className="mb-4">Sign In</h2>
      
      {showSuccessMessage && (
        <Alert 
          variant="success" 
          className="mb-4"
          onClose={() => setShowSuccessMessage(false)} 
          dismissible
        >
          <Alert.Heading>Registration Successful!</Alert.Heading>
          <p>
            Your account has been created successfully. Please sign in with your email and password.
          </p>
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!fieldErrors.email}
            autoComplete="off"
            required
            autoFocus={!email} // Autofocus only if email is not prefilled
          />
          {fieldErrors.email && (
            <Form.Text className="form-error">{fieldErrors.email}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!fieldErrors.password}
            required
            autoFocus={!!email} // Autofocus if email is prefilled
            autoComplete="off"
          />
          {fieldErrors.password && (
            <Form.Text className="form-error">{fieldErrors.password}</Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Sign In'
          )}
        </Button>
      </Form>
      <div className="text-center mt-3">
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default SignIn; 