package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.HabitDTO;
import com.lifeos.backend.entity.Habit;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.HabitRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.HabitService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitServiceImpl(HabitRepository habitRepository,
                            UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));
    }

    @Override
    public HabitDTO createHabit(HabitDTO habitDTO) {

        User user = getCurrentUser();

        Habit habit = new Habit();

        habit.setTitle(habitDTO.getTitle());
        habit.setDescription(habitDTO.getDescription());
        habit.setFrequency(habitDTO.getFrequency());
        habit.setCompleted(false);
        habit.setCreatedAt(LocalDateTime.now());
        habit.setUser(user);

        Habit savedHabit = habitRepository.save(habit);

        return mapToDTO(savedHabit);
    }

    @Override
    public List<HabitDTO> getAllHabits() {

        User user = getCurrentUser();

        return habitRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HabitDTO getHabitById(Long id) {

        User user = getCurrentUser();

        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(habit);
    }

    @Override
    public HabitDTO updateHabit(Long id, HabitDTO habitDTO) {

        User user = getCurrentUser();

        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        habit.setTitle(habitDTO.getTitle());
        habit.setDescription(habitDTO.getDescription());
        habit.setFrequency(habitDTO.getFrequency());
        habit.setCompleted(habitDTO.isCompleted());

        Habit updatedHabit = habitRepository.save(habit);

        return mapToDTO(updatedHabit);
    }

    @Override
    public HabitDTO completeHabit(Long id) {

        User user = getCurrentUser();

        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        habit.setCompleted(true);

        Habit updatedHabit = habitRepository.save(habit);

        return mapToDTO(updatedHabit);
    }

    @Override
    public void deleteHabit(Long id) {

        User user = getCurrentUser();

        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        if (!habit.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        habitRepository.delete(habit);
    }

    private HabitDTO mapToDTO(Habit habit) {

        return new HabitDTO(
                habit.getId(),
                habit.getTitle(),
                habit.getDescription(),
                habit.getFrequency(),
                habit.isCompleted(),
                habit.getCreatedAt()
        );
    }
}