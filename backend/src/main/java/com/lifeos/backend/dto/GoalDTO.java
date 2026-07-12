package com.lifeos.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class GoalDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime targetDate;
    private String status;
    private LocalDateTime createdAt;

    @NotBlank(message = "Goal title cannot be empty")

    public GoalDTO() {
    }

    public GoalDTO(Long id,
                   String title,
                   String description,
                   LocalDateTime targetDate,
                   String status,
                   LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.targetDate = targetDate;
        this.status = status;
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

    public LocalDateTime getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDateTime targetDate) {
        this.targetDate = targetDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}