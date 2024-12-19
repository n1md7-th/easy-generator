export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
  confirmPassword: string;
}

interface Token {
  value: string;
  expiresInSec: number;
}

export interface AuthResponse {
  accessToken: Token;
  refreshToken: Token;
  roles: string[];
}

export interface SignUpResponse {
  uuid: string;
  email: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}
