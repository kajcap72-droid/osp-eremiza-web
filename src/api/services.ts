// ============================================
// SERWIS API — DOKUMENTY, DYŻURY, STATYSTYKI, MAPA
// ============================================
import { apiClient } from './client';
import { Dokument, Dyżur, Statystyki, OspNaMapie, Hydrant } from '../types';

// ===== DOKUMENTY =====
class DocumentsService {
  async getDocuments(kategoria?: string): Promise<Dokument[]> {
    const query = kategoria ? `?kategoria=${encodeURIComponent(kategoria)}` : '';
    return apiClient.get<Dokument[]>(`/dokumenty${query}`);
  }

  async downloadDocument(id: string): Promise<Blob> {
    return apiClient.request(`/dokumenty/${id}/download`, {
      method: 'GET',
      headers: { Accept: 'application/octet-stream' },
    });
  }

  async uploadDocument(file: File, kategoria: string): Promise<Dokument> {
    const formData = new FormData();
    formData.append('plik', file);
    formData.append('kategoria', kategoria);

    return apiClient.request('/dokumenty/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }
}

// ===== DYŻURY =====
class DutiesService {
  async getDuties(od?: string, doDate?: string): Promise<Dyżur[]> {
    const params = new URLSearchParams();
    if (od) params.append('od', od);
    if (doDate) params.append('do', doDate);
    const query = params.toString();
    return apiClient.get<Dyżur[]>(`/dyzury${query ? `?${query}` : ''}`);
  }

  async getDuty(id: string): Promise<Dyżur> {
    return apiClient.get<Dyżur>(`/dyzury/${id}`);
  }

  async createDuty(data: Omit<Dyżur, 'id'>): Promise<Dyżur> {
    return apiClient.post<Dyżur>('/dyzury', data);
  }

  async updateDuty(id: string, data: Partial<Dyżur>): Promise<Dyżur> {
    return apiClient.put<Dyżur>(`/dyzury/${id}`, data);
  }

  async deleteDuty(id: string): Promise<void> {
    await apiClient.delete(`/dyzury/${id}`);
  }
}

// ===== STATYSTYKI =====
class StatisticsService {
  async getStatistics(rok?: number): Promise<Statystyki> {
    const query = rok ? `?rok=${rok}` : '';
    return apiClient.get<Statystyki>(`/statystyki${query}`);
  }

  async getMonthlyStatistics(rok: number, miesiac: number): Promise<any> {
    return apiClient.get(`/statystyki/miesiac?rok=${rok}&miesiac=${miesiac}`);
  }

  async getTopMembers(rok: number, limit: number = 10): Promise<any[]> {
    return apiClient.get(`/statystyki/top-druhowie?rok=${rok}&limit=${limit}`);
  }
}

// ===== MAPA =====
class MapService {
  async getHydrants(lat?: number, lon?: number, radius?: number): Promise<Hydrant[]> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    if (radius !== undefined) params.append('promien', radius.toString());
    const query = params.toString();
    return apiClient.get<Hydrant[]>(`/mapa/hydranty${query ? `?${query}` : ''}`);
  }

  async getNearbyOSPs(lat: number, lon: number, radius: number = 20): Promise<OspNaMapie[]> {
    return apiClient.get<OspNaMapie[]>(
      `/mapa/osp?lat=${lat}&lon=${lon}&promien=${radius}`
    );
  }

  async updateLocation(lat: number, lon: number): Promise<void> {
    await apiClient.post('/lokalizacja/update', { lat, lon });
  }
}

export const documentsService = new DocumentsService();
export const dutiesService = new DutiesService();
export const statisticsService = new StatisticsService();
export const mapService = new MapService();
