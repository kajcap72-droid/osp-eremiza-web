// ============================================
// AUTH CONTEXT - Zarządzanie stanem autentykacji
// ============================================
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, LoginRequest, LoginResponse } from '../api/auth';
import { API_CONFIG } from '../api/config';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sprawdź czy użytkownik jest już zalogowany przy starcie
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Automatyczne odświeżanie tokenu
  useEffect(() => {
    const checkTokenExpiry = async () => {
      if (!authService.isAuthenticated()) return;
      
      if (authService.isTokenExpired()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error('[Auth] Token refresh failed:', error);
          setUser(null);
        }
      }
    };

    // Sprawdź co 5 minut
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Jeśli w trybie mock, użyj mock danych
      if (API_CONFIG.mode === 'mock') {
        // Symuluj delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: LoginResponse['user'] = {
          id: 1,
          username: credentials.username,
          displayName: 'Jan Kowalski',
          email: 'j.kowalski@osp.pl',
          role: 'naczelnik',
          permissions: ['admin'],
          jednostka: {
            id: 1,
            nazwa: 'OSP Kraków-Swoszowice',
            typ: 'OSP',
          },
        };

        // Zapisz mock dane
        localStorage.setItem(API_CONFIG.tokenKey, 'mock-token-' + Date.now());
        localStorage.setItem(API_CONFIG.userKey, JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }

      // Prawdziwe logowanie
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsLoading(false);
    } catch (err: any) {
      console.error('[Auth] Login failed:', err);
      
      let errorMessage = 'Nie udało się zalogować';
      
      if (err.status === 401) {
        errorMessage = 'Nieprawidłowy login lub hasło';
      } else if (err.status === 403) {
        errorMessage = 'Brak uprawnień do logowania';
      } else if (err.status === 0) {
        errorMessage = 'Błąd połączenia z serwerem. Sprawdź konfigurację proxy.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn('[Auth] Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
