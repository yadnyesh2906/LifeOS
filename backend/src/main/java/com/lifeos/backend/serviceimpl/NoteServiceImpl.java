package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.NoteDTO;
import com.lifeos.backend.entity.Note;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.NoteRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.NoteService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteServiceImpl(NoteRepository noteRepository,
                           UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    // ===========================
    // Get Logged-in User
    // ===========================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // ===========================
    // Create Note
    // ===========================

    @Override
    public NoteDTO createNote(NoteDTO noteDTO) {

        User user = getCurrentUser();

        Note note = new Note();

        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        note.setCreatedAt(LocalDateTime.now());
        note.setUser(user);

        Note savedNote = noteRepository.save(note);

        return mapToDTO(savedNote);
    }

    // ===========================
    // Get All Notes
    // ===========================

    @Override
    public List<NoteDTO> getAllNotes() {

        User user = getCurrentUser();

        return noteRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ===========================
    // Get Note By ID
    // ===========================

    @Override
    public NoteDTO getNoteById(Long id) {

        User user = getCurrentUser();

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(note);
    }

    // ===========================
    // Update Note
    // ===========================

    @Override
    public NoteDTO updateNote(Long id, NoteDTO noteDTO) {

        User user = getCurrentUser();

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());

        Note updatedNote = noteRepository.save(note);

        return mapToDTO(updatedNote);
    }

    // ===========================
    // Delete Note
    // ===========================

    @Override
    public void deleteNote(Long id) {

        User user = getCurrentUser();

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        noteRepository.delete(note);
    }

    // ===========================
    // Entity -> DTO
    // ===========================

    private NoteDTO mapToDTO(Note note) {

        return new NoteDTO(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt()
        );
    }
}