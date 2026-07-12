package com.lifeos.backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReminderDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime reminderTime;
    private Boolean completed;
    private LocalDateTime createdAt;

    @NotBlank(message = "Reminder title cannot be empty")


    @NotNull(message = "Reminder time is required")

    public ReminderDTO() {
    }

    public ReminderDTO(Long id,
                       String title,
                       String description,
                       LocalDateTime reminderTime,
                       Boolean completed,
                       LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.reminderTime = reminderTime;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}