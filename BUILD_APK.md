# 🤖 Budowanie APK — Instrukcja krok po kroku

## 📋 Wymagania wstępne

### Systemowe:
- **Node.js 20+** — https://nodejs.org
- **Android Studio** — https://developer.android.com/studio
- **Java JDK 17** — https://adoptium.net

### Po instalacji Android Studio:
1. Otwórz Android Studio
2. **More Actions** → **SDK Manager**
3. Zainstaluj:
   - Android SDK Platform (latest)
   - Android SDK Build-Tools (latest)
   - Android SDK Platform-Tools
4. **SDK Tools** tab:
   - Android SDK Command-line Tools (latest)
   - Android Emulator

---

## 🚀 Metoda 1: PWA Builder (NAJSZYBSZA — 2 minuty)

### Krok 1: Zdeployuj aplikację online

**Opcja A — Vercel (30 sekund):**
```bash
npm install -g vercel
vercel
# Postępuj zgodnie z instrukcjami
```

**Opcja B — Netlify:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**Opcja C — GitHub Pages:**
- Postępuj zgodnie z `DEPLOYMENT.md`

### Krok 2: Użyj PWA Builder

1. Wejdź na **https://www.pwabuilder.com**
2. Wklej URL aplikacji (np. `https://osp-eremiza.vercel.app`)
3. Kliknij **Score** → **Build my PWA**
4. Wybierz **Android**
5. Kliknij **Generate package**
6. Pobierz `.apk` ✅

**Gotowe! Zainstaluj na telefonie.**

---

## 🛠️ Metoda 2: Capacitor (Profesjonalna)

### Krok 1: Zainstaluj zależności

```bash
# Capacitor core + CLI
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Pluginy (opcjonalne)
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/app
```

### Krok 2: Inicjalizacja Capacitor

```bash
npx cap init
# Nazwa aplikacji: OSP e-Remiza
# App ID: pl.osp.eremiza.web
```

**Lub użyj gotowego `capacitor.config.ts` (już utworzony):**
```bash
# Pomiń init, config jest gotowy
```

### Krok 3: Zbuduj aplikację web

```bash
npm run build
```

### Krok 4: Dodaj platformę Android

```bash
npx cap add android
```

**To utworzy folder `android/` z projektem Android Studio.**

### Krok 5: Skopiuj pliki web do Android

```bash
npx cap copy android
npx cap sync android
```

### Krok 6: Otwórz w Android Studio

```bash
npx cap open android
```

**Android Studio otworzy projekt.**

### Krok 7: Zbuduj APK w Android Studio

1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Poczekaj 2-5 minut (pierwszy build)
3. Po zakończeniu kliknij **locate** w notyfikacji
4. Znajdziesz plik: `android/app/build/outputs/apk/debug/app-debug.apk`

**Gotowe! Skopiuj na telefon i zainstaluj.**

---

## 📦 Build Release APK (podpisany)

### Krok 1: Wygeneruj keystore

```bash
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

**Zapisz hasła!** (będą potrzebne do podpisania)

### Krok 2: Skonfiguruj signing w Android Studio

1. **File** → **Project Structure** → **Modules** → **app**
2. **Signing Configs** → **+** (dodaj nowy)
3. Wypełnij:
   - Name: `release`
   - Store File: wskaż `my-release-key.jks`
   - Store Password: (z kroku 1)
   - Key Alias: `my-key-alias`
   - Key Password: (z kroku 1)
4. **Build Types** → **release** → Signing Config: `release`
5. **OK**

### Krok 3: Zbuduj Release APK

```bash
cd android
./gradlew assembleRelease
```

**Lub w Android Studio:**
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wybierz **release** variant
3. Znajdź: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🚀 Metoda 3: GitHub Actions (Automatyczny build APK)

### Krok 1: Dodaj workflow

Utwórz `.github/workflows/build-apk.yml`:

```yaml
name: Build Android APK

on:
  push:
    tags:
      - 'v*'  # Uruchamia się na tagach v1.0.0, v2.0.0, etc.
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web app
        run: npm run build
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      
      - name: Setup Android SDK
        uses: android-actions/setup-android@v3
      
      - name: Install Capacitor
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android
          npx cap add android
          npx cap copy android
      
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleDebug
      
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

### Krok 2: Uruchom build

```bash
git tag v1.0.0
git push origin v1.0.0
```

**Lub ręcznie:**
1. GitHub → **Actions** → **Build Android APK** → **Run workflow**

### Krok 3: Pobierz APK

1. **Actions** → wybierz ostatni workflow
2. **Artifacts** → **app-debug**
3. Pobierz `.zip` → rozpakuj → `app-debug.apk`

---

## 📱 Instalacja APK na telefonie

### Opcja 1: USB
1. Podłącz telefon kablem USB
2. Włącz **Debugowanie USB** (Ustawienia → Opcje programisty)
3. Skopiuj APK na telefon
4. Otwórz plik na telefonie → **Zainstaluj**

### Opcja 2: Google Drive / Email
1. Wyślij APK na siebie (Drive, email, Telegram)
2. Otwórz na telefonie
3. Zezwól na **instalację z nieznanych źródeł**
4. Zainstaluj

### Opcja 3: ADB (dla developerów)
```bash
adb install app-debug.apk
```

---

## 🐛 Troubleshooting

### Błąd: "SDK location not found"

Utwórz `android/local.properties`:
```properties
sdk.dir=/Users/TWOJA-NAZWA/Library/Android/sdk  # macOS
# lub
sdk.dir=C:\\Users\\TWOJA-NAZWA\\AppData\\Local\\Android\\Sdk  # Windows
```

### Błąd: "JAVA_HOME is not set"

**macOS/Linux:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

**Windows:**
```
System → Advanced → Environment Variables → JAVA_HOME
C:\Program Files\Java\jdk-17
```

### Build się zawiesza

```bash
# Wyczyść cache
cd android
./gradlew clean
cd ..
npx cap sync android
```

### APK nie instaluje się

1. Sprawdź czy włączona jest **Instalacja z nieznanych źródeł**
2. Sprawdź wersję Androida (min API 24 = Android 7.0)
3. Spróbuj **Uninstall** jeśli była wcześniejsza wersja

---

## 📊 Porównanie metod

| Metoda | Trudność | Czas | Wymagania | Jakość |
|--------|----------|------|-----------|--------|
| **PWA Builder** | ⭐ Łatwa | 2 min | Brak | ⭐⭐⭐ |
| **Capacitor** | ⭐⭐⭐ Trudna | 30 min | Android Studio | ⭐⭐⭐⭐⭐ |
| **GitHub Actions** | ⭐⭐ Średnia | 5 min | GitHub | ⭐⭐⭐⭐ |

**Rekomendacja:**
- **Szybki test** → PWA Builder
- **Produkcja** → Capacitor + signing
- **Automatyzacja** → GitHub Actions

---

## 🔐 Podpisywanie APK (dla Google Play)

Jeśli chcesz opublikować w Google Play Store:

1. Wygeneruj **upload key** (patrz "Build Release APK")
2. Zarejestruj się jako developer: https://play.google.com/console ($25 jednorazowo)
3. Utwórz nową aplikację
4. Wgraj **signed APK** lub **AAB** (Android App Bundle)
5. Wypełnij metadane (opis, screenshoty)
6. Submit for review (2-7 dni)

**AAB zamiast APK:**
```bash
./gradlew bundleRelease
# app-release.aab → mniejszy rozmiar, wymagany przez Google Play
```

---

## ✅ Gotowe!

Masz teraz:
- ✅ Web app (React + Vite)
- ✅ Android APK (Capacitor / PWA Builder)
- ✅ Automatyczny build (GitHub Actions)
- ✅ Deployment online (Vercel / GitHub Pages)

**Powodzenia!** 🚒📱
