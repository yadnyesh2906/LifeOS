package com.lifeos.backend.service;

import com.lifeos.backend.dto.NoteDTO;

import java.util.List;

public interface NoteService {

    // ===========================
    // Create Note
    // ===========================
    NoteDTO createNote(NoteDTO noteDTO);

    // ===========================
    // Get All Notes
    // ===========================
    List<NoteDTO> getAllNotes();

    // ===========================
    // Get Note By ID
    // ===========================
    NoteDTO getNoteById(Long id);

    // ===========================
    // Update Note
    // ===========================
    NoteDTO updateNote(Long id, NoteDTO noteDTO);

    // ===========================
    // Delete Note
    // ===========================
    void deleteNote(Long id);
}