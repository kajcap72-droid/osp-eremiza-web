// ============================================
// SERWIS API — ALARMY
// ============================================
import { apiClient } from './client';
import { Alarm } from '../types';

export interface AlarmFilters {
  status?: 'aktywny' | 'zakonczony' | 'wszystkie';
  typ?: string;
  od?: string; // ISO date
  do?: string; // ISO date
  limit?: number;
  offset?: number;
}

export interface AlarmConfirmRequest {
  status: 'jade' | 'nie_jade';
  komentarz?: string;
}

class AlarmsService {
  /**
   * Pobierz listę alarmów
   */
  async getAlarms(filters?: AlarmFilters): Promise<Alarm[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.typ) params.append('typ', filters.typ);
    if (filters?.od) params.append('od', filters.od);
    if (filters?.do) params.append('do', filters.do);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    const endpoint = `/alarmy${query ? `?${query}` : ''}`;
    
    return apiClient.get<Alarm[]>(endpoint);
  }

  /**
   * Pobierz szczegóły alarmu
   */
  async getAlarm(id: string): Promise<Alarm> {
    return apiClient.get<Alarm>(`/alarmy/${id}`);
  }

  /**
   * Potwierdź udział w alarmie
   */
  async confirmAlarm(id: string, data: AlarmConfirmRequest): Promise<void> {
    await apiClient.post(`/alarmy/${id}/potwierdz`, data);
  }

  /**
   * Pobierz raport dostarczenia alarmu
   */
  async getAlarmReport(id: string): Promise<any> {
    return apiClient.get(`/alarmy/${id}/raport`);
  }

  /**
   * Pobierz obsadę alarmu
   */
  async getAlarmCrew(id: string): Promise<any[]> {
    return apiClient.get(`/alarmy/${id}/obsada`);
  }

  /**
   * Dodaj notatkę do alarmu
   */
  async addNote(id: string, notatka: string): Promise<void> {
    await apiClient.post(`/alarmy/${id}/notatka`, { notatka });
  }

  /**
   * Upload zdjęcia z akcji
   */
  async uploadPhoto(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('zdjecie', file);

    await apiClient.request(`/alarmy/${id}/zdjecie`, {
      method: 'POST',
      body: formData,
      headers: {}, // Nie ustawiaj Content-Type - browser ustawi multipart/form-data
    });
  }
}

export const alarmsService = new AlarmsService();
