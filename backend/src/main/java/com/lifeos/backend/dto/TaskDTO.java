package com.lifeos.backend.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;

public class TaskDTO {

    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime dueDate;

    public TaskDTO() {
    }

    public TaskDTO(Long id,
                   String title,
                   String description,
                   boolean completed,
                   LocalDateTime dueDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.dueDate = dueDate;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    
}