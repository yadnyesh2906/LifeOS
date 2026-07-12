package com.lifeos.backend.repository;

import com.lifeos.backend.entity.Journal;
import com.lifeos.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {

    List<Journal> findByUser(User user);

    Long countByUser(User user);

}