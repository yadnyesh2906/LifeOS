import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Note } from '../types/Note';

export const noteService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    const response = await api.get<ApiResponse<Note[]>>('/notes');
    return response.data;
  },

  async getNoteById(id: number): Promise<ApiResponse<Note>> {
    const response = await api.get<ApiResponse<Note>>(`/notes/${id}`);
    return response.data;
  },

  async createNote(note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.post<ApiResponse<Note>>('/notes', note);
    return response.data;
  },

  async updateNote(id: number, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const response = await api.put<ApiResponse<Note>>(`/notes/${id}`, note);
    return response.data;
  },

  async deleteNote(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/notes/${id}`);
    return response.data;
  },
};

export default noteService;
