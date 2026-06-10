import { useState, useEffect } from 'react';
import { NavSection } from './types';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { AlarmyScreen } from './components/AlarmyScreen';
import { MapaScreen } from './components/MapaScreen';
import { CzlonkowieScreen } from './components/CzlonkowieScreen';
import { DyżuryScreen } from './components/DyżuryScreen';
import { SprzętScreen } from './components/SprzętScreen';
import { PojazdyScreen } from './components/PojazdyScreen';
import { PojazdyEVScreen } from './components/PojazdyEVScreen';
import { DokumentyScreen } from './components/DokumentyScreen';
import { StatystykiScreen } from './components/StatystykiScreen';
import { UstawieniaScreen } from './components/UstawieniaScreen';
import { RaportScreen } from './components/RaportScreen';
import { Menu, Bell, AlertTriangle } from 'lucide-react';
import { mockAlarmy } from './data/mockData';

function AlarmBanner({ onNavigate }: { onNavigate: (s: NavSection) => void }) {
  const [visible, setVisible] = useState(true);
  const activeAlarms = mockAlarmy.filter(a => a.status === 'aktywny');

  if (!visible || activeAlarms.length === 0) return null;

  return (
    <div
      className="mx-3 mt-2 p-3 bg-red-900/80 border border-red-500/60 rounded-xl flex items-center gap-3 cursor-pointer animate-pulse shadow-lg shadow-red-900/30"
      onClick={() => { onNavigate('alarmy'); setVisible(false); }}
    >
      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 animate-bounce">
        <AlertTriangle className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-red-100">
          🔔 Alarm! {activeAlarms[0].typ === 'pozar' ? '🔥 Pożar' : '🚗 Zdarzenie'}
        </div>
        <div className="text-xs text-red-300 truncate">{activeAlarms[0].adres} · {activeAlarms[0].miejscowosc}</div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); setVisible(false); }}
        className="text-red-400 hover:text-white text-xs px-2 py-1 rounded border border-red-500/40 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [section, setSection] = useState<NavSection>('alarmy');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeAlarmCount = mockAlarmy.filter(a => a.status === 'aktywny').length;

  const sectionTitles: Record<NavSection, string> = {
    alarmy: 'Alarmy',
    mapa: 'Mapa Zdarzeń',
    czlonkowie: 'Członkowie',
    'dyżury': 'Dyżury',
    sprzet: 'Sprzęt',
    pojazdy: 'Pojazdy',
    'pojazdy-ev': 'Pojazdy EV/HEV',
    dokumenty: 'Dokumenty',
    statystyki: 'Statystyki',
    ustawienia: 'Ustawienia',
    raport: 'Raport RE',
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Niezalogowany - pokaż ekran logowania
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar desktop */}
      {!isMobile && (
        <Sidebar
          active={section}
          onNavigate={setSection}
          mobile={false}
          open={true}
          onClose={() => {}}
          alarmCount={activeAlarmCount}
        />
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sidebar
          active={section}
          onNavigate={setSection}
          mobile={true}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          alarmCount={activeAlarmCount}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-gray-950 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-gray-900/60 border border-gray-800/60 text-gray-400 hover:text-gray-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="text-sm font-bold text-gray-100">e-Remiza</div>
                <div className="text-xs text-gray-500">{sectionTitles[section]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeAlarmCount > 0 && (
                <button
                  onClick={() => setSection('alarmy')}
                  className="relative p-2 rounded-xl bg-red-900/40 border border-red-500/40 text-red-400"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center animate-pulse">
                    {activeAlarmCount}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Alarm banner — only on non-alarm screens */}
        {section !== 'alarmy' && (
          <AlarmBanner onNavigate={setSection} />
        )}

        {/* Screen content */}
        <div className="flex-1 overflow-hidden">
          {section === 'alarmy' && <AlarmyScreen />}
          {section === 'mapa' && <MapaScreen />}
          {section === 'czlonkowie' && <CzlonkowieScreen />}
          {section === 'dyżury' && <DyżuryScreen />}
          {section === 'sprzet' && <SprzętScreen />}
          {section === 'pojazdy' && <PojazdyScreen />}
          {section === 'pojazdy-ev' && <PojazdyEVScreen />}
          {section === 'dokumenty' && <DokumentyScreen />}
          {section === 'statystyki' && <StatystykiScreen />}
          {section === 'ustawienia' && <UstawieniaScreen />}
          {section === 'raport' && <RaportScreen />}
        </div>
      </div>
    </div>
  );
}
