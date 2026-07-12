import api from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Note } from '../types/Note';

export const noteService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    const response = await api.get<ApiResponse<Note[]>>('/notes');
    return response.data;
  },
};

export default noteService;
