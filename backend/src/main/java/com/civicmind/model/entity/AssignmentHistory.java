package com.civicmind.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentHistory {

    // Official who received the issue
    private String officialId;

    private String officialName;

    private String officialEmail;

    // Admin who performed the assignment
    private String assignedByName;

    // Time of assignment / reassignment
    private LocalDateTime assignedAt;
}