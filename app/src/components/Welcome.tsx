import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';

const Welcome: React.FC = () => {
  const { signOut, isLoading } = useAuth();
  const { roles } = useSession();

  return (
    <div className="welcome-container">
      <h1>Welcome!</h1>
      <p>You have successfully signed in.</p>
      {roles.length > 0 && (
        <p className="mb-4">
          Your roles: {roles.join(', ')}
        </p>
      )}
      <Button 
        variant="outline-primary" 
        onClick={signOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          'Sign Out'
        )}
      </Button>
    </div>
  );
};

export default React.memo(Welcome); 