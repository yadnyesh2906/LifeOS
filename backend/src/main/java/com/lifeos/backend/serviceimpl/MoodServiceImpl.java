package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.MoodDTO;
import com.lifeos.backend.entity.Mood;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.exception.UnauthorizedException;
import com.lifeos.backend.repository.MoodRepository;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.service.MoodService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoodServiceImpl implements MoodService {

    private final MoodRepository moodRepository;
    private final UserRepository userRepository;

    public MoodServiceImpl(MoodRepository moodRepository,
                           UserRepository userRepository) {
        this.moodRepository = moodRepository;
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
    public MoodDTO createMood(MoodDTO moodDTO) {

        User user = getCurrentUser();

        Mood mood = new Mood();

        mood.setMood(moodDTO.getMood());
        mood.setNote(moodDTO.getNote());
        mood.setCreatedAt(LocalDateTime.now());
        mood.setUser(user);

        Mood savedMood = moodRepository.save(mood);

        return mapToDTO(savedMood);
    }

    @Override
    public List<MoodDTO> getAllMoods() {

        User user = getCurrentUser();

        return moodRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MoodDTO getMoodById(Long id) {

        User user = getCurrentUser();

        Mood mood = moodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found"));

        if (!mood.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(mood);
    }

    @Override
    public MoodDTO updateMood(Long id, MoodDTO moodDTO) {

        User user = getCurrentUser();

        Mood mood = moodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found"));

        if (!mood.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        mood.setMood(moodDTO.getMood());
        mood.setNote(moodDTO.getNote());

        Mood updatedMood = moodRepository.save(mood);

        return mapToDTO(updatedMood);
    }

    @Override
    public void deleteMood(Long id) {

        User user = getCurrentUser();

        Mood mood = moodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!mood.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        moodRepository.delete(mood);
    }

    private MoodDTO mapToDTO(Mood mood) {

        return new MoodDTO(
                mood.getId(),
                mood.getMood(),
                mood.getNote(),
                mood.getCreatedAt()
        );
    }
}