package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.LoginRequest;
import com.lifeos.backend.dto.LoginResponse;
import com.lifeos.backend.dto.RegisterRequest;
import com.lifeos.backend.dto.UserDTO;
import com.lifeos.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/register")
    public ApiResponse<UserDTO> register(@Valid @RequestBody RegisterRequest request) {

        UserDTO user = userService.register(request);

        return new ApiResponse<>(
                true,
                "User Registered Successfully",
                user
        );
    }

    // Login User
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.login(request);

        return new ApiResponse<>(
                true,
                "Login Successful",
                response
        );
    }

    // Test API
    @GetMapping("/test")
    public String test() {
        return "Auth Controller Working";
    }

}