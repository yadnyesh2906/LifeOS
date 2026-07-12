package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.TaskDTO;
import com.lifeos.backend.entity.Task;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.TaskRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository,
                           UserRepository userRepository) {
        this.taskRepository = taskRepository;
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
    public TaskDTO createTask(TaskDTO taskDTO) {

        User user = getCurrentUser();

        Task task = new Task();

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(false);
        task.setDueDate(taskDTO.getDueDate());
        task.setCreatedAt(LocalDateTime.now());

        task.setUser(user);

        Task savedTask = taskRepository.save(task);

        return mapToDTO(savedTask);
    }

    @Override
    public List<TaskDTO> getAllTasks() {

        User user = getCurrentUser();

        return taskRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskById(Long id) {

        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(task);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {

        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task.setDueDate(taskDTO.getDueDate());

        return mapToDTO(taskRepository.save(task));
    }

    @Override
    public TaskDTO markTaskCompleted(Long id) {

        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        task.setCompleted(true);

        return mapToDTO(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {

        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        taskRepository.delete(task);
    }

    private TaskDTO mapToDTO(Task task) {

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isCompleted(),
                task.getDueDate()
        );
    }
}