import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, isLoading, error, fieldErrors } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp({
      name,
      email,
      password,
      confirmPassword,
    });
  };

  const handleError = (error: string) => {
    const errors = error.split(',');

    if (errors.length > 1) {
      return errors.map((text, key) => <li key={key}>{text}</li>);
    }

    return errors;
  };

  return (
    <div className="auth-container">
      <h2 className="mb-4">Sign Up</h2>
      {error && (
        <Alert variant="danger">
          <ul className="m-0">{handleError(error)}</ul>
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={!!fieldErrors.name}
            autoComplete="name"
            required
          />
          {fieldErrors.name && (
            <Form.Text className="form-error">{fieldErrors.name}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!fieldErrors.email}
            autoComplete="email"
            required
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
            autoComplete="off"
            required
          />
          {fieldErrors.password && (
            <Form.Text className="form-error">{fieldErrors.password}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={!!fieldErrors.confirmPassword}
            autoComplete="off"
            required
          />
          {fieldErrors.confirmPassword && (
            <Form.Text className="form-error">
              {fieldErrors.confirmPassword}
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
        </Button>
      </Form>
      <div className="text-center mt-3">
        <Link to="/signin">Already have an account? Sign In</Link>
      </div>
    </div>
  );
};

export default SignUp;
