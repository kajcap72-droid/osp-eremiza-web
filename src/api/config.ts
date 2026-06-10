// ============================================
// KONFIGURACJA API e-Remiza
// ============================================
// ⚠️ WAŻNE: Przeglądarka blokuje żądania cross-origin (CORS).
// Oficjalne serwery e-Remiza najprawdopodobniej NIE ustawiają
// nagłówków CORS, więc bezpośrednie wywołania z tej aplikacji
// będą blokowane przez przeglądarkę.
//
// ROZWIĄZANIE: Skonfiguruj własny serwer proxy (np. Cloudflare Worker,
// Express.js, nginx) który:
//  1. Akceptuje żądania z Twojej domeny (CORS: *)
//  2. Przekazuje je do app.e-remiza.pl
//  3. Dodaje nagłówki CORS w odpowiedzi
//
// Przykładowy proxy (Node + Express):
//   npm i express cors axios
//   app.use(cors()); app.use('/api', proxy('https://app.e-remiza.pl/api'));

export const API_CONFIG = {
  // ⚙️ Zmień ten URL na swój serwer proxy, lub zostaw domyślny:
  baseUrl: localStorage.getItem('eremiza_api_url') || 'https://app.e-remiza.pl/api',

  // Timeout żądań (ms)
  timeout: 15000,

  // Klucz localStorage dla tokenu JWT
  tokenKey: 'eremiza_token',
  refreshTokenKey: 'eremiza_refresh_token',
  userKey: 'eremiza_user',

  // Tryb: 'live' = prawdziwe API, 'mock' = dane testowe, 'hybrid' = fallback na mock
  mode: (localStorage.getItem('eremiza_mode') || 'hybrid') as 'live' | 'mock' | 'hybrid',
};

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem('eremiza_api_url', url);
  API_CONFIG.baseUrl = url;
};

export const setApiMode = (mode: 'live' | 'mock' | 'hybrid') => {
  localStorage.setItem('eremiza_mode', mode);
  API_CONFIG.mode = mode;
};
