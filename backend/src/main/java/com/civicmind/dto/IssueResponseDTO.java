package com.civicmind.dto;

import com.civicmind.model.entity.AssignmentHistory;
import com.civicmind.model.entity.StatusHistory;
import com.civicmind.model.enums.IssueStatus;
import com.civicmind.model.enums.UrgencyLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueResponseDTO {

    private String id;

    private String title;

    private String description;

    private String category;

    private UrgencyLevel urgency;

    private IssueStatus status;

    private Double latitude;

    private Double longitude;

    private String address;

    private String imageUrl;

    private String reportedByName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================
    // STATUS HISTORY
    // =========================
    private List<StatusHistory> statusHistory;

    // =========================
    // CURRENT ASSIGNED OFFICIAL
    // =========================
    private String assignedOfficialId;

    private String assignedOfficialName;

    private String assignedOfficialEmail;

    private LocalDateTime assignedAt;


    private List<AssignmentHistory> assignmentHistory;
}