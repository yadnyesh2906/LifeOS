import { ApiResponse } from '../types/ApiResponse';
import { Journal } from '../types/Journal';
import storage from '../utils/storage';

const JOURNALS_KEY = 'lifeos_journals';

export const journalService = {
  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const journalsJson = await storage.getItem(JOURNALS_KEY);
    const journals: Journal[] = journalsJson ? JSON.parse(journalsJson) : [];
    return {
      success: true,
      message: 'Journal entries fetched successfully',
      data: journals,
    };
  },

  async getJournalById(id: number): Promise<ApiResponse<Journal>> {
    const journalsJson = await storage.getItem(JOURNALS_KEY);
    const journals: Journal[] = journalsJson ? JSON.parse(journalsJson) : [];
    const journal = journals.find(j => j.id === id);
    if (!journal) {
      return {
        success: false,
        message: 'Journal entry not found',
        data: null as any,
      };
    }
    return {
      success: true,
      message: 'Journal entry fetched successfully',
      data: journal,
    };
  },

  async createJournal(journal: Partial<Journal>): Promise<ApiResponse<Journal>> {
    const journalsJson = await storage.getItem(JOURNALS_KEY);
    const journals: Journal[] = journalsJson ? JSON.parse(journalsJson) : [];

    const newId = journals.length > 0 ? Math.max(...journals.map(j => j.id)) + 1 : 1;
    const newJournal: Journal = {
      id: newId,
      title: journal.title || '',
      content: journal.content || '',
      createdAt: new Date().toISOString(),
      ...journal,
    };

    journals.push(newJournal);
    await storage.setItem(JOURNALS_KEY, JSON.stringify(journals));

    return {
      success: true,
      message: 'Journal entry created successfully',
      data: newJournal,
    };
  },

  async updateJournal(id: number, journal: Partial<Journal>): Promise<ApiResponse<Journal>> {
    const journalsJson = await storage.getItem(JOURNALS_KEY);
    let journals: Journal[] = journalsJson ? JSON.parse(journalsJson) : [];

    const index = journals.findIndex(j => j.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Journal entry not found',
        data: null as any,
      };
    }

    const updatedJournal = {
      ...journals[index],
      ...journal,
    };
    journals[index] = updatedJournal;
    await storage.setItem(JOURNALS_KEY, JSON.stringify(journals));

    return {
      success: true,
      message: 'Journal entry updated successfully',
      data: updatedJournal,
    };
  },

  async deleteJournal(id: number): Promise<ApiResponse<void>> {
    const journalsJson = await storage.getItem(JOURNALS_KEY);
    let journals: Journal[] = journalsJson ? JSON.parse(journalsJson) : [];

    const filteredJournals = journals.filter(j => j.id !== id);
    await storage.setItem(JOURNALS_KEY, JSON.stringify(filteredJournals));

    return {
      success: true,
      message: 'Journal entry deleted successfully',
      data: undefined,
    };
  },
};

export default journalService;
