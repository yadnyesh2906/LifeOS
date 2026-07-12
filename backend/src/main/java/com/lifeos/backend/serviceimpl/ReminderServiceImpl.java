package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.ReminderDTO;
import com.lifeos.backend.entity.Reminder;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.ReminderRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.ReminderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public ReminderServiceImpl(ReminderRepository reminderRepository,
                               UserRepository userRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    // ===========================
    // Get Logged-in User
    // ===========================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // ===========================
    // Create Reminder
    // ===========================

    @Override
    public ReminderDTO createReminder(ReminderDTO reminderDTO) {

        User user = getCurrentUser();

        Reminder reminder = new Reminder();

        reminder.setTitle(reminderDTO.getTitle());
        reminder.setDescription(reminderDTO.getDescription());
        reminder.setReminderTime(reminderDTO.getReminderTime());
        reminder.setCompleted(false);
        reminder.setCreatedAt(LocalDateTime.now());
        reminder.setUser(user);

        Reminder savedReminder = reminderRepository.save(reminder);

        return mapToDTO(savedReminder);
    }

    // ===========================
    // Get All Reminders
    // ===========================

    @Override
    public List<ReminderDTO> getAllReminders() {

        User user = getCurrentUser();

        return reminderRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ===========================
    // Get Reminder By ID
    // ===========================

    @Override
    public ReminderDTO getReminderById(Long id) {

        User user = getCurrentUser();

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(reminder);
    }

    // ===========================
    // Update Reminder
    // ===========================

    @Override
    public ReminderDTO updateReminder(Long id, ReminderDTO reminderDTO) {

        User user = getCurrentUser();

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        reminder.setTitle(reminderDTO.getTitle());
        reminder.setDescription(reminderDTO.getDescription());
        reminder.setReminderTime(reminderDTO.getReminderTime());

        Reminder updatedReminder = reminderRepository.save(reminder);

        return mapToDTO(updatedReminder);
    }

    // ===========================
    // Complete Reminder
    // ===========================

    @Override
    public ReminderDTO completeReminder(Long id) {

        User user = getCurrentUser();

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        reminder.setCompleted(true);

        Reminder updatedReminder = reminderRepository.save(reminder);

        return mapToDTO(updatedReminder);
    }

    // ===========================
    // Delete Reminder
    // ===========================

    @Override
    public void deleteReminder(Long id) {

        User user = getCurrentUser();

        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        reminderRepository.delete(reminder);
    }

    // ===========================
    // Entity -> DTO
    // ===========================

    private ReminderDTO mapToDTO(Reminder reminder) {

        return new ReminderDTO(
                reminder.getId(),
                reminder.getTitle(),
                reminder.getDescription(),
                reminder.getReminderTime(),
                reminder.isCompleted(),
                reminder.getCreatedAt()
        );
    }
}