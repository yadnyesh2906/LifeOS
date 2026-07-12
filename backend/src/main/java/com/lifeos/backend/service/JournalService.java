package com.lifeos.backend.service;

import com.lifeos.backend.dto.JournalDTO;

import java.util.List;

public interface JournalService {

    // Create Journal
    JournalDTO createJournal(JournalDTO journalDTO);

    // Get All Journals
    List<JournalDTO> getAllJournals();

    // Get Journal By ID
    JournalDTO getJournalById(Long id);

    // Update Journal
    JournalDTO updateJournal(Long id, JournalDTO journalDTO);

    // Delete Journal
    void deleteJournal(Long id);
}