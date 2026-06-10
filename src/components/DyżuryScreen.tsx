import React, { useState } from 'react';
import { mockDyzury } from '../data/mockData';
import { Dyżur } from '../types';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, isToday, isTomorrow, isFuture, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';

const typConfig: Record<Dyżur['typ'], { label: string; color: string; icon: string }> = {
  dyżur: { label: 'Dyżur', color: 'bg-blue-900/30 border-blue-500/30 text-blue-400', icon: '🛡️' },
  szkolenie: { label: 'Szkolenie', color: 'bg-purple-900/30 border-purple-500/30 text-purple-400', icon: '📚' },
  zbiórka: { label: 'Zbiórka', color: 'bg-orange-900/30 border-orange-500/30 text-orange-400', icon: '👥' },
  inne: { label: 'Inne', color: 'bg-gray-800/40 border-gray-700/40 text-gray-400', icon: '📋' },
};

function getDateLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Dziś';
  if (isTomorrow(d)) return 'Jutro';
  return format(d, 'EEEE, d MMMM', { locale: pl });
}

function DyżurCard({ item }: { item: Dyżur }) {
  const config = typConfig[item.typ];
  const dateLabel = getDateLabel(item.data);
  const isUpcoming = isFuture(parseISO(item.data));
  void isPast; // used below via isPast

  return (
    <div className={clsx(
      'p-4 rounded-xl border transition-all',
      !isUpcoming ? 'opacity-50 bg-gray-900/30 border-gray-800/30' : 'bg-gray-900/60 border-gray-800/60',
      item.obowiazkowy && isUpcoming ? 'border-l-4 border-l-orange-500' : ''
    )}>
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', config.color)}>
              {config.label}
            </span>
            {item.obowiazkowy && isUpcoming && (
              <span className="text-xs text-orange-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> Obowiązkowy
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-gray-100">{item.tytul}</div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-gray-500">
            <span className="flex items-center gap-1 text-gray-300 font-medium">
              <Calendar className="w-3 h-3" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.godzinaStart}{item.godzinaKoniec ? ` – ${item.godzinaKoniec}` : ''}
            </span>
            {item.miejsce && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.miejsce}
              </span>
            )}
          </div>
          {item.opis && <div className="text-xs text-gray-500 mt-1.5">{item.opis}</div>}
        </div>
      </div>
    </div>
  );
}

export const DyżuryScreen: React.FC = () => {
  const [view, setView] = useState<'lista' | 'kalendarz'>('lista');

  const nadchodzace = mockDyzury.filter(d => isFuture(parseISO(d.data)) || isToday(parseISO(d.data)));
  const przeszle = mockDyzury.filter(d => isPast(parseISO(d.data)) && !isToday(parseISO(d.data)));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" /> Dyżury / Kalendarz
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{nadchodzace.length} nadchodzących</p>
      </div>

      <div className="px-4 pt-3 flex gap-2">
        {(['lista', 'kalendarz'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
              view === v
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-400'
                : 'bg-gray-900/40 border-gray-800/40 text-gray-500 hover:text-gray-300'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {view === 'lista' ? (
          <>
            {nadchodzace.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Nadchodzące</div>
                <div className="space-y-2">
                  {nadchodzace.map(d => <DyżurCard key={d.id} item={d} />)}
                </div>
              </div>
            )}
            {przeszle.length > 0 && (
              <div>
                <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">Archiwum</div>
                <div className="space-y-2">
                  {przeszle.map(d => <DyżurCard key={d.id} item={d} />)}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-900/40 rounded-xl border border-gray-800/40 p-6 text-center">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <div className="text-sm text-gray-500">Widok kalendarza</div>
            <div className="text-xs text-gray-600 mt-1">Wymaga połączenia z API e-Remiza</div>
          </div>
        )}
      </div>
    </div>
  );
};
