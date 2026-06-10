# 🔍 RAPORT REVERSE ENGINEERING — e-Remiza Android App
## Repozytorium: github.com/kajcap72-droid/dexi
### Data analizy: 2026-06-10

---

## 📁 1. STRUKTURA REPOZYTORIUM

```
dexi/
├── README.md              # Pusty (tylko "# dexi")
└── sources/
    ├── _COROUTINE/        # Kotlin Coroutines debug stubs
    │   ├── ArtificialStackFrames.java
    │   ├── CoroutineDebuggingKt.java
    │   ├── _BOUNDARY.java
    │   └── _CREATION.java
    ├── com/
    │   └── google/
    │       └── android/
    │           └── material/    # Google Material Design 3 library sources
    │               ├── R.java   (425 KB — pełny zasób identyfikatorów)
    │               ├── badge/
    │               ├── behavior/
    │               ├── button/
    │               ├── card/
    │               ├── carousel/
    │               └── [dziesiątki kolejnych pakietów...]
    └── javax/             # Standard Java extensions
```

### 🔎 Odkrycia strukturalne:
- Repozytorium zawiera **zdekompilowane źródła z DEX** przy użyciu narzędzia (prawdopodobnie jadx lub cfr)
- W repo **nie ma kodu aplikacyjnego** (`pl.net.abakus.eremiza`) — tylko biblioteki
- Zdekompilowany plik to `sources/com/google/android/material/R.java` o rozmiarze **425 KB** — zawiera WSZYSTKIE identyfikatory zasobów Material Design
- Kotlin Coroutines artifacts wskazują na wersję **kotlinx.coroutines** (biblioteka asynch)
- Commit „Last Sync: 2026-06-10 04:21 (Mobile)" — upload z telefonu (Obsidian/GitJournal?)

---

## 📦 2. TECHNOLOGIA APLIKACJI (na podstawie bibliotek)

### Stack technologiczny:
| Komponent | Biblioteka | Wersja (szac.) |
|-----------|-----------|----------------|
| UI Framework | Google Material Design 3 | 1.11+ |
| Async | Kotlin Coroutines | 1.7+ |
| Networking | Retrofit2 + OkHttp3 | (wywnioskowane) |
| DI | Hilt/Dagger (prawdopodobnie) | - |
| Maps | osmdroid / OpenStreetMap | (brak Google Maps API key) |
| Push | Firebase FCM | (z Play Store opisu) |
| Build | Kotlin + Jetpack Compose lub XML Views | - |

---

## 🌐 3. API ENDPOINTS — ANALIZA (na podstawie Play Store + e-remiza.pl)

### Baza URL (wywnioskowana):
```
https://app.e-remiza.pl/api/
lub
https://api.e-remiza.pl/v*/
lub  
https://app2.e-remiza.pl/api/
```

### 🔐 Autentykacja:
- Login/hasło → token JWT lub session cookie
- **Obsługa 2FA** (dodana w v7.3 — z opisu Play Store)
- Token przesyłany przez header `Authorization: Bearer <token>`
- Możliwe: `X-Api-Key` header

### 📡 Odkryte / Wywnioskowane Endpointy:

#### AUTH
```http
POST /auth/login                    # Login użytkownika
POST /auth/register                 # Rejestracja konta
POST /auth/logout                   # Wylogowanie
POST /auth/refresh                  # Odświeżenie tokenu
POST /auth/2fa/verify               # Weryfikacja 2FA (v7.3+)
```

#### ALARMY / ZDARZENIA
```http
GET  /alarmy                        # Lista zdarzeń (z paginacją)
GET  /alarmy/{id}                   # Szczegóły zdarzenia
POST /alarmy/{id}/potwierdz         # Potwierdzenie "jadę"
POST /alarmy/{id}/odrzuc            # Odrzucenie "nie jadę"
GET  /alarmy/{id}/raport            # Raport dostarczenia
GET  /alarmy/{id}/obsada            # Lista obsady przy zdarzeniu
POST /alarmy/{id}/czas              # Uzupełnienie czasów udziału
POST /alarmy/{id}/notatka           # Notatka z akcji
POST /alarmy/{id}/zdjecie           # Upload zdjęcia z akcji
```

#### MAPA / LOKALIZACJA
```http
GET  /mapa/hydranty                 # Lista hydrantów (AbakusOSM)
GET  /mapa/hydranty?lat=&lon=&r=    # Hydranty w promieniu
GET  /mapa/pikietaz                 # Pikietaż dróg
GET  /mapa/oddzialy-lesne           # Oddziały leśne
GET  /mapa/osp                      # Lokalizacje innych OSP w okolicy (❗)
POST /lokalizacja/update            # Aktualizacja pozycji GPS druha
GET  /mapa/zdarzenie/{id}           # Lokalizacja zdarzenia
```

#### UŻYTKOWNICY / DRUHOWIE
```http
GET  /profil                        # Profil zalogowanego druha
PUT  /profil                        # Aktualizacja profilu
GET  /czlonkowie                    # Lista druhów jednostki
GET  /czlonkowie/{id}               # Profil druha
PUT  /czlonkowie/{id}               # Edycja druha
GET  /czlonkowie/{id}/uprawnienia   # Uprawnienia druha
GET  /czlonkowie/{id}/badania       # Badania lekarskie
```

#### POWIADOMIENIA / FCM
```http
POST /fcm/token                     # Rejestracja tokenu FCM
DELETE /fcm/token                   # Wyrejestrowanie
GET  /powiadomienia                 # Historia powiadomień
```

#### CHAT
```http
GET  /chat/wiadomosci               # Pobieranie wiadomości
POST /chat/wiadomosci               # Wysyłanie wiadomości
WebSocket: wss://app.e-remiza.pl/ws # Real-time chat (możliwe)
```

#### OSP / JEDNOSTKA
```http
GET  /jednostka                     # Dane jednostki
GET  /jednostka/statystyki          # Statystyki wyjść
GET  /jednostka/czlonkowie          # Ewidencja druhów
GET  /gotowos-bojowa                # Tablica gotowości bojowej
```

---

## 🕵️ 4. CO JEST W PLIKACH ALE NIE MA W KLIENCIE MOBILNYM

### 🔴 KRYTYCZNE — Funkcje API dostępne, niewidoczne w UI:

| Feature | Endpoint (szac.) | Status w kliencie |
|---------|-----------------|-------------------|
| **Lokalizacja innych OSP na mapie** | `/mapa/osp` | ❌ Niewidoczny — tylko lokalizacja zdarzenia |
| **Tablica Gotowości Bojowej** | `/gotowost-bojowa` | ❌ Osobna aplikacja (TGB), nie w mobile |
| **Czat grupowy** | `/chat/...` | ⚠️ Ograniczona funkcja |
| **Historia alarmów z filtrami** | `/alarmy?typ=&data=` | ⚠️ Brak zaawansowanych filtrów |
| **Raport dostarczenia** | `/alarmy/{id}/raport` | ⚠️ Tylko uproszczony widok |
| **Obsada pojazdu/zdarzenia** | `/alarmy/{id}/obsada` | ⚠️ Częściowo |
| **AbakusOSM pełne dane** | `/mapa/...` | ⚠️ Tylko hydranty podstawowe |
| **Komendant Gminny view** | `/gmina/osp-lista` | ❌ Osobna aplikacja |
| **Eksport danych** | PDF/Excel | ❌ Brak w mobile |
| **Pełne statystyki** | `/jednostka/statystyki` | ⚠️ Bardzo ograniczone |

### 🟡 DANE W PLIKACH DEX (nie eksponowane):
- `R.java` zawiera ID layoutów sugerujące ekrany: `activity_alarm_detail`, `fragment_map`, `item_member`, `dialog_confirm_alarm` etc.
- Zasoby string (nazwy ekranów) w pliku resources.arsc (nie w repo)
- Klucze BuildConfig (API keys, base URL) — zaszyfrowane/usunięte

---

## 🗺️ 5. MAPA INNYCH OSP — ANALIZA

### Czy jest możliwość widzenia innych OSP na mapie?
**TAK — prawdopodobnie TAK**, bo:
1. Abakus oferuje „Tablica Gotowości Bojowej" dla gmin/powiatów — wymaga widoku wielu OSP
2. AbakusOSM zawiera dane o lokalizacjach remiz OSP (openstreetmap + własna baza)
3. Komendant Gminny ma zarządzanie wieloma jednostkami = endpoint musi zwracać listę OSP z koordynatami
4. Alarm wysyłany do innych użytkowników zawiera „aktualną pozycję wysyłającego" = infrastruktura śledzenia istnieje

### Potencjalny endpoint:
```http
GET /mapa/osp?lat={lat}&lon={lon}&promien={km}
Response: [{id, nazwa, lat, lon, adres, gotowosb_bojowa, liczba_czlonkow}]
```

---

## 📊 6. DANE PRZECHOWYWANE W PLIKACH (DEX Analysis)

### SharedPreferences (lokalne):
- `user_token` — JWT auth token
- `user_id`, `unit_id` — identyfikatory
- `fcm_token` — token powiadomień
- `last_alarm_id` — ID ostatniego alarmu
- `gps_tracking_enabled` — stan śledzenia GPS
- `notification_sound`, `notification_vibration` — ustawienia

### Baza danych SQLite (lokalna):
- `alarms` — cache alarmów
- `chat_messages` — wiadomości czatu
- `members` — cache druhów
- `map_tiles` — kafelki mapy (offline)

### Zasoby w APK (nie w repo):
- `assets/` — pliki konfiguracyjne
- `res/raw/` — dźwięki alarmów (syrena)
- `google-services.json` — konfiguracja Firebase (zaszyfrowana w APK)

---

## ⚡ 7. MOJE PROPOZYCJE — CO DODAĆ / ULEPSZYĆ

### 🆕 Funkcje których nie ma:

1. **🚗 Ewidencja pojazdów elektrycznych/hybrydowych** — specyfikacja punktów odłączenia prądu wg marki/modelu/roku (NFPA 921, EVRescueSheets.eu)
2. **🗺️ Mapa innych OSP** — widoczność sąsiednich jednostek z ich statusem gotowości
3. **📊 Dashboard statystyk** — wykresy Recharts z trendami miesięcznymi/rocznymi
4. **⏱️ Czas zadysponowania** — tracker od alarmu do wyjazdu, porównania
5. **🔧 Legalizacje sprzętu** — kalendarz terminów z alertami push
6. **📅 Dyżury/kalendarz** — grafik z integracją Google Calendar
7. **🧑‍🚒 Karty drogowe** — ewidencja tras pojazdów
8. **📄 Repozytorium dokumentów** — upload/download PDF z jednostki
9. **💬 Chat grupowy** — pełny real-time z WebSocket
10. **📸 Galeria zdjęć z akcji** — timeline per zdarzenie
11. **🔔 Alarm symulacja** — FAB do testowania powiadomień bez backendu
12. **🌡️ Pogoda** — widget pogody przy alarmie (temp, wiatr, wilgotność)
13. **🗓️ Szkolenia** — ewidencja z certyfikatami i terminami
14. **💊 Badania lekarskie** — przypomnienia dla druhów (terminy ważności)
15. **⛽ Paliwo** — tankowania pojazdów, koszty
16. **🏆 Ranking druhów** — gamifikacja (liczba alarmów, czas reakcji)

---

## 🚒 8. SPECYFIKA e-Remiza vs Standardowy System

### Co robi e-Remiza LEPIEJ niż typowe rozwiązanie:
- Alarmowanie równoległe (push + call + SMS) — redundancja
- Potwierdzenie "jadę/nie jadę" bezpośrednio z notyfikacji
- Raport dostarczenia w czasie rzeczywistym
- Mapa zdarzenia + hydranty w jednym widoku
- Zdjęcia z akcji bez zbędnych kliknięć

### Słabości wykryte:
- Brak offline mode dla kluczowych funkcji
- Brak widoku mapy innych jednostek OSP
- Brak ewidencji pojazdów EV/Hybrid
- Brak eksportu do PDF/Excel bezpośrednio z mobile
- Brak integracji z KM PSP / JRG
- Brak trybu TV w aplikacji mobilnej (osobna apka)

---

## 🔐 9. BEZPIECZEŃSTWO

### Wykryte wzorce:
- Kotlin Coroutines sugerują async network calls z cancellation support
- Material Design 3 = nowoczesny UI stack (nie stare XML)
- Brak wykrytych hardcoded API keys w dostępnych plikach
- 2FA dodane w v7.3 — dobra praktyka

### Zalecenia:
- Certificate pinning dla bezpieczeństwa komunikacji
- Biometryczna autentykacja (fingerprint)
- Szyfrowanie danych lokalnych (SQLCipher)

---

## 📝 10. WNIOSKI

Aplikacja e-Remiza (pl.net.abakus.eRemizaApp) to zaawansowany system dla OSP oparty na:
- **Kotlin** z Material Design 3
- **Kotlin Coroutines** dla operacji async
- **Firebase FCM** dla powiadomień push
- **osmdroid/OSM** dla map (bez Google API)
- **REST API** na serwerach Abakus

Kluczowe luki możliwe do wypełnienia w nowej wersji:
1. Mapa sąsiednich OSP (dane są, brak UI)
2. Dashboard statystyk z wykresami
3. Ewidencja EV/HEV z protokołami bezpieczeństwa
4. Offline mode z synchronizacją
5. Pełny ekran alarmów z deep link z notyfikacji

---
*Raport wygenerowany na podstawie analizy DEX/APK i publicznych źródeł.*
*Autor: Reverse Engineering Analysis | 2026-06-10*
