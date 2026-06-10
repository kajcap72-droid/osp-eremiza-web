// ============================================
// HOOK do pobierania danych z API z fallbackiem
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './client';
import { API_CONFIG } from './config';

interface UseApiDataOptions<T> {
  fallbackData?: T;
  enabled?: boolean;
  refreshInterval?: number; // ms
}

interface UseApiDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isLive: boolean; // czy dane z prawdziwego API
  refresh: () => Promise<void>;
}

/**
 * Hook do pobierania danych z API z automatycznym fallbackiem na mock data
 */
export function useApiData<T>(
  endpoint: string,
  options: UseApiDataOptions<T> = {}
): UseApiDataResult<T> {
  const { fallbackData, enabled = true, refreshInterval } = options;
  
  const [data, setData] = useState<T | null>(fallbackData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Jeśli tryb mock, użyj od razu fallback
    if (API_CONFIG.mode === 'mock') {
      setData(fallbackData || null);
      setIsLive(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
      setIsLive(true);
      setError(null);
    } catch (err: any) {
      console.warn(`[useApiData] API call failed for ${endpoint}:`, err);
      
      // Fallback na mock data w trybie hybrydowym
      if (API_CONFIG.mode === 'hybrid' && fallbackData) {
        console.info(`[useApiData] Using fallback data for ${endpoint}`);
        setData(fallbackData);
        setIsLive(false);
        setError(null);
      } else {
        setError(err.message || 'Błąd pobierania danych');
        setIsLive(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, fallbackData, enabled]);

  // Pobierz dane przy montowaniu
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Automatyczne odświeżanie
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, enabled]);

  return {
    data,
    isLoading,
    error,
    isLive,
    refresh: fetchData,
  };
}

/**
 * Hook do wysyłania mutacji (POST/PUT/DELETE)
 */
export function useApiMutation<TData, TResult = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  const mutate = useCallback(async (data?: TData): Promise<TResult | null> => {
    if (API_CONFIG.mode === 'mock') {
      // Symuluj delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setResult(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      let response: TResult;
      
      if (method === 'POST') {
        response = await apiClient.post<TResult>(endpoint, data);
      } else if (method === 'PUT') {
        response = await apiClient.put<TResult>(endpoint, data);
      } else {
        response = await apiClient.delete<TResult>(endpoint);
      }

      setResult(response);
      return response;
    } catch (err: any) {
      console.error(`[useApiMutation] ${method} ${endpoint} failed:`, err);
      setError(err.message || 'Błąd operacji');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, method]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    result,
    reset,
  };
}
