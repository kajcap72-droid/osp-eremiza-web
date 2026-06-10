import React, { useState } from 'react';
import { mockDokumenty } from '../data/mockData';
import { Dokument } from '../types';
import { FileText, Download, Search, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const typIcons: Record<string, string> = {
  pdf: '📄', docx: '📝', xlsx: '📊', jpg: '🖼️', png: '🖼️', zip: '📦'
};
const typColors: Record<string, string> = {
  pdf: 'text-red-400', docx: 'text-blue-400', xlsx: 'text-green-400'
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const categories = ['Wszystkie', ...Array.from(new Set(mockDokumenty.map(d => d.kategoria)))];

export const DokumentyScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Wszystkie');

  const filtered = mockDokumenty.filter(d => {
    const matchSearch = d.nazwa.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Wszystkie' || d.kategoria === category;
    return matchSearch && matchCat;
  });

  const grouped = filtered.reduce((acc, d) => {
    if (!acc[d.kategoria]) acc[d.kategoria] = [];
    acc[d.kategoria].push(d);
    return acc;
  }, {} as Record<string, Dokument[]>);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" /> Dokumenty
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{mockDokumenty.length} plików · repozytorium jednostki</p>
      </div>

      <div className="px-4 pt-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Szukaj dokumentów..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800/60 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={clsx(
                'px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all',
                category === c
                  ? 'bg-amber-600/20 border-amber-500/40 text-amber-400'
                  : 'bg-gray-900/40 border-gray-800/40 text-gray-500 hover:text-gray-300'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {category === 'Wszystkie'
          ? Object.entries(grouped).map(([cat, docs]) => (
            <div key={cat}>
              <div className="flex items-center gap-1.5 mb-2">
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{cat}</span>
              </div>
              <div className="space-y-2">
                {docs.map(d => <DocCard key={d.id} doc={d} />)}
              </div>
            </div>
          ))
          : <div className="space-y-2">{filtered.map(d => <DocCard key={d.id} doc={d} />)}</div>
        }
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">Brak dokumentów</div>
        )}
      </div>
    </div>
  );
};

function DocCard({ doc }: { doc: Dokument }) {
  return (
    <div className="p-3 rounded-xl border border-gray-800/60 bg-gray-900/60 flex items-center gap-3 hover:border-gray-700/60 transition-all">
      <div className="text-2xl flex-shrink-0">{typIcons[doc.typ] || '📎'}</div>
      <div className="flex-1 min-w-0">
        <div className={clsx('text-sm font-semibold truncate', typColors[doc.typ] || 'text-gray-200')}>{doc.nazwa}</div>
        <div className="text-xs text-gray-500">
          {format(parseISO(doc.data), 'dd.MM.yyyy', { locale: pl })} · {formatSize(doc.rozmiar)} · {doc.autor}
        </div>
      </div>
      <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-all flex-shrink-0">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
