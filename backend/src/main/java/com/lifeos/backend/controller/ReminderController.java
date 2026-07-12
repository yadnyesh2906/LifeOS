package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.ReminderDTO;
import com.lifeos.backend.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    // ===========================
    // Create Reminder
    // ===========================

    @PostMapping
    public ApiResponse<ReminderDTO> createReminder(@Valid @RequestBody ReminderDTO reminderDTO) {

        System.out.println("CREATE REMINDER CONTROLLER HIT");

        ReminderDTO reminder = reminderService.createReminder(reminderDTO);

        return new ApiResponse<>(
                true,
                "Reminder Created Successfully",
                reminder
        );
    }

    // ===========================
    // Get All Reminders
    // ===========================

    @GetMapping
    public ApiResponse<List<ReminderDTO>> getAllReminders() {

        return new ApiResponse<>(
                true,
                "Reminders Retrieved Successfully",
                reminderService.getAllReminders()
        );
    }

    // ===========================
    // Get Reminder By ID
    // ===========================

    @GetMapping("/{id}")
    public ApiResponse<ReminderDTO> getReminderById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Reminder Retrieved Successfully",
                reminderService.getReminderById(id)
        );
    }

    // ===========================
    // Update Reminder
    // ===========================

    @PutMapping("/{id}")
    public ApiResponse<ReminderDTO> updateReminder(
            @PathVariable Long id,
            @Valid @RequestBody ReminderDTO reminderDTO) {

        return new ApiResponse<>(
                true,
                "Reminder Updated Successfully",
                reminderService.updateReminder(id, reminderDTO)
        );
    }

    // ===========================
    // Complete Reminder
    // ===========================

    @PatchMapping("/{id}/complete")
    public ApiResponse<ReminderDTO> completeReminder(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Reminder Completed Successfully",
                reminderService.completeReminder(id)
        );
    }

    // ===========================
    // Delete Reminder
    // ===========================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteReminder(@PathVariable Long id) {

        reminderService.deleteReminder(id);

        return new ApiResponse<>(
                true,
                "Reminder Deleted Successfully",
                null
        );
    }
}