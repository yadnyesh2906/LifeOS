package com.lifeos.backend.config;

import com.lifeos.backend.entity.User;
import com.lifeos.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("abc@gmail.com")) {
            User user = new User();
            user.setFullName("Default User");
            user.setEmail("abc@gmail.com");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("================================================");
            System.out.println("Default user abc@gmail.com created successfully.");
            System.out.println("================================================");
        }
    }
}
