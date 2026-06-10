// ============================================
// HTTP CLIENT dla e-Remiza API
// ============================================
import { API_CONFIG } from './config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean; // czy dodać Authorization header
  signal?: AbortSignal;
}

class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(API_CONFIG.tokenKey);
  }

  private getHeaders(custom?: Record<string, string>, auth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...custom,
    };
    if (auth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: customHeaders, auth = true, signal } = options;
    const url = path.startsWith('http') ? path : `${API_CONFIG.baseUrl}${path}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(customHeaders, auth),
        body: body ? JSON.stringify(body) : undefined,
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => null) : await response.text();

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        throw new ApiError(
          'Network error — prawdopodobnie CORS blokuje żądanie. Skonfiguruj serwer proxy.',
          0
        );
      }
      throw new ApiError(err.message || 'Unknown error', 0);
    }
  }

  get<T = any>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...opts, method: 'GET' });
  }

  post<T = any>(path: string, body?: any, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...opts, method: 'POST', body });
  }

  put<T = any>(path: string, body?: any, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...opts, method: 'PUT', body });
  }

  delete<T = any>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...opts, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export { ApiError };
