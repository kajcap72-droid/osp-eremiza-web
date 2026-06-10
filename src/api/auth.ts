// ============================================
// SERWIS AUTENTYKACJI e-Remiza
// ============================================
import { apiClient } from './client';
import { API_CONFIG } from './config';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number | string;
    username: string;
    displayName: string;
    email?: string;
    role: 'admin' | 'naczelnik' | 'druh' | 'kierowca' | 'ratownik';
    permissions: string[];
    jednostka?: {
      id: number | string;
      nazwa: string;
      typ: 'OSP' | 'JRG' | 'PSK';
    };
  };
  expiresAt?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}

class AuthService {
  private refreshPromise: Promise<string> | null = null;

  /**
   * Logowanie użytkownika
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials, { auth: false });
      
      // Zapisz token i dane użytkownika
      localStorage.setItem(API_CONFIG.tokenKey, response.token);
      localStorage.setItem(API_CONFIG.userKey, JSON.stringify(response.user));
      
      if (response.refreshToken) {
        localStorage.setItem(API_CONFIG.refreshTokenKey, response.refreshToken);
      }

      if (response.expiresAt) {
        localStorage.setItem('eremiza_token_expires', response.expiresAt);
      }

      return response;
    } catch (error: any) {
      console.error('[AuthService] Login failed:', error);
      throw error;
    }
  }

  /**
   * Wylogowanie
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem(API_CONFIG.refreshTokenKey);
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('[AuthService] Logout API call failed:', error);
    } finally {
      // Zawsze czyść lokalne dane
      localStorage.removeItem(API_CONFIG.tokenKey);
      localStorage.removeItem(API_CONFIG.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.userKey);
      localStorage.removeItem('eremiza_token_expires');
    }
  }

  /**
   * Odświeżenie tokenu
   */
  async refreshToken(): Promise<string> {
    // Zapobiegaj równoległym odświeżeniom
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = localStorage.getItem(API_CONFIG.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const response = await apiClient.post<RefreshTokenResponse>(
          '/auth/refresh',
          { refreshToken },
          { auth: false }
        );

        localStorage.setItem(API_CONFIG.tokenKey, response.token);
        
        if (response.refreshToken) {
          localStorage.setItem(API_CONFIG.refreshTokenKey, response.refreshToken);
        }

        if (response.expiresAt) {
          localStorage.setItem('eremiza_token_expires', response.expiresAt);
        }

        return response.token;
      } catch (error) {
        // Jeśli odświeżenie się nie powiedzie, wyloguj
        await this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Sprawdź czy token jest aktualny
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('eremiza_token_expires');
    if (!expiresAt) return false;
    
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minut przed wygaśnięciem
    
    return now >= (expiry - buffer);
  }

  /**
   * Pobierz aktualnego użytkownika
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const userJson = localStorage.getItem(API_CONFIG.userKey);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Sprawdź czy użytkownik jest zalogowany
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(API_CONFIG.tokenKey);
  }

  /**
   * Zarejestruj token FCM dla powiadomień push
   */
  async registerFcmToken(fcmToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/fcm-token', { token: fcmToken });
    } catch (error) {
      console.warn('[AuthService] FCM token registration failed:', error);
    }
  }
}

export const authService = new AuthService();
