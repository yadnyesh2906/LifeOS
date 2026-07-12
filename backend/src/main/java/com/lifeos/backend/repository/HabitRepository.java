package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Habit;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    List<Habit> findByUser(User user);

    Long countByUser(User user);

}