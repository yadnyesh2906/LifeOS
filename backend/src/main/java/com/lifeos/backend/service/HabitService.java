package com.lifeos.backend.service;

import com.lifeos.backend.dto.HabitDTO;

import java.util.List;

public interface HabitService {

    HabitDTO createHabit(HabitDTO habitDTO);

    List<HabitDTO> getAllHabits();

    HabitDTO getHabitById(Long id);

    HabitDTO updateHabit(Long id, HabitDTO habitDTO);

    HabitDTO completeHabit(Long id);

    void deleteHabit(Long id);
}