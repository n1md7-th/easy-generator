import { AuthResponse } from '../api/types';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  roles: string[];
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

class TokenService {
  private refreshTimeout?: NodeJS.Timeout;

  saveTokens(authResponse: AuthResponse): void {
    const tokenData: TokenData = {
      accessToken: authResponse.accessToken.value,
      refreshToken: authResponse.refreshToken.value,
      roles: authResponse.roles,
      accessTokenExpiresAt: Date.now() + authResponse.accessToken.expiresInSec * 1000,
      refreshTokenExpiresAt: Date.now() + authResponse.refreshToken.expiresInSec * 1000,
    };

    localStorage.setItem('tokenData', JSON.stringify(tokenData));
    this.scheduleTokenRefresh();
  }

  getTokenData(): TokenData | null {
    const data = localStorage.getItem('tokenData');
    return data ? JSON.parse(data) : null;
  }

  getAccessToken(): string | null {
    const tokenData = this.getTokenData();
    if (!tokenData) return null;

    // If access token is expired, return null
    if (Date.now() >= tokenData.accessTokenExpiresAt) {
      return null;
    }

    return tokenData.accessToken;
  }

  getRefreshToken(): string | null {
    const tokenData = this.getTokenData();
    if (!tokenData) return null;

    // If refresh token is expired, clear everything
    if (Date.now() >= tokenData.refreshTokenExpiresAt) {
      this.clearTokens();
      return null;
    }

    return tokenData.refreshToken;
  }

  clearTokens(): void {
    localStorage.removeItem('tokenData');
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  private scheduleTokenRefresh(): void {
    const tokenData = this.getTokenData();
    if (!tokenData) return;

    // Clear any existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Calculate when to refresh (30 seconds before expiry)
    const refreshTime = tokenData.accessTokenExpiresAt - Date.now() - 30000;
    
    if (refreshTime <= 0) {
      // Token is already expired or about to expire, refresh immediately
      void this.refreshAccessToken();
    } else {
      // Schedule refresh
      this.refreshTimeout = setTimeout(() => {
        void this.refreshAccessToken();
      }, refreshTime);
    }
  }

  private async refreshAccessToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return;

    try {
      const response = await fetch(`${import.meta.env.EASY_GEN_API_URL}/api/v1/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const authResponse: AuthResponse = await response.json();
      this.saveTokens(authResponse);
    } catch (error: unknown) {
      this.clearTokens();
      if (error instanceof Error) {
        console.error('Token refresh failed:', error.message);
      } else {
        console.error('Token refresh failed with unknown error');
      }
      // Redirect to login page
      window.location.href = '/signin';
    }
  }
}

export const tokenService = new TokenService(); 