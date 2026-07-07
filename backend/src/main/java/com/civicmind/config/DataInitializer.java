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
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.official.email:}")
    private String officialEmail;

    @Value("${app.official.password:}")
    private String officialPassword;

    @Override
    public void run(String... args) {

        if (officialEmail == null || officialEmail.isBlank()
                || officialPassword == null || officialPassword.isBlank()) {

            System.out.println(
                    "Official account initialization skipped"
            );
            return;
        }

        User official = userRepository.findByEmail(officialEmail)
                .orElseGet(() -> {

                    User newOfficial = User.builder()
                            .fullName("Civic Official")
                            .email(officialEmail)
                            .password(
                                    passwordEncoder.encode(officialPassword)
                            )
                            .role(Role.OFFICIAL)
                            .createdAt(LocalDateTime.now())
                            .build();

                    System.out.println(
                            "Official account created successfully"
                    );

                    return newOfficial;
                });

        if (official.getRole() != Role.OFFICIAL) {
            official.setRole(Role.OFFICIAL);

            System.out.println(
                    "Existing official role corrected to OFFICIAL"
            );
        }

        // Sync password with OFFICIAL_PASSWORD
        if (!passwordEncoder.matches(
                officialPassword,
                official.getPassword()
        )) {
            official.setPassword(
                    passwordEncoder.encode(officialPassword)
            );

            System.out.println(
                    "Official account password updated"
            );
        }

        userRepository.save(official);
    }
}