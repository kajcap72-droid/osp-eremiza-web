# 🤖 Automatyczny Build APK — GitHub Actions

## 🎯 Jak to działa

Za każdym razem gdy zrobisz `git push`:
1. GitHub automatycznie buduje Twoją aplikację
2. Kompiluje ją do APK (Android)
3. Uploaduje APK jako artifact do pobrania
4. **Trwa ~5-10 minut, zero pracy z Twojej strony**

---

## 📋 Krok 1: Wrzuć na GitHub

### A. Utwórz repozytorium
1. https://github.com/new
2. Nazwa: `osp-eremiza-web`
3. **Public** (aby GitHub Pages działały)
4. **NIE zaznaczaj** "Add README, .gitignore" (już masz)
5. **Create repository**

### B. Push z terminala
```bash
# W folderze projektu:
git init
git add .
git commit -m "OSP e-Remiza z auto-build APK"
git branch -M main

# Zamień na swój URL:
git remote add origin https://github.com/TWOJA-NAZWA/osp-eremiza-web.git
git push -u origin main
```

---

## 🚀 Krok 2: Pierwszy automatyczny build

**Workflow uruchomi się automatycznie** po push!

### Sprawdź status:
1. Wejdź w swoje repozytorium na GitHub
2. Kliknij zakładkę **Actions**
3. Zobaczysz workflow **"Build Android APK"** z żółtym kółkiem (w trakcie)
4. Kliknij na niego → poczekaj 5-10 minut

### Oczekiwany wynik:
- ✅ Wszystkie zielone ptaszki
- 📦 Na dole sekcja **Artifacts** z plikami:
  - `app-debug-[hash]` — wersja testowa
  - `app-release-unsigned-[hash]` — wersja produkcyjna

---

## 📥 Krok 3: Pobierz APK

### Metoda 1: Z Actions (najnowszy build)
1. **Actions** → wybierz ostatni workflow
2. Zjedź na dół do **Artifacts**
3. Kliknij **app-debug-[hash]**
4. Pobierze się `.zip` → rozpakuj → `app-debug.apk`

### Metoda 2: Z Releases (dla tagów)
Jeśli otagujesz wersję:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Workflow automatycznie:
1. Zbuduje APK
2. Utworzy **Release** z APK jako załącznikiem
3. Dostępne w zakładce **Releases**

---

## 📱 Krok 4: Zainstaluj na telefonie

### Opcja A: Przez USB
```bash
# Podłącz telefon, włącz Debugowanie USB
adb install app-debug.apk
```

### Opcja B: Przez chmurę
1. Wrzuć APK na Google Drive / wysłać sobie emailem
2. Otwórz na telefonie
3. Zezwól na **Instalację z nieznanych źródeł** (jeśli pyta)
4. Zainstaluj

### Opcja C: Przez Firebase App Distribution (zaawansowane)
- Darmowe dla developerów
- Automatyczne powiadomienia o nowych wersjach
- https://firebase.google.com/products/app-distribution

---

## 🔄 Automatyczne buildy

Od teraz **każdy push** buduje APK:

```bash
# Zmieniłeś coś w kodzie?
git add .
git commit -m "Poprawki"
git push

# → GitHub automatycznie buduje nowe APK (~5 min)
# → Pobierasz z Actions → Artifacts
```

---

## 🏷️ Wersjonowanie (Release)

Gdy chcesz "opublikować" nową wersję:

```bash
# Zwiększ wersję
git tag v1.1.0
git push origin v1.1.0

# → GitHub automatycznie:
# 1. Buduje APK
# 2. Tworzy Release "v1.1.0"
# 3. Dodaje APK jako załącznik
# 4. Generuje changelog z commitów
```

---

## 🐛 Troubleshooting

### Workflow się nie uruchamia

**Sprawdź:**
1. Czy workflow jest w `.github/workflows/build-apk.yml`
2. Czy nazwa pliku ma rozszerzenie `.yml` (nie `.yaml`)
3. Czy jesteś na branchu `main` lub `master`

**Ręczne uruchomienie:**
1. **Actions** → **Build Android APK**
2. **Run workflow** → **Run workflow**

### Błąd: "Capacitor config not found"

Workflow automatycznie utworzy config jeśli go nie ma. 
Jeśli chcesz użyć własnego, upewnij się że `capacitor.config.ts` jest zcommitowany:

```bash
git add capacitor.config.ts
git commit -m "Add capacitor config"
git push
```

### Błąd: "Gradle build failed"

**Częste przyczyny:**
1. Brak pamięci → dodaj do workflow:
   ```yaml
   - name: Set Gradle memory
     run: echo "org.gradle.jvmargs=-Xmx4g" >> android/gradle.properties
   ```

2. Nieaktualne zależności → wyczyść cache:
   - **Actions** → **Caches** → **Delete all caches**

### APK nie instaluje się na telefonie

1. **Włącz instalację z nieznanych źródeł:**
   - Ustawienia → Bezpieczeństwo → Instaluj z nieznanych źródeł

2. **Odinstaluj poprzednią wersję** (jeśli była)

3. **Sprawdź wersję Androida:**
   - Min: Android 7.0 (API 24)
   - Sprawdź w: Ustawienia → O telefonie → Wersja Android

---

## 📊 Monitorowanie buildów

### Status badge w README

Dodaj na górze `README.md`:
```markdown
![Build APK](https://github.com/TWOJA-NAZWA/osp-eremiza-web/actions/workflows/build-apk.yml/badge.svg)
```

### Powiadomienia email

1. **Settings** → **Notifications**
2. Włącz **Actions** → **Send notifications for failed workflows**

---

## 🔐 Podpisywanie APK (opcjonalne)

Jeśli chcesz **podpisany APK** (dla Google Play):

### A. Wygeneruj keystore (lokalnie)
```bash
keytool -genkey -v -keystore release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key
```

### B. Dodaj secrets do GitHub
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret:**
   - `KEYSTORE_BASE64` (base64 z pliku `.jks`)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`

### C. Zmodyfikuj workflow
Dodaj przed "Build Release APK":
```yaml
- name: Decode keystore
  run: |
    echo ${{ secrets.KEYSTORE_BASE64 }} | base64 -d > release-key.jks

- name: Build Signed Release APK
  run: |
    cd android
    ./gradlew assembleRelease \
      -Pandroid.injected.signing.store.file=$GITHUB_WORKSPACE/release-key.jks \
      -Pandroid.injected.signing.store.password=${{ secrets.KEYSTORE_PASSWORD }} \
      -Pandroid.injected.signing.key.alias=${{ secrets.KEY_ALIAS }} \
      -Pandroid.injected.signing.key.password=${{ secrets.KEY_PASSWORD }}
```

---

## 📈 Zaawansowane: Nightly builds

Automatyczny build każdej nocy:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Codziennie o 2:00 UTC
```

Dodaj na górze workflow (obok `push`).

---

## ✅ Gotowe!

Masz teraz:
- ✅ Automatyczny build APK przy każdym push
- ✅ Release workflow dla wersji
- ✅ Artifacts do pobrania
- ✅ Zero instalacji lokalnej (oprócz git)
- ✅ Działa 24/7 na serwerach GitHub

**Workflow:**
- Czas buildu: **5-10 minut**
- Koszt: **Darmowy** (GitHub daje 2000 min/miesiąc)
- Retencja APK: **30 dni** (artifacts) / **na zawsze** (releases)

**Następne kroki:**
1. Wrzuć na GitHub (`git push`)
2. Poczekaj na pierwszy build
3. Pobierz APK
4. Zainstaluj na telefonie
5. Korzystaj! 🚒📱

---

**Powodzenia!** 🔥
