// ============================================
// SERWIS API — CZŁONKOWIE
// ============================================
import { apiClient } from './client';
import { Czlonek } from '../types';

export interface MemberFilters {
  aktywny?: boolean;
  funkcja?: string;
  search?: string;
}

class MembersService {
  async getMembers(filters?: MemberFilters): Promise<Czlonek[]> {
    const params = new URLSearchParams();
    if (filters?.aktywny !== undefined) params.append('aktywny', filters.aktywny.toString());
    if (filters?.funkcja) params.append('funkcja', filters.funkcja);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return apiClient.get<Czlonek[]>(`/czlonkowie${query ? `?${query}` : ''}`);
  }

  async getMember(id: string): Promise<Czlonek> {
    return apiClient.get<Czlonek>(`/czlonkowie/${id}`);
  }

  async updateMember(id: string, data: Partial<Czlonek>): Promise<Czlonek> {
    return apiClient.put<Czlonek>(`/czlonkowie/${id}`, data);
  }

  async getMemberPermissions(id: string): Promise<string[]> {
    return apiClient.get<string[]>(`/czlonkowie/${id}/uprawnienia`);
  }

  async getMemberTrainings(id: string): Promise<any[]> {
    return apiClient.get(`/czlonkowie/${id}/szkolenia`);
  }

  async getMemberMedicalExams(id: string): Promise<any> {
    return apiClient.get(`/czlonkowie/${id}/badania`);
  }
}

export const membersService = new MembersService();
