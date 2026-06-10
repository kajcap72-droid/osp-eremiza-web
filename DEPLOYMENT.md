# 🚀 Deployment na GitHub — Instrukcja krok po kroku

## 📋 Krok 1: Utwórz repozytorium na GitHub

1. Wejdź na https://github.com/new
2. Nazwa repozytorium: `osp-eremiza-web` (lub dowolna)
3. **Public** (jeśli chcesz GitHub Pages) lub **Private**
4. **NIE zaznaczaj** "Add README, .gitignore, license" (już masz te pliki)
5. Kliknij **Create repository**

## 📋 Krok 2: Skopiuj URL repozytorium

Po utworzeniu zobaczysz URL w formacie:
```
https://github.com/TWOJA-NAZWA/osp-eremiza-web.git
```

## 📋 Krok 3: Push z lokalnego komputera

Otwórz terminal w folderze projektu i wykonaj:

```bash
# Inicjalizacja git (jeśli jeszcze nie)
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit: OSP e-Remiza web app"

# Ustaw branch główny
git branch -M main

# Dodaj remote (zamień na swój URL!)
git remote add origin https://github.com/TWOJA-NAZWA/osp-eremiza-web.git

# Push na GitHub
git push -u origin main
```

## 📋 Krok 4: Włącz GitHub Pages (opcjonalnie)

Jeśli chcesz mieć aplikację online za darmo:

1. Wejdź w **Settings** swojego repozytorium na GitHub
2. W menu bocznym kliknij **Pages**
3. W sekcji "Build and deployment" wybierz:
   - **Source**: GitHub Actions
4. Zapisz zmiany

## 📋 Krok 5: Pierwszy deployment

Po push na GitHub, workflow automatycznie:
1. Zbuduje projekt (npm install + npm run build)
2. Opublikuje go na GitHub Pages

**URL aplikacji:** `https://TWOJA-NAZWA.github.io/osp-eremiza-web/`

Status deploymentu zobaczysz w zakładce **Actions** w repozytorium.

---

## 🔧 Konfiguracja Vite dla GitHub Pages

Jeśli deployujesz na GitHub Pages, musisz zmienić `base` w `vite.config.ts`:

**Zmień:**
```typescript
export default defineConfig({
  base: '/osp-eremiza-web/', // ← nazwa repozytorium
  plugins: [react()],
})
```

**Lub dynamicznie:**
```typescript
export default defineConfig({
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [react()],
})
```

---

## 🌐 Alternatywne hostingi

### Vercel (najłatwiejszy)
1. Wejdź na https://vercel.com
2. Kliknij **Import Project**
3. Wybierz swoje repozytorium z GitHub
4. Vercel automatycznie wykryje Vite i zdeployuje
5. Gotowe! URL: `https://twoj-projekt.vercel.app`

### Netlify
1. Wejdź na https://netlify.com
2. **Add new site** → **Import an existing project**
3. Wybierz GitHub → swoje repozytorium
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

### Cloudflare Pages
1. Wejdź na https://pages.cloudflare.com
2. **Create a project** → **Connect to Git**
3. Wybierz repozytorium
4. Framework preset: **Vite**
5. Deploy!

---

## 🔐 Zmienne środowiskowe (opcjonalnie)

Jeśli chcesz użyć innego API URL w produkcji:

### GitHub Actions
Dodaj w **Settings → Secrets and variables → Actions**:
```
VITE_API_URL=https://twoj-proxy.workers.dev
```

### W kodzie
```typescript
// src/api/config.ts
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://app.e-remiza.pl/api',
  // ...
};
```

---

## 🐛 Troubleshooting

### Błąd: "git push rejected"
```bash
git pull origin main --rebase
git push -u origin main
```

### Błąd: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TWOJA-NAZWA/osp-eremiza-web.git
```

### GitHub Pages pokazuje 404
- Sprawdź czy workflow zakończył się sukcesem (zakładka **Actions**)
- Upewnij się że w **Settings → Pages** wybrałeś **GitHub Actions** jako source
- Poczekaj 1-2 minuty po deployment

### Build failing na GitHub Actions
- Sprawdź logi w zakładce **Actions**
- Najczęstsze problemy:
  - Brak `package-lock.json` → uruchom lokalnie `npm install` i zcommituj
  - Błędy TypeScript → sprawdź lokalnie `npm run build`

---

## 📝 Komendy szybkiego startu

**Pełna sekwencja (kopiuj-wklej):**
```bash
# 1. Inicjalizacja
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 2. Połącz z GitHub (zamień URL!)
git remote add origin https://github.com/TWOJA-NAZWA/osp-eremiza-web.git

# 3. Push
git push -u origin main

# 4. (opcjonalnie) Lokalny dev server
npm install
npm run dev
```

**Po zmianach w kodzie:**
```bash
git add .
git commit -m "Opis zmian"
git push
```

---

## ✅ Gotowe!

Twoja aplikacja jest teraz:
- ✅ Na GitHub (backup + version control)
- ✅ Automatycznie budowana przy każdym push (GitHub Actions)
- ✅ Opublikowana online (GitHub Pages / Vercel / Netlify)
- ✅ Gotowa do współpracy (pull requests, issues)

**Następne kroki:**
1. Skonfiguruj proxy CORS (patrz `README.md`)
2. Wpisz URL proxy w **Ustawienia → Konfiguracja API**
3. Zaloguj się swoimi danymi z e-Remiza
4. Korzystaj z aplikacji! 🚒

---

**Powodzenia!** 🔥
