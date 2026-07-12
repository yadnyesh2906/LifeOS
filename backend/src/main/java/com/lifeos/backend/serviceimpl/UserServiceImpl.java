package com.lifeos.backend.serviceimpl;

import com.lifeos.backend.dto.*;
import com.lifeos.backend.entity.User;
import com.lifeos.backend.exception.BadRequestException;
import com.lifeos.backend.exception.ResourceNotFoundException;
import com.lifeos.backend.repository.UserRepository;
import com.lifeos.backend.security.JwtService;
import com.lifeos.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.lifeos.backend.dto.ChangePasswordRequest;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

        User user = getCurrentUser();

        // Check old password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException("Current password is incorrect.");
        }

        // Check new password confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        // Prevent using the same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException(
                    "New password cannot be the same as the old password."
            );
        }

        // Save encoded password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    // ===========================
    // Register User
    // ===========================

    @Override
    public UserDTO register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists.");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return new UserDTO(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail()
        );
    }

    // ===========================
    // Login User
    // ===========================

    @Override
    public LoginResponse login(LoginRequest request) {

        System.out.println("================================");
        System.out.println("LOGIN REQUEST EMAIL = " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid Email or Password"));

        System.out.println("USER EMAIL FROM DATABASE = " + user.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        System.out.println("TOKEN GENERATED FOR = " + user.getEmail());
        System.out.println("================================");

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );

        return new LoginResponse(token, userDTO);
    }

    // ===========================
    // Get Profile
    // ===========================

    @Override
    public UserDTO getProfile() {

        User user = getCurrentUser();

        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }

    // ===========================
    // Update Profile
    // ===========================

    @Override
    public ProfileUpdateResponse updateProfile(UserDTO dto) {

        User user = getCurrentUser();

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        userRepository.save(user);

        UserDTO updatedUser = new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );

        return new ProfileUpdateResponse(
                "",
                updatedUser
        );
    }

    // ===========================
    // Current Logged-in User
    // ===========================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}