import React, { useState } from 'react';
import { Alarm, AlarmType, ParticipationStatus } from '../types';
import { mockAlarmy } from '../data/mockData';
import { Bell, MapPin, Clock, Users, CheckCircle, XCircle, ChevronRight, Siren, Info, X, Navigation } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { clsx } from 'clsx';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';

const typLabels: Record<AlarmType, string> = {
  pozar: 'Pożar', wypadek: 'Wypadek', techniczne: 'Tech.', medyczne: 'Medyczne', ekologiczne: 'Ekolog.', inne: 'Inne'
};

const typColors: Record<AlarmType, string> = {
  pozar: 'bg-red-500/20 text-red-400 border-red-500/30',
  wypadek: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  techniczne: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medyczne: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  ekologiczne: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inne: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const typIcons: Record<AlarmType, string> = {
  pozar: '🔥', wypadek: '🚗', techniczne: '⚙️', medyczne: '🏥', ekologiczne: '🌿', inne: '📋'
};

function AlarmCard({ alarm, onClick }: { alarm: Alarm; onClick: () => void }) {
  const timeAgo = formatDistanceToNow(new Date(alarm.dataczas), { locale: pl, addSuffix: true });
  const isActive = alarm.status === 'aktywny';

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
        isActive
          ? 'bg-red-900/20 border-red-500/40 shadow-lg shadow-red-900/20'
          : 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700/60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('text-2xl leading-none mt-0.5')}>{typIcons[alarm.typ]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', typColors[alarm.typ])}>
              {typLabels[alarm.typ]}
            </span>
            <span className="text-xs text-gray-500 font-mono">#{alarm.numer}</span>
            {isActive && (
              <span className="flex items-center gap-1 text-xs text-red-400 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                AKTYWNY
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-100 truncate">{alarm.adres}</div>
          <div className="text-xs text-gray-400 truncate">{alarm.miejscowosc}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />
              <span className="text-green-400">{alarm.liczbaJadacych} jedzie</span>
              {alarm.liczbaOdrzucajacych > 0 && <span className="text-red-400">, {alarm.liczbaOdrzucajacych} nie</span>}
            </span>
            {alarm.czasZadysponowania && (
              <span className="flex items-center gap-1"><Bell className="w-3 h-3" />{Math.floor(alarm.czasZadysponowania / 60)}m {alarm.czasZadysponowania % 60}s</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
      </div>
      {alarm.opis && (
        <div className="mt-2 ml-9 text-xs text-gray-500 line-clamp-2">{alarm.opis}</div>
      )}
    </button>
  );
}

function AlarmDetail({ alarm, onClose, onConfirm }: { alarm: Alarm; onClose: () => void; onConfirm: (status: ParticipationStatus) => void }) {
  const isActive = alarm.status === 'aktywny';
  const dt = format(new Date(alarm.dataczas), 'dd.MM.yyyy HH:mm', { locale: pl });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-gray-950 border border-gray-800/60 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className={clsx('p-4 border-b border-gray-800/60 sticky top-0 z-10', isActive ? 'bg-red-950/80' : 'bg-gray-950')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{typIcons[alarm.typ]}</span>
              <div>
                <div className={clsx('text-sm font-bold px-2 py-0.5 rounded-full inline-block', typColors[alarm.typ])}>
                  {typLabels[alarm.typ]}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">#{alarm.numer}</div>
              </div>
              {isActive && <span className="ml-2 text-xs font-bold text-red-400 animate-pulse">● AKTYWNY</span>}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Adres */}
          <div className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
            <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-gray-100">{alarm.adres}</div>
              <div className="text-sm text-gray-400">{alarm.miejscowosc}</div>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-500/20">
              <Navigation className="w-3 h-3" />Nawiguj
            </button>
          </div>

          {/* Mini-mapa placeholder */}
          <div className="rounded-xl overflow-hidden border border-gray-800/60 bg-gray-900/60 h-36 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-red-400 mx-auto mb-1" />
                <div className="text-xs text-gray-500">Mini-mapa: {alarm.lat.toFixed(4)}, {alarm.lon.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Pogoda */}
          <WeatherWidget lat={alarm.lat} lon={alarm.lon} />

          {/* Opis */}
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Opis zdarzenia</div>
            <div className="text-sm text-gray-200">{alarm.opis}</div>
          </div>

          {/* Czasy */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 mb-1">Data/czas</div>
              <div className="text-sm font-mono text-gray-200">{dt}</div>
            </div>
            {alarm.czasZadysponowania && (
              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                <div className="text-xs text-gray-500 mb-1">Czas zadysponowania</div>
                <div className="text-sm font-mono text-gray-200">
                  {Math.floor(alarm.czasZadysponowania / 60)}m {alarm.czasZadysponowania % 60}s
                </div>
              </div>
            )}
          </div>

          {/* Obsada */}
          {alarm.obsada && alarm.obsada.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Obsada ({alarm.obsada.length})</div>
              <div className="space-y-2">
                {alarm.obsada.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800/40">
                    <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">
                      {o.imieNazwisko.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-200">{o.imieNazwisko}</div>
                      <div className="text-xs text-gray-500 capitalize">{o.rola} · {o.dystans}km</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Akcje — jadę/nie jadę */}
          {isActive && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onConfirm('jade')}
                className={clsx(
                  'flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                  alarm.potwierdzenieStatus === 'jade'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/40 scale-105'
                    : 'bg-green-900/30 border border-green-500/30 text-green-400 hover:bg-green-900/50'
                )}
              >
                <CheckCircle className="w-5 h-5" />
                JADĘ
              </button>
              <button
                onClick={() => onConfirm('nie_jade')}
                className={clsx(
                  'flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                  alarm.potwierdzenieStatus === 'nie_jade'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 scale-105'
                    : 'bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-900/50'
                )}
              >
                <XCircle className="w-5 h-5" />
                NIE JADĘ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const AlarmyScreen: React.FC = () => {
  const [alarmy, setAlarmy] = useState<Alarm[]>(mockAlarmy);
  const [selected, setSelected] = useState<Alarm | null>(null);
  const [simAlert, setSimAlert] = useState(false);

  const handleConfirm = (status: ParticipationStatus) => {
    if (!selected) return;
    setAlarmy(prev => prev.map(a => a.id === selected.id ? { ...a, potwierdzenieStatus: status } : a));
    setSelected(prev => prev ? { ...prev, potwierdzenieStatus: status } : null);
  };

  const simulateAlarm = () => {
    const newAlarm: Alarm = {
      id: `sim_${Date.now()}`,
      numer: '2026/SIM',
      typ: 'pozar',
      status: 'aktywny',
      adres: 'ul. Symulacji 1 [TEST]',
      miejscowosc: 'Kraków',
      opis: '⚠️ ALARM TESTOWY — symulacja powiadomienia e-Remiza. Nie wyjeżdżać!',
      dataczas: new Date().toISOString(),
      lat: 50.065,
      lon: 19.940,
      potwierdzenieStatus: 'oczekuje',
      liczbaJadacych: 0,
      liczbaOdrzucajacych: 0,
    };
    setAlarmy(prev => [newAlarm, ...prev]);
    setSimAlert(true);
    setTimeout(() => setSimAlert(false), 5000);
  };

  const aktywne = alarmy.filter(a => a.status === 'aktywny');
  const zakonczone = alarmy.filter(a => a.status !== 'aktywny');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" /> Alarmy
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">{aktywne.length} aktywnych · {zakonczone.length} zakończonych</p>
        </div>
        <button
          onClick={simulateAlarm}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-orange-900/30 border border-orange-500/30 text-orange-400 hover:bg-orange-900/50 transition-all"
        >
          <Siren className="w-4 h-4" /> Symuluj
        </button>
      </div>

      {/* Sim banner */}
      {simAlert && (
        <div className="mx-4 mt-3 p-3 bg-orange-900/40 border border-orange-500/40 rounded-xl flex items-center gap-2 animate-bounce">
          <Siren className="w-5 h-5 text-orange-400 animate-pulse" />
          <span className="text-sm font-bold text-orange-300">🔔 Alarm symulacyjny wysłany! (DEV TEST)</span>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {aktywne.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Aktywne</span>
            </div>
            <div className="space-y-2">
              {aktywne.map(a => <AlarmCard key={a.id} alarm={a} onClick={() => setSelected(a)} />)}
            </div>
          </div>
        )}

        {zakonczone.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Historia</span>
            </div>
            <div className="space-y-2">
              {zakonczone.map(a => <AlarmCard key={a.id} alarm={a} onClick={() => setSelected(a)} />)}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <AlarmDetail
          alarm={selected}
          onClose={() => setSelected(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
