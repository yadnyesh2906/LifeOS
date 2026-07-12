package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.TaskDTO;
import com.lifeos.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ==========================
    // Create Task
    // ==========================
    @PostMapping
    public ApiResponse<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO) {

        TaskDTO task = taskService.createTask(taskDTO);

        return new ApiResponse<>(
                true,
                "Task Created Successfully",
                task
        );
    }

    // ==========================
    // Get All Tasks
    // ==========================
    @GetMapping
    public ApiResponse<List<TaskDTO>> getAllTasks() {

        return new ApiResponse<>(
                true,
                "Tasks Retrieved Successfully",
                taskService.getAllTasks()
        );
    }

    // ==========================
    // Get Task By ID
    // ==========================
    @GetMapping("/{id}")
    public ApiResponse<TaskDTO> getTaskById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Task Retrieved Successfully",
                taskService.getTaskById(id)
        );
    }

    // ==========================
    // Update Task
    // ==========================
    @PutMapping("/{id}")
    public ApiResponse<TaskDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO) {

        return new ApiResponse<>(
                true,
                "Task Updated Successfully",
                taskService.updateTask(id, taskDTO)
        );
    }

    // ==========================
    // Mark Task Completed
    // ==========================
    @PatchMapping("/{id}/complete")
    public ApiResponse<TaskDTO> markTaskCompleted(@PathVariable Long id) {

        TaskDTO task = taskService.markTaskCompleted(id);

        return new ApiResponse<>(
                true,
                "Task Marked Completed Successfully",
                task
        );
    }

    // ==========================
    // Delete Task
    // ==========================
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return new ApiResponse<>(
                true,
                "Task Deleted Successfully",
                null
        );
    }
}