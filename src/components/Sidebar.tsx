import React from 'react';
import { NavSection } from '../types';
import {
  Bell, Map, Users, Calendar, Wrench, Truck, FileText,
  BarChart2, Settings, Zap, ChevronRight, Radio, X, FileSearch
} from 'lucide-react';
import { UNIT_NAME } from '../data/mockData';
import { clsx } from 'clsx';

interface SidebarProps {
  active: NavSection;
  onNavigate: (s: NavSection) => void;
  mobile: boolean;
  open: boolean;
  onClose: () => void;
  alarmCount?: number;
}

const navItems: { id: NavSection; label: string; icon: React.ComponentType<any>; badge?: string }[] = [
  { id: 'alarmy', label: 'Alarmy', icon: Bell },
  { id: 'mapa', label: 'Mapa zdarzeń', icon: Map },
  { id: 'czlonkowie', label: 'Członkowie', icon: Users },
  { id: 'dyżury', label: 'Dyżury / Kalendarz', icon: Calendar },
  { id: 'sprzet', label: 'Sprzęt', icon: Wrench },
  { id: 'pojazdy', label: 'Pojazdy', icon: Truck },
  { id: 'pojazdy-ev', label: 'Pojazdy EV/HEV', icon: Zap },
  { id: 'dokumenty', label: 'Dokumenty', icon: FileText },
  { id: 'statystyki', label: 'Statystyki', icon: BarChart2 },
  { id: 'raport', label: 'Raport RE', icon: FileSearch },
  { id: 'ustawienia', label: 'Ustawienia', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate, mobile, open, onClose, alarmCount }) => {
  const content = (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800/60 w-64 select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/40">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white leading-tight">e-Remiza</div>
          <div className="text-xs text-gray-400 truncate leading-tight">{UNIT_NAME}</div>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); if (mobile) onClose(); }}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-red-600/20 text-red-400 border border-red-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent'
              )}
            >
              <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-red-400' : 'text-gray-500 group-hover:text-gray-300')} />
              <span className="flex-1 text-left">{label}</span>
              {id === 'alarmy' && alarmCount && alarmCount > 0 ? (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {alarmCount}
                </span>
              ) : null}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-800/60 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            JK
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-200 truncate">Jan Kowalski</div>
            <div className="text-xs text-gray-500 truncate">Naczelnik</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" title="Online" />
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        {open && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-50 flex-shrink-0">
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return <div className="flex-shrink-0 hidden md:block">{content}</div>;
};
