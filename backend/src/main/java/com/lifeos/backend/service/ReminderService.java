package com.lifeos.backend.service;

import com.lifeos.backend.dto.ReminderDTO;

import java.util.List;

public interface ReminderService {

    // Create Reminder
    ReminderDTO createReminder(ReminderDTO reminderDTO);

    // Get All Reminders
    List<ReminderDTO> getAllReminders();

    // Get Reminder By ID
    ReminderDTO getReminderById(Long id);

    // Update Reminder
    ReminderDTO updateReminder(Long id, ReminderDTO reminderDTO);

    // Complete Reminder
    ReminderDTO completeReminder(Long id);

    // Delete Reminder
    void deleteReminder(Long id);
}