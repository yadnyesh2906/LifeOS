package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.NoteDTO;
import com.lifeos.backend.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // ===========================
    // Create Note
    // ===========================

    @PostMapping
    public ApiResponse<NoteDTO> createNote(@Valid @RequestBody NoteDTO noteDTO) {

        NoteDTO note = noteService.createNote(noteDTO);

        return new ApiResponse<>(
                true,
                "Note Created Successfully",
                note
        );
    }

    // ===========================
    // Get All Notes
    // ===========================

    @GetMapping
    public ApiResponse<List<NoteDTO>> getAllNotes() {

        return new ApiResponse<>(
                true,
                "Notes Retrieved Successfully",
                noteService.getAllNotes()
        );
    }

    // ===========================
    // Get Note By ID
    // ===========================

    @GetMapping("/{id}")
    public ApiResponse<NoteDTO> getNoteById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Note Retrieved Successfully",
                noteService.getNoteById(id)
        );
    }

    // ===========================
    // Update Note
    // ===========================

    @PutMapping("/{id}")
    public ApiResponse<NoteDTO> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteDTO noteDTO) {

        return new ApiResponse<>(
                true,
                "Note Updated Successfully",
                noteService.updateNote(id, noteDTO)
        );
    }

    // ===========================
    // Delete Note
    // ===========================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteNote(@PathVariable Long id) {

        noteService.deleteNote(id);

        return new ApiResponse<>(
                true,
                "Note Deleted Successfully",
                null
        );
    }
}