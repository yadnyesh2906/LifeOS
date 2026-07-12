package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.HabitDTO;
import com.lifeos.backend.service.HabitService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    // Create Habit
    @PostMapping
    public ApiResponse<HabitDTO> createHabit(@Valid @RequestBody HabitDTO habitDTO) {

        HabitDTO habit = habitService.createHabit(habitDTO);

        return new ApiResponse<>(
                true,
                "Habit Created Successfully",
                habit
        );
    }

    // Get All Habits
    @GetMapping
    public ApiResponse<List<HabitDTO>> getAllHabits() {

        return new ApiResponse<>(
                true,
                "Habits Retrieved Successfully",
                habitService.getAllHabits()
        );
    }

    // Get Habit By ID
    @GetMapping("/{id}")
    public ApiResponse<HabitDTO> getHabitById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Habit Retrieved Successfully",
                habitService.getHabitById(id)
        );
    }

    // Update Habit
    @PutMapping("/{id}")
    public ApiResponse<HabitDTO> updateHabit(
            @PathVariable Long id,
            @Valid @RequestBody HabitDTO habitDTO) {

        return new ApiResponse<>(
                true,
                "Habit Updated Successfully",
                habitService.updateHabit(id, habitDTO)
        );
    }

    // Complete Habit
    @PatchMapping("/{id}/complete")
    public ApiResponse<HabitDTO> completeHabit(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Habit Completed Successfully",
                habitService.completeHabit(id)
        );
    }

    // Delete Habit
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteHabit(@PathVariable Long id) {

        habitService.deleteHabit(id);

        return new ApiResponse<>(
                true,
                "Habit Deleted Successfully",
                null
        );
    }
}