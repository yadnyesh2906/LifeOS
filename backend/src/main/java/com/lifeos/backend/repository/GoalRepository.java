package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Goal;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUser(User user);

    Long countByUser(User user);

    Long countByUserAndStatus(User user, String status);

}