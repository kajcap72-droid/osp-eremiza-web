import React from 'react';
import { mockStatystyki, mockCzlonkowie } from '../data/mockData';
import { BarChart2, TrendingUp, Clock, Users, Award, Flame, Car, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { AlarmType } from '../types';
import { ExportStats } from './ExportStats';

const MONTHS = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];

const typLabels: Record<AlarmType, string> = {
  pozar: 'Pożar', wypadek: 'Wypadek', techniczne: 'Tech.', medyczne: 'Medyczne', ekologiczne: 'Ekolog.', inne: 'Inne'
};
const typColors: Record<AlarmType, string> = {
  pozar: '#ef4444', wypadek: '#f97316', techniczne: '#3b82f6', medyczne: '#ec4899', ekologiczne: '#22c55e', inne: '#6b7280'
};

const DARK_TOOLTIP = {
  contentStyle: { backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 },
  labelStyle: { color: '#d1d5db' },
  itemStyle: { color: '#9ca3af' },
};

export const StatystykiScreen: React.FC = () => {
  const stats = mockStatystyki.roczne;

  const miesiacData = stats.wgMiesiaca.map((val, i) => ({
    name: MONTHS[i], alarmy: val
  })).filter(d => d.alarmy > 0);

  const typData = (Object.entries(stats.wgTypu) as [AlarmType, number][]).map(([typ, val]) => ({
    name: typLabels[typ], value: val, color: typColors[typ]
  }));

  const topData = stats.topDruhowie.map(d => ({
    name: d.imieNazwisko.split(' ')[1], alarmy: d.liczbaAlarmow, czas: d.sredniCzasReakcji
  }));

  const statCards = [
    {
      label: 'Alarmów w roku',
      value: stats.alarmyRazem,
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-900/20 border-red-500/20',
    },
    {
      label: 'Śr. zadysponowanie',
      value: `${Math.floor(stats.sredniCzasZadysponowania / 60)}m ${stats.sredniCzasZadysponowania % 60}s`,
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-900/20 border-orange-500/20',
    },
    {
      label: 'Aktywnych druhów',
      value: mockCzlonkowie.filter(m => m.aktywny).length,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20 border-blue-500/20',
    },
    {
      label: 'Przebieg łącznie',
      value: `${stats.calkowityPrzebieg.toLocaleString('pl')} km`,
      icon: Car,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20 border-emerald-500/20',
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60 sticky top-0 bg-gray-950 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-400" /> Statystyki
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Rok {stats.rok} · dane na bieżąco</p>
          </div>
          <ExportStats />
        </div>
      </div>

      <div className="p-4 space-y-5 pb-8">
        {/* Karty */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`p-4 rounded-xl border ${bg}`}>
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Wykres miesięczny */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800/60 p-4">
          <div className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> Alarmy wg miesiąca
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={miesiacData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip {...DARK_TOOLTIP} />
              <Bar dataKey="alarmy" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800/60 p-4">
          <div className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" /> Podział wg typu
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={140}>
              <PieChart>
                <Pie data={typData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                  {typData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...DARK_TOOLTIP} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {typData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400 flex-1">{item.name}</span>
                  <span className="text-gray-200 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top druhowie */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800/60 p-4">
          <div className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" /> Top druhowie
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={topData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={50} />
              <Tooltip {...DARK_TOOLTIP} />
              <Bar dataKey="alarmy" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {stats.topDruhowie.map((d, i) => (
              <div key={d.czlonekId} className="flex items-center gap-3 p-2 bg-gray-900/40 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-yellow-500 text-gray-900' : i === 1 ? 'bg-gray-400 text-gray-900' : 'bg-orange-700 text-white'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 text-sm text-gray-200">{d.imieNazwisko}</div>
                <div className="text-xs text-gray-400">{d.liczbaAlarmow} misji</div>
                <div className="text-xs text-gray-500">{d.sredniCzasReakcji}s</div>
              </div>
            ))}
          </div>
        </div>

        {/* Czas zadysponowania trend */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800/60 p-4">
          <div className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" /> Trend czasu zadysponowania
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={[
              { name: 'Sty', czas: 201 }, { name: 'Lut', czas: 195 }, { name: 'Mar', czas: 188 },
              { name: 'Kwi', czas: 182 }, { name: 'Maj', czas: 179 }, { name: 'Cze', czas: 187 },
            ]} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip {...DARK_TOOLTIP} formatter={(v: any) => [`${v}s`, 'Czas']} />
              <Line type="monotone" dataKey="czas" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
