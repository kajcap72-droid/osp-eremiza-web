import React, { useState } from 'react';
import { Czlonek } from '../types';
import { mockCzlonkowie } from '../data/mockData';
import { Users, Phone, Shield, Award, Calendar, Search, ChevronRight, X, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';

function getBadanieStatus(badanieWazne?: string): { color: string; label: string } {
  if (!badanieWazne) return { color: 'text-gray-500', label: 'Brak danych' };
  const daysLeft = differenceInDays(parseISO(badanieWazne), new Date());
  if (daysLeft < 0) return { color: 'text-red-400', label: `Przeterminowane ${Math.abs(daysLeft)}d` };
  if (daysLeft < 90) return { color: 'text-yellow-400', label: `Wygasa za ${daysLeft}d` };
  return { color: 'text-green-400', label: `Ważne do ${format(parseISO(badanieWazne), 'MM.yyyy')}` };
}

function MemberCard({ member, onClick }: { member: Czlonek; onClick: () => void }) {
  const badanie = getBadanieStatus(member.badanieWazne);
  const initials = `${member.imie[0]}${member.nazwisko[0]}`;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.005]',
        member.aktywny
          ? 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700/60'
          : 'bg-gray-900/30 border-gray-800/30 opacity-60'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
          member.aktywny ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white' : 'bg-gray-800 text-gray-500'
        )}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-100">{member.imie} {member.nazwisko}</span>
            {!member.aktywny && <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">Nieaktywny</span>}
          </div>
          <div className="text-xs text-gray-400">{member.stopien} · {member.funkcja}</div>
          <div className="flex items-center gap-3 mt-1">
            <span className={clsx('text-xs flex items-center gap-1', badanie.color)}>
              {badanie.label.startsWith('Przeterminowane') ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              {badanie.label}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />{member.liczbaMisji} misji
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
      </div>
    </button>
  );
}

function MemberDetail({ member, onClose }: { member: Czlonek; onClose: () => void }) {
  const badanie = getBadanieStatus(member.badanieWazne);
  const initials = `${member.imie[0]}${member.nazwisko[0]}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-gray-950 border border-gray-800/60 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <div className="font-bold text-gray-100">{member.imie} {member.nazwisko}</div>
                <div className="text-xs text-gray-400">{member.stopien}</div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Kontakt */}
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60 space-y-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Kontakt</div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${member.telefon}`} className="text-sm text-blue-400 hover:underline">{member.telefon}</a>
            </div>
            {member.email && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-gray-500 text-xs">@</span>
                <span className="text-sm text-gray-300">{member.email}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 mb-1">Funkcja</div>
              <div className="text-sm font-semibold text-gray-200">{member.funkcja}</div>
            </div>
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 mb-1">Misje</div>
              <div className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                {member.liczbaMisji}
              </div>
            </div>
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 mb-1">W OSP od</div>
              <div className="text-sm font-semibold text-gray-200">
                {format(parseISO(member.dataWstapienia), 'MM.yyyy', { locale: pl })}
              </div>
            </div>
            {member.sredniCzasReakcji && (
              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
                <div className="text-xs text-gray-500 mb-1">Śr. czas reakcji</div>
                <div className="text-sm font-semibold text-gray-200">{member.sredniCzasReakcji}s</div>
              </div>
            )}
          </div>

          {/* Badania */}
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Badania lekarskie
            </div>
            <div className={clsx('text-sm font-semibold flex items-center gap-2', badanie.color)}>
              {badanie.label.startsWith('Przeterminowane') ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {badanie.label}
            </div>
            {member.badanieWazne && (
              <div className="text-xs text-gray-500 mt-1">Ważne do: {format(parseISO(member.badanieWazne), 'dd.MM.yyyy', { locale: pl })}</div>
            )}
          </div>

          {/* Uprawnienia */}
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Uprawnienia
            </div>
            <div className="flex flex-wrap gap-1.5">
              {member.uprawnienia.map((u, i) => (
                <span key={i} className="text-xs bg-blue-900/30 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Szkolenia */}
          {member.szkolenia.length > 0 && (
            <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/60">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Szkolenia
              </div>
              <div className="space-y-2">
                {member.szkolenia.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-200">{s.nazwa}</div>
                      <div className="text-xs text-gray-500">{format(parseISO(s.data), 'dd.MM.yyyy', { locale: pl })}</div>
                    </div>
                    {s.waznosc && (
                      <span className={clsx('text-xs px-1.5 py-0.5 rounded-full',
                        differenceInDays(parseISO(s.waznosc), new Date()) > 90
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      )}>
                        do {format(parseISO(s.waznosc), 'MM.yyyy')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const CzlonkowieScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Czlonek | null>(null);
  const [filter, setFilter] = useState<'wszyscy' | 'aktywni'>('aktywni');

  const filtered = mockCzlonkowie.filter(m => {
    const matchSearch = `${m.imie} ${m.nazwisko} ${m.funkcja}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'wszyscy' || m.aktywny;
    return matchSearch && matchFilter;
  });

  const aktywni = mockCzlonkowie.filter(m => m.aktywny).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Członkowie
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{aktywni} aktywnych · {mockCzlonkowie.length} łącznie</p>
      </div>

      <div className="px-4 pt-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Szukaj druhów..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800/60 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
        <div className="flex gap-2">
          {(['aktywni', 'wszyscy'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize',
                filter === f
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                  : 'bg-gray-900/40 border-gray-800/40 text-gray-500 hover:text-gray-300'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map(m => (
          <MemberCard key={m.id} member={m} onClick={() => setSelected(m)} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">Brak wyników</div>
        )}
      </div>

      {selected && <MemberDetail member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
