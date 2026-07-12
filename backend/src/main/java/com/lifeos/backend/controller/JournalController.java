package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.JournalDTO;
import com.lifeos.backend.service.JournalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    // ===========================
    // Create Journal
    // ===========================

    @PostMapping
    public ApiResponse<JournalDTO> createJournal(@Valid @RequestBody JournalDTO journalDTO) {

        JournalDTO journal = journalService.createJournal(journalDTO);

        return new ApiResponse<>(
                true,
                "Journal Created Successfully",
                journal
        );
    }

    // ===========================
    // Get All Journals
    // ===========================

    @GetMapping
    public ApiResponse<List<JournalDTO>> getAllJournals() {

        return new ApiResponse<>(
                true,
                "Journals Retrieved Successfully",
                journalService.getAllJournals()
        );
    }

    // ===========================
    // Get Journal By ID
    // ===========================

    @GetMapping("/{id}")
    public ApiResponse<JournalDTO> getJournalById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Journal Retrieved Successfully",
                journalService.getJournalById(id)
        );
    }

    // ===========================
    // Update Journal
    // ===========================

    @PutMapping("/{id}")
    public ApiResponse<JournalDTO> updateJournal(
            @PathVariable Long id,
            @Valid @RequestBody JournalDTO journalDTO) {

        return new ApiResponse<>(
                true,
                "Journal Updated Successfully",
                journalService.updateJournal(id, journalDTO)
        );
    }

    // ===========================
    // Delete Journal
    // ===========================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteJournal(@PathVariable Long id) {

        journalService.deleteJournal(id);

        return new ApiResponse<>(
                true,
                "Journal Deleted Successfully",
                null
        );
    }
}