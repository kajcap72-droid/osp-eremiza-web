import React, { useState } from 'react';
import { Settings, Bell, Map, Moon, Sun, Monitor, Shield, Info, ChevronRight, Server, LogOut, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG, setApiBaseUrl, setApiMode } from '../api/config';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        value ? 'bg-red-600' : 'bg-gray-700'
      )}
    >
      <span className={clsx(
        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
        value ? 'translate-x-5' : 'translate-x-0.5'
      )} />
    </button>
  );
}

export const UstawieniaScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    motyw: 'ciemny' as 'ciemny' | 'jasny' | 'systemowy',
    alarmPush: true,
    alarmDzwiek: true,
    alarmSyrena: true,
    alarmWibracje: true,
    mapInneOSP: true,
    mapHydranty: true,
    gpsTracking: false,
    biometria: true,
  });
  
  // Konfiguracja API
  const [apiUrl, setApiUrl] = useState(API_CONFIG.baseUrl);
  const [apiMode, setApiModeState] = useState<'live' | 'mock' | 'hybrid'>(API_CONFIG.mode);

  const set = (key: keyof typeof settings, val: any) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const handleApiUrlChange = (url: string) => {
    setApiUrl(url);
    setApiBaseUrl(url);
  };

  const handleApiModeChange = (mode: 'live' | 'mock' | 'hybrid') => {
    setApiModeState(mode);
    setApiMode(mode);
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1 mb-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
      </div>
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl overflow-hidden divide-y divide-gray-800/40">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm text-gray-200">{label}</div>
        {sublabel && <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" /> Ustawienia
        </h1>
      </div>

      <div className="p-4 space-y-5 pb-8">
        {/* Profil */}
        <div className="p-4 bg-gray-900/60 border border-gray-800/60 rounded-xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-bold text-white">
            {user?.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-100 text-lg">{user?.displayName || 'Nieznany'}</div>
            <div className="text-sm text-gray-400 capitalize">{user?.role}{user?.jednostka ? ` · ${user.jednostka.nazwa}` : ''}</div>
            {user?.email && <div className="text-xs text-gray-600 mt-0.5">{user.email}</div>}
          </div>
          <button className="text-gray-500 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Powiadomienia */}
        <Section title="Powiadomienia" icon={Bell}>
          <Row label="Alarmy Push" sublabel="FCM — powiadomienie o alarmie">
            <Toggle value={settings.alarmPush} onChange={v => set('alarmPush', v)} />
          </Row>
          <Row label="Dźwięk syreny" sublabel="Pełny dźwięk alarmu">
            <Toggle value={settings.alarmSyrena} onChange={v => set('alarmSyrena', v)} />
          </Row>
          <Row label="Wibracje" sublabel="Długa wibracja przy alarmie">
            <Toggle value={settings.alarmWibracje} onChange={v => set('alarmWibracje', v)} />
          </Row>
          <Row label="Dźwięk powiadomień" sublabel="Standardowy dźwięk">
            <Toggle value={settings.alarmDzwiek} onChange={v => set('alarmDzwiek', v)} />
          </Row>
        </Section>

        {/* Mapa */}
        <Section title="Mapa" icon={Map}>
          <Row label="Pokazuj inne OSP" sublabel="Jednostki w okolicy">
            <Toggle value={settings.mapInneOSP} onChange={v => set('mapInneOSP', v)} />
          </Row>
          <Row label="Pokaż hydranty" sublabel="Źródła wody AbakusOSM">
            <Toggle value={settings.mapHydranty} onChange={v => set('mapHydranty', v)} />
          </Row>
          <Row label="Śledzenie GPS" sublabel="Udostępniaj lokalizację">
            <Toggle value={settings.gpsTracking} onChange={v => set('gpsTracking', v)} />
          </Row>
        </Section>

        {/* Motyw */}
        <Section title="Wygląd" icon={Monitor}>
          <Row label="Motyw aplikacji">
            <div className="flex gap-1">
              {([
                { key: 'ciemny', icon: Moon },
                { key: 'jasny', icon: Sun },
                { key: 'systemowy', icon: Monitor },
              ] as const).map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => set('motyw', key)}
                  className={clsx(
                    'p-2 rounded-lg transition-all',
                    settings.motyw === key
                      ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                      : 'bg-gray-800 border border-transparent text-gray-500 hover:text-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Bezpieczeństwo */}
        <Section title="Bezpieczeństwo" icon={Shield}>
          <Row label="Logowanie biometryczne" sublabel="Odcisk palca / Face ID">
            <Toggle value={settings.biometria} onChange={v => set('biometria', v)} />
          </Row>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm text-gray-200">Zmień hasło</div>
              <div className="text-xs text-gray-500">Ostatnia zmiana: 90 dni temu</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm text-gray-200">Weryfikacja 2FA</div>
              <div className="text-xs text-green-400">Aktywna</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </Section>

        {/* Konfiguracja API */}
        <Section title="Konfiguracja API" icon={Server}>
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-300">
                <strong>Uwaga:</strong> Oficjalne API e-Remiza może blokować żądania CORS. 
                Skonfiguruj własny serwer proxy lub użyj trybu testowego.
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Adres API (base URL)</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => handleApiUrlChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-red-500 font-mono text-xs"
                placeholder="https://app.e-remiza.pl/api"
              />
              <p className="text-xs text-gray-600 mt-1">
                Domyślny: https://app.e-remiza.pl/api
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Tryb połączenia</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'live', label: 'Live', desc: 'Tylko API' },
                  { key: 'hybrid', label: 'Hybrid', desc: 'API + fallback' },
                  { key: 'mock', label: 'Test', desc: 'Dane testowe' },
                ] as const).map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => handleApiModeChange(key)}
                    className={clsx(
                      'p-2 rounded-lg border text-xs transition-all',
                      apiMode === key
                        ? 'bg-red-600/20 border-red-500/40 text-red-400'
                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                    )}
                  >
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* O aplikacji */}
        <Section title="O aplikacji" icon={Info}>
          <Row label="Wersja" sublabel="OSP e-Remiza Web">
            <span className="text-xs text-gray-500 font-mono">2026.1.0</span>
          </Row>
          <Row label="Backend" sublabel="e-Remiza API">
            <span className={clsx('text-xs', API_CONFIG.mode === 'live' ? 'text-green-400' : 'text-yellow-400')}>
              {API_CONFIG.mode === 'live' ? 'Połączony' : API_CONFIG.mode === 'hybrid' ? 'Tryb hybrydowy' : 'Tryb testowy'}
            </span>
          </Row>
          <Row label="Firebase FCM" sublabel="Push notifications">
            <span className="text-xs text-green-400">Aktywny</span>
          </Row>
          <div className="px-4 py-3">
            <div className="text-xs text-gray-600 text-center">
              Abakus Systemy Teleinformatyczne sp. z o.o.<br />
              e-remiza.pl · kontakt@e-remiza.pl
            </div>
          </div>
        </Section>

        <button 
          onClick={logout}
          className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Wyloguj się
        </button>
      </div>
    </div>
  );
};
