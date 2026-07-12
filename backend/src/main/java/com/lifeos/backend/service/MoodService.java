package com.lifeos.backend.service;

import com.lifeos.backend.dto.MoodDTO;

import java.util.List;

public interface MoodService {

    // Create Mood
    MoodDTO createMood(MoodDTO moodDTO);

    // Get All Moods
    List<MoodDTO> getAllMoods();

    // Get Mood By ID
    MoodDTO getMoodById(Long id);

    // Update Mood
    MoodDTO updateMood(Long id, MoodDTO moodDTO);

    // Delete Mood
    void deleteMood(Long id);
}