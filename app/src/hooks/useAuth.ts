import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { SignInCredentials, SignUpCredentials, ApiError } from '../api/types';
import { sessionService } from '../services/sessionService';
import { STORAGE_KEYS } from '../constants/storage';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      const apiError = err as ApiError;
      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      } else {
        setError(apiError.message);
      }
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await apiClient.signIn(credentials);
      sessionService.saveSession(response);
      navigate('/');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, handleError]);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await apiClient.signUp(credentials);
      sessionStorage.setItem(STORAGE_KEYS.LAST_SIGNUP_EMAIL, response.email);
      navigate('/signin');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, handleError]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshToken = sessionService.getRefreshToken();
      if (refreshToken) {
        await apiClient.signOut(refreshToken);
      }
    } catch (err) {
      handleError(err);
    } finally {
      sessionService.clearSession();
      setIsLoading(false);
      navigate('/signin');
    }
  }, [navigate, handleError]);

  return {
    isLoading,
    error,
    fieldErrors,
    signIn,
    signUp,
    signOut,
  };
}; 