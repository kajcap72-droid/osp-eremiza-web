# OSP e-Remiza — Aplikacja Web z Integracją API

## 🚀 Szybki start

```bash
npm install
npm run dev
```

Aplikacja domyślnie działa w **trybie hybrydowym** — próbuje pobrać dane z API e-Remiza, ale gdy napotka błąd (np. CORS), używa danych testowych.

---

## 🔐 Logowanie

Aplikacja używa oficjalnego API e-Remiza do autentykacji:

### Tryb testowy (domyślny)
- Kliknij **"Zaloguj jako demo (tryb testowy)"** na ekranie logowania
- Używa lokalnych danych testowych

### Tryb produkcyjny (wymaga proxy CORS)
1. Skonfiguruj serwer proxy (patrz niżej)
2. W **Ustawieniach** → **Konfiguracja API** → wpisz URL proxy
3. Zmień tryb na **"Live"** lub **"Hybrid"**
4. Zaloguj się swoimi danymi z e-Remiza

---

## ⚠️ Problem CORS — Wyjaśnienie

Przeglądarki blokują żądania HTTP do innych domen, chyba że serwer docelowy wysyła nagłówek:
```
Access-Control-Allow-Origin: *
```

**Serwery e-Remiza najprawdopodobniej NIE ustawiają tego nagłówka**, co oznacza że aplikacja nie może bezpośrednio wywoływać `https://app.e-remiza.pl/api` z przeglądarki.

---

## 🔧 Rozwiązanie — Serwer Proxy

Musisz postawić prosty serwer proxy, który:
1. Akceptuje żądania z Twojej domeny (dodaje nagłówki CORS)
2. Przekazuje je do `app.e-remiza.pl`
3. Zwraca odpowiedzi z nagłówkami CORS

### Opcja 1: Node.js + Express (lokalny)

**Plik: `proxy-server.js`**
```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;
const TARGET = 'https://app.e-remiza.pl/api';

app.use(cors()); // Dodaje nagłówki CORS
app.use(express.json());

// Proxy dla wszystkich żądań API
app.use('/api', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: TARGET + req.path,
      data: req.body,
      headers: {
        ...req.headers,
        host: 'app.e-remiza.pl', // Wymagane przez serwer docelowy
      },
      timeout: 15000,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).send({
      error: error.message,
      details: error.response?.data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
  console.log(`Forwarding to ${TARGET}`);
});
```

**Uruchomienie:**
```bash
npm init -y
npm install express cors axios
node proxy-server.js
```

**Konfiguracja w aplikacji:**
- URL: `http://localhost:3001/api`
- Tryb: **Hybrid** lub **Live**

---

### Opcja 2: Cloudflare Worker (produkcja)

**Plik: `worker.js`**
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Zmień na prawdziwy serwer e-Remiza
    url.hostname = 'app.e-remiza.pl';
    url.protocol = 'https:';

    const response = await fetch(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Dodaj nagłówki CORS
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
```

**Wdrożenie:**
```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

**Konfiguracja w aplikacji:**
- URL: `https://twoj-worker.workers.dev`
- Tryb: **Live**

---

### Opcja 3: nginx (własny serwer)

**Konfiguracja `/etc/nginx/sites-available/eremiza-proxy`**
```nginx
server {
    listen 80;
    server_name twojadomena.pl;

    location /api/ {
        # Dodaj nagłówki CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        # Obsługa preflight
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Proxy do e-Remiza
        proxy_pass https://app.e-remiza.pl/api/;
        proxy_set_header Host app.e-remiza.pl;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Aktywacja:**
```bash
sudo ln -s /etc/nginx/sites-available/eremiza-proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🌐 Endpointy API (wywnioskowane)

Aplikacja próbuje wywoływać następujące endpointy:

### Autentykacja
- `POST /auth/login` — logowanie
- `POST /auth/logout` — wylogowanie
- `POST /auth/refresh` — odświeżenie tokenu

### Dane
- `GET /alarmy` — lista alarmów
- `GET /czlonkowie` — lista druhów
- `GET /pojazdy` — lista pojazdów
- `GET /statystyki` — statystyki jednostki
- `GET /mapa/hydranty` — hydranty
- `GET /mapa/osp` — inne jednostki OSP

**⚠️ Uwaga:** Endpointy są **wywnioskowane** z analizy DEX i mogą nie odpowiadać rzeczywistości. Oficjalna dokumentacja API nie jest publiczna.

---

## 🎯 Tryby działania

### Tryb Mock (Testowy)
- Wszystkie dane lokalne (mock)
- Brak żądań do API
- Przydatny do rozwoju i testów UI

### Tryb Hybrid (Domyślny)
- Próbuje pobrać dane z API
- Gdy napotka błąd (CORS, timeout, 404), używa mock data
- Najbezpieczniejszy dla użytkownika

### Tryb Live (Produkcyjny)
- Tylko prawdziwe API
- Błędy wyświetlane użytkownikowi
- Wymaga działającego proxy CORS

---

## 📱 Struktura projektu

```
src/
├── api/
│   ├── config.ts       # Konfiguracja API
│   ├── client.ts       # HTTP client (fetch wrapper)
│   ├── auth.ts         # Serwis autentykacji
│   └── hooks.ts        # Hooki React (useApiData, useApiMutation)
├── contexts/
│   └── AuthContext.tsx # Context autentykacji
├── components/
│   ├── LoginScreen.tsx # Ekran logowania
│   ├── AlarmyScreen.tsx
│   ├── MapaScreen.tsx
│   └── ... (pozostałe ekrany)
└── App.tsx             # Główny komponent
```

---

## 🔍 Debugowanie

### Sprawdź czy proxy działa

**Test z terminala:**
```bash
curl -v http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

**Oczekiwana odpowiedź:**
- HTTP 200 (sukces) lub 401 (złe dane) = proxy działa
- Błąd CORS = proxy nie działa
- 500 / timeout = problem z połączeniem do e-Remiza

### Sprawdź w DevTools

1. Otwórz **Network tab** (F12)
2. Spróbuj się zalogować
3. Sprawdź żądanie do `/api/auth/login`:
   - Status: 200 = OK
   - Status: 0 + CORS error = problem z proxy
   - Status: 401 = złe dane logowania

---

## 🚨 Ograniczenia

1. **Brak oficjalnej dokumentacji API** — endpointy wywnioskowane, mogą się zmienić
2. **Brak gwarancji stabilności** — Abakus może zmienić API bez ostrzeżenia
3. **Możliwe rate limiting** — zbyt wiele żądań może zablokować IP
4. **Regulamin e-Remiza** — upewnij się że nie łamiesz warunków użytkowania

---

## 📄 Licencja i odpowiedzialność

**Aplikacja jest narzędziem reverse engineeringowym** stworzonym do celów edukacyjnych. Używasz jej na własne ryzyko. Autor nie ponosi odpowiedzialności za:
- Naruszenie regulaminu e-Remiza
- Zablokowanie konta
- Błędy w danych
- Szkody wynikające z użycia aplikacji

**Zalecane użycie:**
- Własne konto e-Remiza (jako członek OSP)
- Testy i rozwój
- Alternatywny klient dla własnej jednostki

---

## 🤝 Wsparcie

**Problemy z CORS?** Sprawdź sekcję "Rozwiązanie — Serwer Proxy" powyżej.

**Błędy aplikacji?** Otwórz issue na GitHub.

**Pytania o API e-Remiza?** Skontaktuj się z Abakus: kontakt@e-remiza.pl

---

**Autor:** Reverse engineering analysis · 2026  
**API:** e-Remiza (Abakus Systemy Teleinformatyczne sp. z o.o.)  
**Status:** Eksperymentalny / Edukacyjny
