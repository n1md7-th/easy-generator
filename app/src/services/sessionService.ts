import { STORAGE_KEYS } from '../constants/storage';
import { AuthResponse } from '../api/types';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  roles: string[];
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

class SessionService {
  private tokenData: TokenData | null = null;

  constructor() {
    this.loadTokenData();
  }

  private loadTokenData(): void {
    const data = localStorage.getItem(STORAGE_KEYS.TOKEN_DATA);
    this.tokenData = data ? JSON.parse(data) : null;
  }

  getAccessToken(): string | null {
    if (!this.tokenData) return null;
    
    if (Date.now() >= this.tokenData.accessTokenExpiresAt) {
      return null;
    }

    return this.tokenData.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.tokenData) return null;

    if (Date.now() >= this.tokenData.refreshTokenExpiresAt) {
      this.clearSession();
      return null;
    }

    return this.tokenData.refreshToken;
  }

  getRoles(): string[] {
    return this.tokenData?.roles || [];
  }

  saveSession(authResponse: AuthResponse): void {
    this.tokenData = {
      accessToken: authResponse.accessToken.value,
      refreshToken: authResponse.refreshToken.value,
      roles: authResponse.roles,
      accessTokenExpiresAt: Date.now() + authResponse.accessToken.expiresInSec * 1000,
      refreshTokenExpiresAt: Date.now() + authResponse.refreshToken.expiresInSec * 1000,
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN_DATA, JSON.stringify(this.tokenData));
  }

  clearSession(): void {
    this.tokenData = null;
    localStorage.removeItem(STORAGE_KEYS.TOKEN_DATA);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const sessionService = new SessionService(); 