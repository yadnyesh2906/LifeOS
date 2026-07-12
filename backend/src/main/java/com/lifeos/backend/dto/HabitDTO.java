package com.lifeos.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class HabitDTO {

    private Long id;

    private String title;

    private String description;

    private String frequency;

    private boolean completed;

    private LocalDateTime createdAt;

    @NotBlank(message = "Habit name cannot be empty")
    private String name;

    public HabitDTO() {
    }

    public HabitDTO(Long id,
                    String title,
                    String description,
                    String frequency,
                    boolean completed,
                    LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.frequency = frequency;
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

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}