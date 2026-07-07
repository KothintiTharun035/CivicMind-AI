package com.civicmind.controller;

import com.civicmind.dto.AdminAnalyticsDTO;
import com.civicmind.model.entity.User;
import com.civicmind.model.enums.Role;
import com.civicmind.repository.UserRepository;
import com.civicmind.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    // =========================
    // GET ADMIN ANALYTICS
    // =========================
    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsDTO>
    getAnalytics() {

        return ResponseEntity.ok(
                adminService.getAnalytics()
        );
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping("/users")
    public ResponseEntity<List<User>>
    getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }

    // =========================
    // GET OFFICIALS ONLY
    // Used for issue assignment dropdown
    // =========================
    @GetMapping("/officials")
    public ResponseEntity<List<User>>
    getOfficials() {

        List<User> officials =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole()
                                        == Role.OFFICIAL
                        )
                        .toList();

        return ResponseEntity.ok(
                officials
        );
    }

    // =========================
    // UPDATE USER ROLE
    // =========================
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User>
    updateUserRole(
            @PathVariable String id,
            @RequestParam Role role,
            Authentication authentication
    ) {

        User targetUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: " + id
                                )
                        );

        String loggedInEmail =
                authentication.getName();

        if (
                targetUser.getEmail()
                        .equals(loggedInEmail)
        ) {
            throw new RuntimeException(
                    "You cannot change your own admin role"
            );
        }

        targetUser.setRole(role);

        return ResponseEntity.ok(
                userRepository.save(targetUser)
        );
    }
}