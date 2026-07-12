package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.MoodDTO;
import com.lifeos.backend.service.MoodService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moods")
public class MoodController {

    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    // ===========================
    // Create Mood
    // ===========================

    @PostMapping
    public ApiResponse<MoodDTO> createMood(@Valid @RequestBody MoodDTO moodDTO) {

        MoodDTO mood = moodService.createMood(moodDTO);

        return new ApiResponse<>(
                true,
                "Mood Created Successfully",
                mood
        );
    }

    // ===========================
    // Get All Moods
    // ===========================

    @GetMapping
    public ApiResponse<List<MoodDTO>> getAllMoods() {

        return new ApiResponse<>(
                true,
                "Moods Retrieved Successfully",
                moodService.getAllMoods()
        );
    }

    // ===========================
    // Get Mood By ID
    // ===========================

    @GetMapping("/{id}")
    public ApiResponse<MoodDTO> getMoodById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Mood Retrieved Successfully",
                moodService.getMoodById(id)
        );
    }

    // ===========================
    // Update Mood
    // ===========================

    @PutMapping("/{id}")
    public ApiResponse<MoodDTO> updateMood(
            @PathVariable Long id,
            @Valid @RequestBody MoodDTO moodDTO) {

        return new ApiResponse<>(
                true,
                "Mood Updated Successfully",
                moodService.updateMood(id, moodDTO)
        );
    }

    // ===========================
    // Delete Mood
    // ===========================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMood(@PathVariable Long id) {

        moodService.deleteMood(id);

        return new ApiResponse<>(
                true,
                "Mood Deleted Successfully",
                null
        );
    }
}