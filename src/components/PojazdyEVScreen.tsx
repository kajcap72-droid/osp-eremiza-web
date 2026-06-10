import React, { useState } from 'react';
import { mockPojazdy_EV } from '../data/mockData';
import { PojazdEV } from '../types';
import { Zap, AlertTriangle, ChevronRight, X, Shield, Battery, Info } from 'lucide-react';
import { clsx } from 'clsx';

const typNapeduLabel: Record<string, string> = {
  BEV: 'Elektryczny (BEV)', PHEV: 'Plug-in Hybrid (PHEV)', HEV: 'Hybryda (HEV)', FCEV: 'Wodorowy (FCEV)'
};
const typNapeduColor: Record<string, string> = {
  BEV: 'bg-green-900/30 border-green-500/30 text-green-400',
  PHEV: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
  HEV: 'bg-cyan-900/30 border-cyan-500/30 text-cyan-400',
  FCEV: 'bg-purple-900/30 border-purple-500/30 text-purple-400',
};

const napiecieWarning = (napiecie?: number) => {
  if (!napiecie) return 'text-gray-400';
  if (napiecie >= 600) return 'text-red-400';
  if (napiecie >= 400) return 'text-orange-400';
  return 'text-yellow-400';
};

function EVCard({ pojazd, onClick }: { pojazd: PojazdEV; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-gray-800/60 bg-gray-900/60 hover:border-gray-700/60 hover:scale-[1.005] transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-900 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-green-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-gray-100">{pojazd.marka} {pojazd.model}</div>
              <div className="text-xs text-gray-400">{pojazd.rok} · {pojazd.wersja}</div>
            </div>
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0', typNapeduColor[pojazd.typNapedu])}>
              {pojazd.typNapedu}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {pojazd.napiecieAkumulatora && (
              <span className={clsx('text-xs flex items-center gap-1 font-mono font-bold', napiecieWarning(pojazd.napiecieAkumulatora))}>
                <Zap className="w-3 h-3" />
                {pojazd.napiecieAkumulatora}V
                {pojazd.napiecieAkumulatora >= 600 && <AlertTriangle className="w-3 h-3 ml-0.5" />}
              </span>
            )}
            {pojazd.pojemnoscBaterii && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Battery className="w-3 h-3" />{pojazd.pojemnoscBaterii} kWh
              </span>
            )}
            <span className="text-xs text-gray-500">{pojazd.mocKW} kW</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
      </div>
      <div className="ml-13 mt-2 text-xs text-gray-500 line-clamp-1 pl-[52px]">
        📍 {pojazd.lokalizacjaOdlaczenia[0]?.nazwa || 'Brak danych o wyłączniku'}
      </div>
    </button>
  );
}

function EVDetail({ pojazd, onClose }: { pojazd: PojazdEV; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'procedura' | 'strefy'>('info');

  const strefaColors: Record<string, string> = {
    czerwony: 'bg-red-900/30 border-red-500/30 text-red-300',
    zolty: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
    zielony: 'bg-green-900/30 border-green-500/30 text-green-300',
  };
  const strefaIcons: Record<string, string> = { czerwony: '🔴', zolty: '🟡', zielony: '🟢' };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-gray-950 border border-gray-800/60 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800/60 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-900 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <div className="font-bold text-gray-100">{pojazd.marka} {pojazd.model}</div>
                <div className="text-xs text-gray-400">{pojazd.rok} · {typNapeduLabel[pojazd.typNapedu]}</div>
              </div>
              {pojazd.napiecieAkumulatora && pojazd.napiecieAkumulatora >= 600 && (
                <div className="flex items-center gap-1 bg-red-900/40 border border-red-500/40 rounded-lg px-2 py-1">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-xs font-bold text-red-300">800V!</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {[
              { key: 'info', label: 'Info' },
              { key: 'procedura', label: 'Procedura' },
              { key: 'strefy', label: 'Strefy' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={clsx(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  tab === t.key
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === 'info' && (
            <>
              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                  <div className="text-xs text-gray-500 mb-1">Typ napędu</div>
                  <span className={clsx('text-sm font-semibold px-2 py-0.5 rounded-full border', typNapeduColor[pojazd.typNapedu])}>
                    {pojazd.typNapedu}
                  </span>
                </div>
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                  <div className="text-xs text-gray-500 mb-1">Napięcie HV</div>
                  <div className={clsx('text-sm font-bold font-mono flex items-center gap-1', napiecieWarning(pojazd.napiecieAkumulatora))}>
                    <Zap className="w-3.5 h-3.5" />
                    {pojazd.napiecieAkumulatora || 'N/A'}V
                  </div>
                </div>
                {pojazd.pojemnoscBaterii && (
                  <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                    <div className="text-xs text-gray-500 mb-1">Bateria</div>
                    <div className="text-sm font-semibold text-gray-200">{pojazd.pojemnoscBaterii} kWh</div>
                  </div>
                )}
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                  <div className="text-xs text-gray-500 mb-1">Moc</div>
                  <div className="text-sm font-semibold text-gray-200">{pojazd.mocKW} kW</div>
                </div>
              </div>

              {/* Lokalizacje odłączenia */}
              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-red-400" /> Lokalizacje wyłączników HV
                </div>
                <div className="space-y-3">
                  {pojazd.lokalizacjaOdlaczenia.map((loc) => (
                    <div key={loc.krok} className="border border-gray-800/60 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                          {loc.krok}
                        </span>
                        <span className="text-sm font-semibold text-gray-200">{loc.nazwa}</span>
                      </div>
                      <div className="ml-7 space-y-1">
                        <div className="text-xs text-blue-300 bg-blue-900/20 border border-blue-500/20 rounded-lg p-2">
                          📍 {loc.lokalizacja}
                        </div>
                        <div className="text-xs text-gray-400">{loc.opis}</div>
                        {loc.ostrzezenie && (
                          <div className="text-xs text-red-300 bg-red-900/20 border border-red-500/20 rounded-lg p-2 flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            {loc.ostrzezenie}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uwagi */}
              <div className="p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
                <div className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Uwagi dla ratowników
                </div>
                <div className="text-xs text-gray-300 leading-relaxed">{pojazd.uwagi}</div>
              </div>

              {/* Źródło */}
              <div className="text-xs text-gray-600 text-center">📚 Źródło: {pojazd.zrodlo}</div>
            </>
          )}

          {tab === 'procedura' && (
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-red-400 font-bold uppercase tracking-wide mb-3 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Procedura bezpieczeństwa
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                {pojazd.proceduraBezpieczenstwa}
              </pre>
            </div>
          )}

          {tab === 'strefy' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Strefy bezpieczeństwa</div>
              {pojazd.strefy.map((s, i) => (
                <div key={i} className={clsx('p-3 rounded-xl border', strefaColors[s.kolor])}>
                  <div className="font-semibold text-sm mb-1">
                    {strefaIcons[s.kolor]} {s.nazwa}
                  </div>
                  <div className="text-xs opacity-80">{s.opis}</div>
                  {s.napiecie && (
                    <div className="text-xs font-mono font-bold mt-1 opacity-90">⚡ {s.napiecie}</div>
                  )}
                </div>
              ))}
              <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-800/40">
                <div className="text-xs text-gray-500 font-medium mb-2">Wymagany sprzęt ochronny:</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Rękawice izolacyjne min. 1000V (klasa 0)</li>
                  <li>• Maty izolacyjne 1kV</li>
                  <li>• Kask ochronny z osłoną twarzy</li>
                  <li>• Obuwie izolacyjne</li>
                  {pojazd.napiecieAkumulatora && pojazd.napiecieAkumulatora >= 600 && (
                    <li className="text-red-300 font-semibold">• System 800V — rękawice klasa 2 (17kV) zalecane!</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const PojazdyEVScreen: React.FC = () => {
  const [selected, setSelected] = useState<PojazdEV | null>(null);
  const [filter, setFilter] = useState<'all' | 'BEV' | 'PHEV' | 'HEV'>('all');

  const filtered = mockPojazdy_EV.filter(p => filter === 'all' || p.typNapedu === filter);

  const counts = {
    BEV: mockPojazdy_EV.filter(p => p.typNapedu === 'BEV').length,
    PHEV: mockPojazdy_EV.filter(p => p.typNapedu === 'PHEV').length,
    HEV: mockPojazdy_EV.filter(p => p.typNapedu === 'HEV').length,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-400" /> Pojazdy EV / Hybrid
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Baza danych punktów odłączenia zasilania · {mockPojazdy_EV.length} pojazdów</p>
      </div>

      {/* Warning */}
      <div className="mx-4 mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-red-300">
          <strong>UWAGA:</strong> Zawsze weryfikuj dane z aktualnym poradnikiem producenta. Modele pojazdów mogą mieć różne konfiguracje w zależności od roku i wersji.
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pt-3 flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `Wszystkie (${mockPojazdy_EV.length})` },
          { key: 'BEV', label: `BEV (${counts.BEV})` },
          { key: 'PHEV', label: `PHEV (${counts.PHEV})` },
          { key: 'HEV', label: `HEV (${counts.HEV})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              filter === f.key
                ? 'bg-green-600/20 border-green-500/40 text-green-400'
                : 'bg-gray-900/40 border-gray-800/40 text-gray-500 hover:text-gray-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map(p => (
          <EVCard key={p.id} pojazd={p} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <EVDetail pojazd={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
