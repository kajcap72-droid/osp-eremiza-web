import React, { useState } from 'react';
import { mockSprzet } from '../data/mockData';
import { Sprzet } from '../types';
import { Wrench, AlertTriangle, ChevronRight, X, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

const stanColors: Record<Sprzet['stan'], string> = {
  sprawny: 'text-green-400 bg-green-900/20 border-green-500/20',
  naprawa: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20',
  wycofany: 'text-gray-500 bg-gray-800/20 border-gray-700/20',
};
const stanLabels: Record<Sprzet['stan'], string> = {
  sprawny: 'Sprawny', naprawa: 'W naprawie', wycofany: 'Wycofany'
};

function getDateStatus(termin?: string): { urgent: boolean; label: string; color: string } {
  if (!termin) return { urgent: false, label: 'Brak terminu', color: 'text-gray-500' };
  const d = differenceInDays(parseISO(termin), new Date());
  if (d < 0) return { urgent: true, label: `Przeterminowane`, color: 'text-red-400' };
  if (d < 60) return { urgent: true, label: `Za ${d} dni`, color: 'text-red-400' };
  if (d < 180) return { urgent: false, label: `Za ${d} dni`, color: 'text-yellow-400' };
  return { urgent: false, label: format(parseISO(termin), 'dd.MM.yyyy', { locale: pl }), color: 'text-green-400' };
}

function SprzętCard({ item, onClick }: { item: Sprzet; onClick: () => void }) {
  const legalizacja = getDateStatus(item.legalizacjaTermin);
  const przeglad = getDateStatus(item.przegladTermin);
  const hasUrgent = legalizacja.urgent || przeglad.urgent || item.stan === 'naprawa';

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.005]',
        hasUrgent ? 'bg-red-900/10 border-red-500/30' : 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700/60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
          <Wrench className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-100 truncate">{item.nazwa}</span>
            {hasUrgent && <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{item.typ}</span>
            <span className="text-gray-700">·</span>
            <span className={clsx('text-xs px-1.5 py-0.5 rounded-full border', stanColors[item.stan])}>{stanLabels[item.stan]}</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">{item.lokalizacja}</div>
          {(item.legalizacjaTermin || item.przegladTermin) && (
            <div className="flex gap-3 mt-1.5">
              {item.legalizacjaTermin && (
                <span className={clsx('text-xs', legalizacja.color)}>Legalizacja: {legalizacja.label}</span>
              )}
              {item.przegladTermin && (
                <span className={clsx('text-xs', przeglad.color)}>Przegląd: {przeglad.label}</span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}

export const SprzętScreen: React.FC = () => {
  const [selected, setSelected] = useState<Sprzet | null>(null);

  const urgent = mockSprzet.filter(s =>
    s.stan === 'naprawa' ||
    getDateStatus(s.legalizacjaTermin).urgent ||
    getDateStatus(s.przegladTermin).urgent
  ).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" /> Sprzęt
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {mockSprzet.length} pozycji
          {urgent > 0 && <span className="text-red-400 ml-2">· {urgent} wymaga uwagi</span>}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {mockSprzet.map(s => <SprzętCard key={s.id} item={s} onClick={() => setSelected(s)} />)}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-gray-950 border border-gray-800/60 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-100">{selected.nazwa}</div>
                <span className={clsx('text-xs px-1.5 py-0.5 rounded-full border', stanColors[selected.stan])}>
                  {stanLabels[selected.stan]}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Typ', value: selected.typ },
                { label: 'Nr seryjny', value: selected.numerSeryjny || '—' },
                { label: 'Lokalizacja', value: selected.lokalizacja },
                { label: 'Data zakupu', value: selected.dataZakupu ? format(parseISO(selected.dataZakupu), 'dd.MM.yyyy', { locale: pl }) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-sm text-gray-200">{value}</div>
                </div>
              ))}
              {selected.legalizacjaTermin && (
                <div className={clsx('p-3 rounded-xl border flex items-center gap-3',
                  getDateStatus(selected.legalizacjaTermin).urgent ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-900/60 border-gray-800/60'
                )}>
                  <Calendar className={clsx('w-4 h-4', getDateStatus(selected.legalizacjaTermin).color)} />
                  <div>
                    <div className="text-xs text-gray-500">Legalizacja</div>
                    <div className={clsx('text-sm font-semibold', getDateStatus(selected.legalizacjaTermin).color)}>
                      {getDateStatus(selected.legalizacjaTermin).label} — {format(parseISO(selected.legalizacjaTermin), 'dd.MM.yyyy', { locale: pl })}
                    </div>
                  </div>
                </div>
              )}
              {selected.uwagi && (
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                  <div className="text-xs text-gray-500 mb-1">Uwagi</div>
                  <div className="text-sm text-gray-300">{selected.uwagi}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
