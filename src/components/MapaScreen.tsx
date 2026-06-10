import React, { useEffect, useRef, useState } from 'react';
import { mockAlarmy, mockOspNaMapie, mockHydranty, REMIZA_LAT, REMIZA_LON, UNIT_NAME } from '../data/mockData';
import { MapPin, Navigation, X, Phone, Shield, Droplets, Radio, Flame } from 'lucide-react';
import { clsx } from 'clsx';

interface MapItem {
  type: 'alarm' | 'osp' | 'hydrant' | 'remiza';
  id: string;
  lat: number;
  lon: number;
  label: string;
  data: any;
}

interface LegendItem {
  color: string;
  label: string;
  active: boolean;
  key: string;
}

export const MapaScreen: React.FC = () => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selected, setSelected] = useState<MapItem | null>(null);
  const [layers, setLayers] = useState({ alarmy: true, osp: true, hydranty: true, remiza: true });
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
          center: [REMIZA_LAT, REMIZA_LON],
          zoom: 13,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        if (isMounted) setMapReady(true);
      } catch (e) {
        console.error('Map init error:', e);
      }
    };
    initMap();
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const addMarker = (lat: number, lon: number, color: string, icon: string, item: MapItem) => {
      const el = document.createElement('div');
      el.style.cssText = `
        width:32px;height:32px;border-radius:50%;
        background:${color};border:2px solid rgba(255,255,255,0.4);
        display:flex;align-items:center;justify-content:center;
        font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);
        transition:transform 0.15s;
      `;
      el.textContent = icon;
      el.onmouseenter = () => { el.style.transform = 'scale(1.2)'; };
      el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
      el.onclick = () => setSelected(item);

      const marker = L.marker([lat, lon], {
        icon: L.divIcon({ html: el, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    };

    // Remiza
    if (layers.remiza) {
      addMarker(REMIZA_LAT, REMIZA_LON, '#ef4444', '🏠', {
        type: 'remiza', id: 'remiza', lat: REMIZA_LAT, lon: REMIZA_LON, label: UNIT_NAME, data: { name: UNIT_NAME }
      });
    }

    // Alarmy
    if (layers.alarmy) {
      mockAlarmy.forEach(a => {
        const color = a.status === 'aktywny' ? '#ef4444' : '#6b7280';
        const icon = a.typ === 'pozar' ? '🔥' : a.typ === 'wypadek' ? '🚗' : '⚙️';
        addMarker(a.lat, a.lon, color, icon, {
          type: 'alarm', id: a.id, lat: a.lat, lon: a.lon, label: a.adres, data: a
        });
      });
    }

    // Inne OSP
    if (layers.osp) {
      mockOspNaMapie.forEach(osp => {
        addMarker(osp.lat, osp.lon, osp.gotowoscBojowa ? '#22c55e' : '#eab308', '🚒', {
          type: 'osp', id: osp.id, lat: osp.lat, lon: osp.lon, label: osp.nazwa, data: osp
        });
      });
    }

    // Hydranty
    if (layers.hydranty) {
      mockHydranty.forEach(h => {
        addMarker(h.lat, h.lon, h.sprawny ? '#3b82f6' : '#9ca3af', '💧', {
          type: 'hydrant', id: h.id, lat: h.lat, lon: h.lon, label: h.adres, data: h
        });
      });
    }
  }, [mapReady, layers]);

  const centerOnRemiza = () => {
    mapInstanceRef.current?.setView([REMIZA_LAT, REMIZA_LON], 14);
  };

  const legendItems: LegendItem[] = [
    { key: 'remiza', color: '#ef4444', label: 'Remiza', active: layers.remiza },
    { key: 'alarmy', color: '#f97316', label: 'Zdarzenia', active: layers.alarmy },
    { key: 'osp', color: '#22c55e', label: 'Inne OSP', active: layers.osp },
    { key: 'hydranty', color: '#3b82f6', label: 'Hydranty', active: layers.hydranty },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60 flex items-center justify-between z-10 bg-gray-950">
        <div>
          <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" /> Mapa Zdarzeń
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">OpenStreetMap · AbakusOSM</p>
        </div>
        <button
          onClick={centerOnRemiza}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 hover:bg-blue-900/50 transition-all"
        >
          <Radio className="w-4 h-4" /> Remiza
        </button>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-gray-800/40 bg-gray-950/80 z-10">
        {legendItems.map(item => (
          <button
            key={item.key}
            onClick={() => setLayers(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
              item.active
                ? 'text-gray-100 border-gray-600/60 bg-gray-800/60'
                : 'text-gray-600 border-gray-800/40 bg-gray-900/40 line-through'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" style={{ zIndex: 1 }} />

        {/* Selected Popup */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-gray-950/95 border border-gray-800/60 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {selected.type === 'alarm' && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-bold text-gray-100">{selected.label}</span>
                        {selected.data.status === 'aktywny' && (
                          <span className="text-xs text-red-400 animate-pulse font-bold">● AKTYWNY</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{selected.data.opis}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex items-center gap-1 text-xs bg-blue-900/30 border border-blue-500/30 text-blue-400 px-2 py-1 rounded-lg">
                          <Navigation className="w-3 h-3" /> Nawiguj
                        </button>
                      </div>
                    </>
                  )}
                  {selected.type === 'osp' && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-gray-100">{selected.label}</span>
                        <span className={clsx('text-xs px-1.5 rounded-full font-semibold',
                          selected.data.gotowoscBojowa ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                        )}>
                          {selected.data.gotowoscBojowa ? 'GOTOWA' : 'NIEGOTOWA'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{selected.data.adres}</div>
                      {selected.data.kategoriaJRG && (
                        <div className="text-xs text-gray-500">{selected.data.kategoriaJRG}</div>
                      )}
                      {selected.data.telefon && (
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${selected.data.telefon}`} className="flex items-center gap-1 text-xs bg-green-900/30 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg">
                            <Phone className="w-3 h-3" /> Zadzwoń
                          </a>
                          <button className="flex items-center gap-1 text-xs bg-blue-900/30 border border-blue-500/30 text-blue-400 px-2 py-1 rounded-lg">
                            <Navigation className="w-3 h-3" /> Nawiguj
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {selected.type === 'hydrant' && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-gray-100">{selected.data.typ === 'nadziemny' ? 'Hydrant nadziemny' : 'Hydrant podziemny'}</span>
                        <span className={clsx('text-xs px-1.5 rounded-full font-semibold',
                          selected.data.sprawny ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                        )}>
                          {selected.data.sprawny ? 'SPRAWNY' : 'NIESPRAWNY'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{selected.label}</div>
                      {selected.data.srednica && <div className="text-xs text-gray-500">Śr. {selected.data.srednica}mm {selected.data.wydajnosc && `· ${selected.data.wydajnosc} m³/h`}</div>}
                    </>
                  )}
                  {selected.type === 'remiza' && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-bold text-gray-100">{selected.label}</span>
                      </div>
                      <div className="text-xs text-gray-400">Remiza macierzysta</div>
                    </>
                  )}
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
