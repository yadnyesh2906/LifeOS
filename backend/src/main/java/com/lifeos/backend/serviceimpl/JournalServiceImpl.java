package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.JournalDTO;
import com.lifeos.backend.entity.Journal;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.JournalRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.JournalService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;

    public JournalServiceImpl(JournalRepository journalRepository,
                              UserRepository userRepository) {
        this.journalRepository = journalRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));
    }

    @Override
    public JournalDTO createJournal(JournalDTO journalDTO) {

        User user = getCurrentUser();

        Journal journal = new Journal();

        journal.setTitle(journalDTO.getTitle());
        journal.setContent(journalDTO.getContent());
        journal.setCreatedAt(LocalDateTime.now());
        journal.setUser(user);

        Journal savedJournal = journalRepository.save(journal);

        return mapToDTO(savedJournal);
    }

    @Override
    public List<JournalDTO> getAllJournals() {

        User user = getCurrentUser();

        return journalRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JournalDTO getJournalById(Long id) {

        User user = getCurrentUser();

        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));

        if (!journal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(journal);
    }

    @Override
    public JournalDTO updateJournal(Long id, JournalDTO journalDTO) {

        User user = getCurrentUser();

        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));

        if (!journal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        journal.setTitle(journalDTO.getTitle());
        journal.setContent(journalDTO.getContent());

        Journal updatedJournal = journalRepository.save(journal);

        return mapToDTO(updatedJournal);
    }

    @Override
    public void deleteJournal(Long id) {

        User user = getCurrentUser();

        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!journal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        journalRepository.delete(journal);
    }

    private JournalDTO mapToDTO(Journal journal) {

        return new JournalDTO(
                journal.getId(),
                journal.getTitle(),
                journal.getContent(),
                journal.getCreatedAt()
        );
    }
}