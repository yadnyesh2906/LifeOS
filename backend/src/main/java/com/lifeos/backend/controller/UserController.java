package com.lifeos.backend.controller;

import com.lifeos.backend.dto.UserDTO;
import com.lifeos.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lifeos.backend.dto.ProfileUpdateResponse;
import com.lifeos.backend.dto.ChangePasswordRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ===========================
    // Get Profile
    // ===========================

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile() {

        return ResponseEntity.ok(
                userService.getProfile()
        );

    }

    // ===========================
    // Update Profile
    // ===========================

    @PutMapping("/profile")
    public ResponseEntity<ProfileUpdateResponse> updateProfile(
            @RequestBody UserDTO userDTO
    ) {

        return ResponseEntity.ok(
                userService.updateProfile(userDTO)
        );

    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(request);

        return ResponseEntity.ok("Password changed successfully.");
    }

}