package com.lifeos.backend.service;

import com.lifeos.backend.dto.GoalDTO;

import java.util.List;

public interface GoalService {

    // Create Goal
    GoalDTO createGoal(GoalDTO goalDTO);

    // Get All Goals
    List<GoalDTO> getAllGoals();

    // Get Goal By ID
    GoalDTO getGoalById(Long id);

    // Update Goal
    GoalDTO updateGoal(Long id, GoalDTO goalDTO);

    // Mark Goal as Completed
    GoalDTO completeGoal(Long id);

    GoalDTO markPending(Long id);

    // Delete Goal
    void deleteGoal(Long id);
}