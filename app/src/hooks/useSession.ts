import { useState, useCallback, useEffect, useMemo } from 'react';
import { sessionService } from '../services/sessionService';

const AUTH_CHECK_INTERVAL = 5000;

export const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionService.isAuthenticated(),
  );

  const checkAuth = useCallback(() => {
    const authState = sessionService.isAuthenticated();
    if (isAuthenticated !== authState) {
      setIsAuthenticated(authState);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(checkAuth, AUTH_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const roles = useMemo(() => sessionService.getRoles(), []);

  return { isAuthenticated, roles };
};
