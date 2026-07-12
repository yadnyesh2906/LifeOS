package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.GoalDTO;
import com.lifeos.backend.entity.Goal;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.GoalRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.GoalService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalServiceImpl(GoalRepository goalRepository,
                           UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public GoalDTO createGoal(GoalDTO goalDTO) {

        User user = getCurrentUser();

        Goal goal = new Goal();

        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        goal.setTargetDate(goalDTO.getTargetDate());
        goal.setStatus("NOT_STARTED");
        goal.setCreatedAt(LocalDateTime.now());

        // Associate goal with logged-in user
        goal.setUser(user);

        Goal savedGoal = goalRepository.save(goal);

        return mapToDTO(savedGoal);
    }

    @Override
    public List<GoalDTO> getAllGoals() {

        User user = getCurrentUser();

        return goalRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GoalDTO getGoalById(Long id) {

        User user = getCurrentUser();

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(goal);
    }

    @Override
    public GoalDTO updateGoal(Long id, GoalDTO goalDTO) {

        User user = getCurrentUser();

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        goal.setTitle(goalDTO.getTitle());
        goal.setDescription(goalDTO.getDescription());
        goal.setTargetDate(goalDTO.getTargetDate());
        goal.setStatus(goalDTO.getStatus());

        Goal updatedGoal = goalRepository.save(goal);

        return mapToDTO(updatedGoal);
    }

    @Override
    public GoalDTO completeGoal(Long id) {

        User user = getCurrentUser();

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        goal.setStatus("COMPLETED");

        Goal updatedGoal = goalRepository.save(goal);

        return mapToDTO(updatedGoal);
    }

    @Override
    public GoalDTO markPending(Long id) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setStatus("NOT_STARTED");

        Goal savedGoal = goalRepository.save(goal);

        return mapToDTO(savedGoal);
    }

    @Override
    public void deleteGoal(Long id) {

        User user = getCurrentUser();

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        goalRepository.delete(goal);
    }

    private GoalDTO mapToDTO(Goal goal) {

        return new GoalDTO(
                goal.getId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getTargetDate(),
                goal.getStatus(),
                goal.getCreatedAt()
        );
    }
}