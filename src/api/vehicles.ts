// ============================================
// SERWIS API — POJAZDY
// ============================================
import { apiClient } from './client';
import { Pojazd, PojazdEV } from '../types';

class VehiclesService {
  async getVehicles(): Promise<Pojazd[]> {
    return apiClient.get<Pojazd[]>('/pojazdy');
  }

  async getVehicle(id: string): Promise<Pojazd> {
    return apiClient.get<Pojazd>(`/pojazdy/${id}`);
  }

  async updateVehicle(id: string, data: Partial<Pojazd>): Promise<Pojazd> {
    return apiClient.put<Pojazd>(`/pojazdy/${id}`, data);
  }

  async getVehicleLog(id: string): Promise<any[]> {
    return apiClient.get(`/pojazdy/${id}/karta-drogowa`);
  }

  async addFueling(id: string, data: any): Promise<void> {
    await apiClient.post(`/pojazdy/${id}/tankowanie`, data);
  }

  // Pojazdy EV/HEV
  async getEVVehicles(): Promise<PojazdEV[]> {
    return apiClient.get<PojazdEV[]>('/pojazdy-ev');
  }

  async getEVVehicle(id: string): Promise<PojazdEV> {
    return apiClient.get<PojazdEV>(`/pojazdy-ev/${id}`);
  }
}

export const vehiclesService = new VehiclesService();
