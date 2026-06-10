// ============================================
// HOOKI REACT — Pobieranie danych z API
// ============================================
import { useApiData } from './hooks';
import { mockAlarmy, mockCzlonkowie, mockPojazdy, mockPojazdy_EV, mockSprzet, mockDokumenty, mockDyzury, mockStatystyki, mockOspNaMapie, mockHydranty } from '../data/mockData';

/**
 * Hook do pobierania alarmów
 */
export function useAlarms(status?: 'aktywny' | 'zakonczony' | 'wszystkie') {
  const endpoint = `/alarmy${status ? `?status=${status}` : ''}`;
  
  return useApiData(endpoint, {
    fallbackData: mockAlarmy,
    enabled: true,
  });
}

/**
 * Hook do pobierania szczegółów alarmu
 */
export function useAlarm(id: string | null) {
  const endpoint = id ? `/alarmy/${id}` : null;
  
  return useApiData(endpoint || '', {
    fallbackData: id ? mockAlarmy.find(a => a.id === id) || null : null,
    enabled: !!id,
  });
}

/**
 * Hook do pobierania członków
 */
export function useMembers() {
  return useApiData('/czlonkowie', {
    fallbackData: mockCzlonkowie,
    enabled: true,
  });
}

/**
 * Hook do pobierania pojazdów
 */
export function useVehicles() {
  return useApiData('/pojazdy', {
    fallbackData: mockPojazdy,
    enabled: true,
  });
}

/**
 * Hook do pobierania pojazdów EV/HEV
 */
export function useEVVehicles() {
  return useApiData('/pojazdy-ev', {
    fallbackData: mockPojazdy_EV,
    enabled: true,
  });
}

/**
 * Hook do pobierania sprzętu
 */
export function useEquipment() {
  return useApiData('/sprzet', {
    fallbackData: mockSprzet,
    enabled: true,
  });
}

/**
 * Hook do pobierania dokumentów
 */
export function useDocuments(kategoria?: string) {
  const endpoint = kategoria ? `/dokumenty?kategoria=${encodeURIComponent(kategoria)}` : '/dokumenty';
  
  return useApiData(endpoint, {
    fallbackData: mockDokumenty,
    enabled: true,
  });
}

/**
 * Hook do pobierania dyżurów
 */
export function useDuties(od?: string, doDate?: string) {
  const params = new URLSearchParams();
  if (od) params.append('od', od);
  if (doDate) params.append('do', doDate);
  const query = params.toString();
  const endpoint = `/dyzury${query ? `?${query}` : ''}`;
  
  return useApiData(endpoint, {
    fallbackData: mockDyzury,
    enabled: true,
  });
}

/**
 * Hook do pobierania statystyk
 */
export function useStatistics(rok?: number) {
  const endpoint = rok ? `/statystyki?rok=${rok}` : '/statystyki';
  
  return useApiData(endpoint, {
    fallbackData: mockStatystyki,
    enabled: true,
  });
}

/**
 * Hook do pobierania hydrantów
 */
export function useHydrants(lat?: number, lon?: number, radius?: number) {
  const params = new URLSearchParams();
  if (lat !== undefined) params.append('lat', lat.toString());
  if (lon !== undefined) params.append('lon', lon.toString());
  if (radius !== undefined) params.append('promien', radius.toString());
  const query = params.toString();
  const endpoint = `/mapa/hydranty${query ? `?${query}` : ''}`;
  
  return useApiData(endpoint, {
    fallbackData: mockHydranty,
    enabled: true,
  });
}

/**
 * Hook do pobierania innych OSP na mapie
 */
export function useNearbyOSPs(lat: number, lon: number, radius: number = 20) {
  const endpoint = `/mapa/osp?lat=${lat}&lon=${lon}&promien=${radius}`;
  
  return useApiData(endpoint, {
    fallbackData: mockOspNaMapie,
    enabled: true,
  });
}
