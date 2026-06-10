import React, { useState } from 'react';
import { FileSearch, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Info, Globe } from 'lucide-react';
import { clsx } from 'clsx';

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}



const CodeBlock = ({ code }: { code: string }) => (
  <pre className="text-xs text-green-300 bg-gray-950 border border-gray-800 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
    {code}
  </pre>
);

const sections: Section[] = [
  {
    id: 'stack',
    title: '📦 Stack technologiczny aplikacji',
    icon: '⚙️',
    content: (
      <div className="space-y-3">
        <div className="text-xs text-gray-400 leading-relaxed">
          Na podstawie zdekompilowanych plików DEX (jadx) z repozytorium github.com/kajcap72-droid/dexi:
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { tech: 'Kotlin + Android SDK', desc: 'Główny język, min SDK 24 (Android 7.0)', color: 'text-orange-400 bg-orange-900/20 border-orange-500/20' },
            { tech: 'Google Material Design 3', desc: 'UI framework (425KB R.java — zasoby)', color: 'text-blue-400 bg-blue-900/20 border-blue-500/20' },
            { tech: 'Kotlin Coroutines', desc: 'Async I/O, _COROUTINE debug artifacts', color: 'text-purple-400 bg-purple-900/20 border-purple-500/20' },
            { tech: 'Retrofit2 + OkHttp3', desc: 'REST API client (wywnioskowane)', color: 'text-green-400 bg-green-900/20 border-green-500/20' },
            { tech: 'Firebase FCM', desc: 'Push notifications (Play Store)', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20' },
            { tech: 'osmdroid / OSM', desc: 'Mapy bez Google Maps API', color: 'text-cyan-400 bg-cyan-900/20 border-cyan-500/20' },
          ].map(({ tech, desc, color }) => (
            <div key={tech} className={clsx('p-2.5 rounded-lg border flex items-start gap-2', color)}>
              <div className="flex-1">
                <div className="text-xs font-bold">{tech}</div>
                <div className="text-xs opacity-70 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'endpoints',
    title: '🌐 Odkryte Endpointy API',
    icon: '🔗',
    content: (
      <div className="space-y-3">
        <div className="text-xs text-gray-400">Base URL (wywnioskowane): <code className="text-green-400 font-mono">https://app.e-remiza.pl/api/</code></div>
        {[
          { group: 'AUTH', color: 'text-yellow-400', endpoints: [
            'POST /auth/login', 'POST /auth/register', 'POST /auth/logout',
            'POST /auth/refresh', 'POST /auth/2fa/verify  ← v7.3+',
          ]},
          { group: 'ALARMY', color: 'text-red-400', endpoints: [
            'GET  /alarmy', 'GET  /alarmy/{id}',
            'POST /alarmy/{id}/potwierdz  ← "jadę"',
            'POST /alarmy/{id}/odrzuc    ← "nie jadę"',
            'GET  /alarmy/{id}/raport', 'GET  /alarmy/{id}/obsada',
            'POST /alarmy/{id}/zdjecie', 'POST /alarmy/{id}/notatka',
          ]},
          { group: 'MAPA / OSM', color: 'text-blue-400', endpoints: [
            'GET  /mapa/hydranty?lat=&lon=&r=',
            'GET  /mapa/pikietaz', 'GET  /mapa/oddzialy-lesne',
            'GET  /mapa/osp  ← ❗ inne OSP na mapie',
            'POST /lokalizacja/update  ← pozycja GPS druha',
          ]},
          { group: 'UŻYTKOWNICY', color: 'text-green-400', endpoints: [
            'GET  /profil', 'PUT  /profil',
            'GET  /czlonkowie', 'GET  /czlonkowie/{id}',
            'GET  /czlonkowie/{id}/badania',
            'GET  /czlonkowie/{id}/uprawnienia',
          ]},
          { group: 'FCM / PUSH', color: 'text-purple-400', endpoints: [
            'POST /fcm/token  ← rejestracja FCM',
            'DELETE /fcm/token', 'GET  /powiadomienia',
          ]},
          { group: 'CHAT', color: 'text-cyan-400', endpoints: [
            'GET  /chat/wiadomosci', 'POST /chat/wiadomosci',
            'WebSocket: wss://app.e-remiza.pl/ws',
          ]},
        ].map(({ group, color, endpoints }) => (
          <div key={group}>
            <div className={clsx('text-xs font-bold mb-1', color)}>{group}</div>
            <CodeBlock code={endpoints.join('\n')} />
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'missing',
    title: '❌ Co jest w API ale brak w kliencie',
    icon: '🔍',
    content: (
      <div className="space-y-2">
        {[
          { status: 'brak', label: 'Mapa innych OSP w okolicy', desc: '/mapa/osp endpoint istnieje, brak widoku w mobile', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
          { status: 'brak', label: 'Tablica Gotowości Bojowej', desc: 'Osobna aplikacja TGB — dane dostępne przez API', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
          { status: 'brak', label: 'Eksport PDF/Excel', desc: 'Brak w mobile, dostępne w www', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
          { status: 'brak', label: 'Komendant Gminny view', desc: 'Zarządzanie wieloma jednostkami — osobna aplikacja', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
          { status: 'cześciowy', label: 'Pełne statystyki', desc: '/jednostka/statystyki — ograniczony widok w mobile', icon: <Info className="w-3.5 h-3.5 text-yellow-400" /> },
          { status: 'cześciowy', label: 'Chat w czasie rzeczywistym', desc: 'WebSocket dostępny, mobile ma ograniczony chat', icon: <Info className="w-3.5 h-3.5 text-yellow-400" /> },
          { status: 'cześciowy', label: 'Obsada zdarzenia', desc: 'Tylko uproszczona lista, brak ról/funkcji', icon: <Info className="w-3.5 h-3.5 text-yellow-400" /> },
          { status: 'cześciowy', label: 'AbakusOSM pełne', desc: 'Tylko hydranty, brak pikietażu w UI', icon: <Info className="w-3.5 h-3.5 text-yellow-400" /> },
          { status: 'ok', label: 'Alarm jadę/nie jadę', desc: 'Działa poprawnie z notyfikacji', icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" /> },
          { status: 'ok', label: 'Mapa zdarzenia + hydranty', desc: 'Integracja osmdroid + AbakusOSM', icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" /> },
          { status: 'ok', label: 'Zdjęcia z akcji', desc: 'Upload bez zbędnych kliknięć', icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" /> },
        ].map(({ label, desc, icon }) => (
          <div key={label} className="flex items-start gap-2.5 p-2.5 bg-gray-900/40 rounded-lg border border-gray-800/40">
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div>
              <div className="text-xs font-semibold text-gray-200">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'storage',
    title: '💾 Dane przechowywane lokalnie',
    icon: '📱',
    content: (
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 font-semibold mb-1">SharedPreferences:</div>
          <CodeBlock code={`user_token       — JWT auth token
user_id          — ID użytkownika
unit_id          — ID jednostki OSP
fcm_token        — Firebase Cloud Messaging token
last_alarm_id    — ID ostatniego alarmu
gps_enabled      — stan śledzenia GPS
notification_*   — ustawienia powiadomień`} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-semibold mb-1">SQLite (lokalna baza):</div>
          <CodeBlock code={`alarms           — cache alarmów (offline)
chat_messages    — historia czatu
members          — cache druhów
map_tiles        — kafle mapy OSM (offline)`} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-semibold mb-1">Assets w APK:</div>
          <CodeBlock code={`res/raw/siren.mp3  — dźwięk syreny alarmowej
google-services.json — konfiguracja Firebase
res/layout/      — layouty XML (Material 3)
res/values/      — tłumaczenia, kolory, style`} />
        </div>
      </div>
    )
  },
  {
    id: 'mapa_osp',
    title: '🗺️ Mapa innych OSP — analiza',
    icon: '🚒',
    content: (
      <div className="space-y-3">
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
          <div className="text-xs font-bold text-green-400 mb-1">✅ KONKLUZJA: Tak — jest możliwe</div>
          <div className="text-xs text-green-300 leading-relaxed">
            API e-Remiza posiada endpoint /mapa/osp (wywnioskowany z TGB i Komendanta Gminnego). 
            Dane lokalizacyjne remiz są w systemie (potrzebne dla wielkich akcji i koordynacji).
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1.5">
          <div className="font-semibold text-gray-300">Dowody na istnienie endpointu:</div>
          <div>• <strong>TGB</strong> (Tablica Gotowości Bojowej) wymaga danych wielu OSP z jednego API</div>
          <div>• <strong>Komendant Gminny</strong> zarządza wieloma jednostkami = lista OSP z koordynatami</div>
          <div>• <strong>AbakusOSM</strong> zawiera dane remiz OSP w OpenStreetMap + własna baza</div>
          <div>• Alarm grupowy "do innych użytkowników" zakłada wiedzę o lokalizacji ich remiz</div>
        </div>
        <CodeBlock code={`// Potencjalny endpoint:
GET /mapa/osp?lat={lat}&lon={lon}&promien={km}

// Response:
[{
  "id": "osp_123",
  "nazwa": "OSP Kraków-Podgórze",
  "adres": "ul. Zamenhoffa 7",
  "lat": 50.041,
  "lon": 19.950,
  "gotowoscBojowa": true,
  "kategoriaJRG": "KSRG",
  "liczbaGotowych": 8,
  "telefon": "+48 12 xxx"
}]`} />
      </div>
    )
  },
  {
    id: 'suggestions',
    title: '💡 Propozycje do dodania',
    icon: '✨',
    content: (
      <div className="space-y-2">
        {[
          { nr: 1, label: '🚗 EV/HEV Database', desc: 'Baza punktów odłączenia zasilania dla ratowników — NFPA 921, EVRescueSheets', added: true },
          { nr: 2, label: '🗺️ Mapa innych OSP', desc: 'Widoczność sąsiednich jednostek z statusem gotowości bojowej', added: true },
          { nr: 3, label: '📊 Dashboard statystyk', desc: 'Wykresy Recharts — trendy miesięczne, typy, ranking druhów', added: true },
          { nr: 4, label: '⏱️ Tracker zadysponowania', desc: 'Real-time timer od alarmu do wyjazdu + porównania historyczne', added: false },
          { nr: 5, label: '📅 Dyżury + Google Calendar', desc: 'Sync z kalendarzem przez CalDAV/iCal', added: false },
          { nr: 6, label: '💬 Real-time Chat', desc: 'WebSocket — pełny czat grupowy (infrastruktura istnieje)', added: false },
          { nr: 7, label: '📸 Galeria akcji', desc: 'Timeline zdjęć per zdarzenie, galeria per rok', added: false },
          { nr: 8, label: '🌡️ Widget pogody', desc: 'Temperatura, wiatr, widoczność przy alarmie (OpenMeteo API — bezpłatne)', added: false },
          { nr: 9, label: '🏆 Gamifikacja', desc: 'Ranking druhów, odznaki, czas reakcji', added: false },
          { nr: 10, label: '📱 Offline mode', desc: 'Pełna synchronizacja z Service Worker + IndexedDB', added: false },
          { nr: 11, label: '🔔 Full-Screen Intent', desc: 'Alarm wybudza ekran z locksreena (natywne Android — OspFirebaseMessagingService)', added: false },
          { nr: 12, label: '⛽ Rozliczenie paliwa', desc: 'Tankowania, koszty, raport miesięczny per pojazd', added: false },
        ].map(({ nr, label, desc, added }) => (
          <div key={nr} className="flex items-start gap-2.5 p-2.5 bg-gray-900/40 rounded-lg border border-gray-800/40">
            <div className={clsx(
              'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5',
              added ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
            )}>
              {added ? '✓' : nr}
            </div>
            <div>
              <div className={clsx('text-xs font-semibold', added ? 'text-green-300' : 'text-gray-200')}>{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
            {added && <span className="ml-auto text-xs text-green-500 flex-shrink-0">Dodano</span>}
          </div>
        ))}
      </div>
    )
  },
];

export const RaportScreen: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>(['stack', 'missing', 'suggestions']);

  const toggle = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-violet-400" /> Raport Reverse Engineering
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">github.com/kajcap72-droid/dexi · e-Remiza Android · 2026-06-10</p>
      </div>

      <div className="p-3 m-4 bg-violet-900/20 border border-violet-500/30 rounded-xl">
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-violet-300">
            <strong>Repozytorium:</strong> Zawiera zdekompilowane library sources (Material Design 3 + Kotlin Coroutines). 
            Kod aplikacyjny (pl.net.abakus.eremiza) nie jest dostępny w repo. 
            Analiza oparta na: Play Store, e-remiza.pl, plikach bibliotek, opisach funkcji.
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-2">
        {sections.map(s => (
          <div key={s.id} className="bg-gray-900/60 border border-gray-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(s.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-800/30 transition-all"
            >
              <span className="text-base flex-shrink-0">{s.icon}</span>
              <span className="text-sm font-semibold text-gray-200 flex-1">{s.title}</span>
              {expanded.includes(s.id)
                ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              }
            </button>
            {expanded.includes(s.id) && (
              <div className="px-4 pb-4 border-t border-gray-800/40">{s.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
