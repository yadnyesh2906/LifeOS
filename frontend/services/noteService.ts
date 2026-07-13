import { ApiResponse } from '../types/ApiResponse';
import { Note } from '../types/Note';
import storage from '../utils/storage';

const NOTES_KEY = 'lifeos_notes';

export const noteService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    const notesJson = await storage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    return {
      success: true,
      message: 'Notes fetched successfully',
      data: notes,
    };
  },

  async getNoteById(id: number): Promise<ApiResponse<Note>> {
    const notesJson = await storage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    const note = notes.find(n => n.id === id);
    if (!note) {
      return {
        success: false,
        message: 'Note not found',
        data: null as any,
      };
    }
    return {
      success: true,
      message: 'Note fetched successfully',
      data: note,
    };
  },

  async createNote(note: Partial<Note>): Promise<ApiResponse<Note>> {
    const notesJson = await storage.getItem(NOTES_KEY);
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];

    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
    const newNote: Note = {
      id: newId,
      title: note.title || '',
      content: note.content || '',
      color: note.color || '#F0F0F3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...note,
    };

    notes.push(newNote);
    await storage.setItem(NOTES_KEY, JSON.stringify(notes));

    return {
      success: true,
      message: 'Note created successfully',
      data: newNote,
    };
  },

  async updateNote(id: number, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const notesJson = await storage.getItem(NOTES_KEY);
    let notes: Note[] = notesJson ? JSON.parse(notesJson) : [];

    const index = notes.findIndex(n => n.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Note not found',
        data: null as any,
      };
    }

    const updatedNote = {
      ...notes[index],
      ...note,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    await storage.setItem(NOTES_KEY, JSON.stringify(notes));

    return {
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    };
  },

  async deleteNote(id: number): Promise<ApiResponse<void>> {
    const notesJson = await storage.getItem(NOTES_KEY);
    let notes: Note[] = notesJson ? JSON.parse(notesJson) : [];

    const filteredNotes = notes.filter(n => n.id !== id);
    await storage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));

    return {
      success: true,
      message: 'Note deleted successfully',
      data: undefined,
    };
  },
};

export default noteService;
