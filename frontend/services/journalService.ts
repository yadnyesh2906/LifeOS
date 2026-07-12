import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Journal } from '../types/Journal';

export const journalService = {
  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const response = await api.get<ApiResponse<Journal[]>>('/journals');
    return response.data;
  },

  async getJournalById(id: number): Promise<ApiResponse<Journal>> {
    const response = await api.get<ApiResponse<Journal>>(`/journals/${id}`);
    return response.data;
  },

  async createJournal(journal: Partial<Journal>): Promise<ApiResponse<Journal>> {
    const response = await api.post<ApiResponse<Journal>>('/journals', journal);
    return response.data;
  },

  async updateJournal(id: number, journal: Partial<Journal>): Promise<ApiResponse<Journal>> {
    const response = await api.put<ApiResponse<Journal>>(`/journals/${id}`, journal);
    return response.data;
  },

  async deleteJournal(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/journals/${id}`);
    return response.data;
  },
};

export default journalService;
