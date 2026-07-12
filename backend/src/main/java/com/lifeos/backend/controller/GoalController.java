    package com.lifeos.backend.controller;

    import com.lifeos.backend.common.response.ApiResponse;
    import com.lifeos.backend.dto.GoalDTO;
    import com.lifeos.backend.service.GoalService;
    import jakarta.validation.Valid;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/goals")
    public class GoalController {

        private final GoalService goalService;

        public GoalController(GoalService goalService) {
            this.goalService = goalService;
        }

        // ===========================
        // Create Goal
        // ===========================

        @PostMapping
        public ApiResponse<GoalDTO> createGoal(@Valid @RequestBody GoalDTO goalDTO) {

            GoalDTO goal = goalService.createGoal(goalDTO);

            return new ApiResponse<>(
                    true,
                    "Goal Created Successfully",
                    goal
            );
        }

        // ===========================
        // Get All Goals
        // ===========================

        @GetMapping
        public ApiResponse<List<GoalDTO>> getAllGoals() {

            return new ApiResponse<>(
                    true,
                    "Goals Retrieved Successfully",
                    goalService.getAllGoals()
            );
        }

        // ===========================
        // Get Goal By ID
        // ===========================

        @GetMapping("/{id}")
        public ApiResponse<GoalDTO> getGoalById(@PathVariable Long id) {

            return new ApiResponse<>(
                    true,
                    "Goal Retrieved Successfully",
                    goalService.getGoalById(id)
            );
        }

        // ===========================
        // Update Goal
        // ===========================

        @PutMapping("/{id}")
        public ApiResponse<GoalDTO> updateGoal(
                @PathVariable Long id,
                @Valid @RequestBody GoalDTO goalDTO) {

            return new ApiResponse<>(
                    true,
                    "Goal Updated Successfully",
                    goalService.updateGoal(id, goalDTO)
            );
        }

        // ===========================
        // Complete Goal
        // ===========================

        @PatchMapping("/{id}/complete")
        public ApiResponse<GoalDTO> completeGoal(@PathVariable Long id) {

            return new ApiResponse<>(
                    true,
                    "Goal Completed Successfully",
                    goalService.completeGoal(id)
            );
        }

        @PatchMapping("/{id}/pending")
        public ApiResponse<GoalDTO> markPending(@PathVariable Long id) {

            return new ApiResponse<>(
                    true,
                    "Goal marked as Pending",
                    goalService.markPending(id)
            );
        }

        // ===========================
        // Delete Goal
        // ===========================

        @DeleteMapping("/{id}")
        public ApiResponse<String> deleteGoal(@PathVariable Long id) {

            goalService.deleteGoal(id);

            return new ApiResponse<>(
                    true,
                    "Goal Deleted Successfully",
                    null
            );
        }
    }