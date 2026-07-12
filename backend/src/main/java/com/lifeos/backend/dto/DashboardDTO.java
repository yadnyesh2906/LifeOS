package com.lifeos.backend.dto;

public class DashboardDTO {

    // ===========================
    // Task Statistics
    // ===========================

    private Long totalTasks;
    private Long completedTasks;
    private Long pendingTasks;

    // ===========================
    // Habit Statistics
    // ===========================

    private Long totalHabits;

    // ===========================
    // Goal Statistics
    // ===========================

    private Long totalGoals;
    private Long completedGoals;

    // ===========================
    // Other Statistics
    // ===========================

    private Long totalNotes;
    private Long totalJournals;
    private Long totalReminders;

    // ===========================
    // Today's Mood
    // ===========================

    private String todayMood;

    public DashboardDTO() {
    }

    public DashboardDTO(Long totalTasks,
                        Long completedTasks,
                        Long pendingTasks,
                        Long totalHabits,
                        Long totalGoals,
                        Long completedGoals,
                        Long totalNotes,
                        Long totalJournals,
                        Long totalReminders,
                        String todayMood) {

        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.totalHabits = totalHabits;
        this.totalGoals = totalGoals;
        this.completedGoals = completedGoals;
        this.totalNotes = totalNotes;
        this.totalJournals = totalJournals;
        this.totalReminders = totalReminders;
        this.todayMood = todayMood;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(Long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public Long getTotalHabits() {
        return totalHabits;
    }

    public void setTotalHabits(Long totalHabits) {
        this.totalHabits = totalHabits;
    }

    public Long getTotalGoals() {
        return totalGoals;
    }

    public void setTotalGoals(Long totalGoals) {
        this.totalGoals = totalGoals;
    }

    public Long getCompletedGoals() {
        return completedGoals;
    }

    public void setCompletedGoals(Long completedGoals) {
        this.completedGoals = completedGoals;
    }

    public Long getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(Long totalNotes) {
        this.totalNotes = totalNotes;
    }

    public Long getTotalJournals() {
        return totalJournals;
    }

    public void setTotalJournals(Long totalJournals) {
        this.totalJournals = totalJournals;
    }

    public Long getTotalReminders() {
        return totalReminders;
    }

    public void setTotalReminders(Long totalReminders) {
        this.totalReminders = totalReminders;
    }

    public String getTodayMood() {
        return todayMood;
    }

    public void setTodayMood(String todayMood) {
        this.todayMood = todayMood;
    }
}