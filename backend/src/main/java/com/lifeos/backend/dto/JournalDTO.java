package com.lifeos.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class JournalDTO {

    private Long id;

    private String title;

    private String content;

    private LocalDateTime createdAt;

    @NotBlank(message = "Journal content cannot be empty")
    

    public JournalDTO() {
    }

    public JournalDTO(Long id,
                      String title,
                      String content,
                      LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}