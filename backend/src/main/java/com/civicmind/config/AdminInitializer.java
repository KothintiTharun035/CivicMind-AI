package com.civicmind.config;

import com.civicmind.model.entity.User;
import com.civicmind.model.enums.Role;
import com.civicmind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {

            System.out.println(
                    "Admin account initialization skipped"
            );
            return;
        }

        User admin = userRepository
                .findByEmail(adminEmail)
                .orElse(null);

        if (admin == null) {

            admin = User.builder()
                    .fullName("CivicMind Admin")
                    .email(adminEmail)
                    .password(
                            passwordEncoder.encode(adminPassword)
                    )
                    .role(Role.ADMIN)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);

            System.out.println(
                    "Admin account created successfully"
            );

        } else {

            // Reset password for existing admin
            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );

            // Ensure correct role
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println(
                    "Admin account updated successfully"
            );
        }
    }
}