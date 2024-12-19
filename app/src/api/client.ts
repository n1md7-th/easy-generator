import {
  SignInCredentials,
  SignUpCredentials,
  AuthResponse,
  SignUpResponse,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { sessionService } from '../services/sessionService';

class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.EASY_GEN_API_URL;
    if (!this.baseUrl) throw new Error('API URL not configured');
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Request-Id': uuidv4(),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleRefreshToken(): Promise<AuthResponse | null> {
    const refreshToken = sessionService.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/refresh`, {
        method: 'POST',
        headers: this.getHeaders(refreshToken),
      });

      if (!response.ok) return null;

      const data = await response.json();
      sessionService.saveSession(data);
      return data;
    } catch {
      sessionService.clearSession();
      window.location.href = '/signin';
      throw new Error('Session expired');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const accessToken = sessionService.getAccessToken();

    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(accessToken ?? undefined),
    });

    if (response.status === 401) {
      const refreshResult = await this.handleRefreshToken();
      if (refreshResult) {
        return this.request<T>(endpoint, options);
      }
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    sessionService.saveSession(response);
    return response;
  }

  async signUp(credentials: SignUpCredentials): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/api/v1/sign-up', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signOut(refreshToken: string): Promise<void> {
    return this.request<void>('/api/v1/sign-out', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export const apiClient = new ApiClient();
