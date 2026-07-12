package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Task;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user);

    Long countByUser(User user);

    Long countByUserAndCompleted(User user, boolean completed);

}