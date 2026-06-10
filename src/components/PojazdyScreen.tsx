import React, { useState } from 'react';
import { mockPojazdy } from '../data/mockData';
import { Pojazd } from '../types';
import { Truck, AlertTriangle, ChevronRight, X, CheckCircle, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

function getTerminStatus(termin: string): { color: string; label: string; urgent: boolean } {
  const d = differenceInDays(parseISO(termin), new Date());
  if (d < 0) return { color: 'text-red-400', label: `Przeterminowany ${Math.abs(d)}d temu`, urgent: true };
  if (d < 30) return { color: 'text-red-400', label: `Za ${d} dni`, urgent: true };
  if (d < 90) return { color: 'text-yellow-400', label: `Za ${d} dni`, urgent: false };
  return { color: 'text-green-400', label: format(parseISO(termin), 'dd.MM.yyyy', { locale: pl }), urgent: false };
}

function VehicleCard({ pojazd, onClick }: { pojazd: Pojazd; onClick: () => void }) {
  const przegladStatus = getTerminStatus(pojazd.przegladTermin);
  const ocStatus = getTerminStatus(pojazd.ocTermin);
  const hasUrgent = przegladStatus.urgent || ocStatus.urgent;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.005]',
        hasUrgent ? 'bg-red-900/10 border-red-500/30' : 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700/60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">🚒</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-100">{pojazd.nazwa}</span>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">{pojazd.numerRejestracyjny}</span>
            {hasUrgent && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
          </div>
          <div className="text-xs text-gray-400">{pojazd.marka} {pojazd.model} · {pojazd.rok}</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="text-xs">
              <span className="text-gray-600">Przegląd: </span>
              <span className={przegladStatus.color}>{przegladStatus.label}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-600">OC: </span>
              <span className={ocStatus.color}>{ocStatus.label}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}

function VehicleDetail({ pojazd, onClose }: { pojazd: Pojazd; onClose: () => void }) {
  const przegladStatus = getTerminStatus(pojazd.przegladTermin);
  const ocStatus = getTerminStatus(pojazd.ocTermin);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-gray-950 border border-gray-800/60 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚒</div>
            <div>
              <div className="font-bold text-gray-100">{pojazd.nazwa}</div>
              <div className="text-xs text-gray-400 font-mono">{pojazd.numerRejestracyjny}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Marka', value: pojazd.marka },
              { label: 'Model', value: pojazd.model },
              { label: 'Rok', value: String(pojazd.rok) },
              { label: 'Typ', value: pojazd.typ },
              { label: 'Przebieg', value: `${pojazd.przebieg.toLocaleString('pl')} km` },
              { label: 'GPS', value: pojazd.stacjonarnyGPS ? 'Tak' : 'Nie' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-gray-200">{value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Terminy</div>
            {[
              { label: 'Przegląd techniczny', termin: pojazd.przegladTermin, status: przegladStatus },
              { label: 'Ubezpieczenie OC', termin: pojazd.ocTermin, status: ocStatus },
            ].map(({ label, status }) => (
              <div key={label} className={clsx(
                'p-3 rounded-xl border flex items-center gap-3',
                status.urgent ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-900/60 border-gray-800/60'
              )}>
                <Calendar className={clsx('w-4 h-4 flex-shrink-0', status.color)} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{label}</div>
                  <div className={clsx('text-sm font-semibold', status.color)}>{status.label}</div>
                </div>
                {!status.urgent && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                {status.urgent && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />}
              </div>
            ))}
          </div>

          {pojazd.numerVIN && (
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 mb-1">Numer VIN</div>
              <div className="text-sm font-mono text-gray-200">{pojazd.numerVIN}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const PojazdyScreen: React.FC = () => {
  const [selected, setSelected] = useState<Pojazd | null>(null);

  const urgent = mockPojazdy.filter(p =>
    differenceInDays(parseISO(p.przegladTermin), new Date()) < 60 ||
    differenceInDays(parseISO(p.ocTermin), new Date()) < 60
  ).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-400" /> Pojazdy
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {mockPojazdy.length} pojazdów
          {urgent > 0 && <span className="text-red-400 ml-2">· {urgent} wymaga uwagi</span>}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {mockPojazdy.map(p => <VehicleCard key={p.id} pojazd={p} onClick={() => setSelected(p)} />)}
      </div>
      {selected && <VehicleDetail pojazd={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
