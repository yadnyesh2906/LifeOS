package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Mood;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {

    List<Mood> findByUser(User user);

    Mood findTopByUserOrderByCreatedAtDesc(User user);

}