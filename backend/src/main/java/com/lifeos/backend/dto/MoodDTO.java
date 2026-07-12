package com.lifeos.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class MoodDTO {

    private Long id;
    private String mood;
    private String note;
    private LocalDateTime createdAt;

    @NotBlank(message = "Mood cannot be empty")
    

    public MoodDTO() {
    }

    public MoodDTO(Long id,
                   String mood,
                   String note,
                   LocalDateTime createdAt) {
        this.id = id;
        this.mood = mood;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}