package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.DashboardDTO;
import com.lifeos.backend.entity.Mood;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.repository.*;
import com.lifeos.backend.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final GoalRepository goalRepository;
    private final NoteRepository noteRepository;
    private final JournalRepository journalRepository;
    private final ReminderRepository reminderRepository;
    private final MoodRepository moodRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                TaskRepository taskRepository,
                                HabitRepository habitRepository,
                                GoalRepository goalRepository,
                                NoteRepository noteRepository,
                                JournalRepository journalRepository,
                                ReminderRepository reminderRepository,
                                MoodRepository moodRepository) {

        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
        this.goalRepository = goalRepository;
        this.noteRepository = noteRepository;
        this.journalRepository = journalRepository;
        this.reminderRepository = reminderRepository;
        this.moodRepository = moodRepository;
    }

    // ===========================
    // Get Logged-in User
    // ===========================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        System.out.println("Authentication = " + authentication);

        if (authentication == null) {
            throw new RuntimeException("Authentication is NULL");
        }

        String email = authentication.getName();

        System.out.println("Searching user with email = " + email);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            System.out.println("USER NOT FOUND");
            throw new RuntimeException("User not found");
        }

        System.out.println("FOUND USER = " + user.getEmail());

        return user;
    }
    // ===========================
    // Dashboard Summary
    // ===========================

    @Override
    public DashboardDTO getDashboard() {

        User user = getCurrentUser();

        Long totalTasks = taskRepository.countByUser(user);
        Long completedTasks = taskRepository.countByUserAndCompleted(user, true);
        Long pendingTasks = taskRepository.countByUserAndCompleted(user, false);

        Long totalHabits = habitRepository.countByUser(user);

        Long totalGoals = goalRepository.countByUser(user);
        Long completedGoals = goalRepository.countByUserAndStatus(user, "COMPLETED");

        Long totalNotes = noteRepository.countByUser(user);
        Long totalJournals = journalRepository.countByUser(user);
        Long totalReminders = reminderRepository.countByUser(user);

        Mood latestMood = moodRepository.findTopByUserOrderByCreatedAtDesc(user);

        String todayMood = latestMood != null
                ? latestMood.getMood()
                : "No Mood";

        return new DashboardDTO(
                totalTasks,
                completedTasks,
                pendingTasks,
                totalHabits,
                totalGoals,
                completedGoals,
                totalNotes,
                totalJournals,
                totalReminders,
                todayMood
        );
    }
}