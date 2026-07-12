package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Reminder;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    // Get all reminders of the logged-in user
    List<Reminder> findByUser(User user);

    Long countByUser(User user);
}