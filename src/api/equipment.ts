// ============================================
// SERWIS API — SPRZĘT
// ============================================
import { apiClient } from './client';
import { Sprzet } from '../types';

class EquipmentService {
  async getEquipment(): Promise<Sprzet[]> {
    return apiClient.get<Sprzet[]>('/sprzet');
  }

  async getEquipmentItem(id: string): Promise<Sprzet> {
    return apiClient.get<Sprzet>(`/sprzet/${id}`);
  }

  async updateEquipment(id: string, data: Partial<Sprzet>): Promise<Sprzet> {
    return apiClient.put<Sprzet>(`/sprzet/${id}`, data);
  }

  async getEquipmentInspections(id: string): Promise<any[]> {
    return apiClient.get(`/sprzet/${id}/przeglady`);
  }
}

export const equipmentService = new EquipmentService();
