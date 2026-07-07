package com.civicmind.model.entity;

import com.civicmind.model.enums.IssueStatus;
import com.civicmind.model.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Document(collection = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    private String id;

    private String title;

    private String description;

    private String category;

    @Builder.Default
    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;

    @Builder.Default
    private IssueStatus status = IssueStatus.PENDING;

    private Double latitude;

    private Double longitude;

    private String address;

    private String imageUrl;

    private String reportedById;

    private String reportedByName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Assigned official details
    private String assignedOfficialId;

    private String assignedOfficialName;

    private String assignedOfficialEmail;

    private LocalDateTime assignedAt;

    @Builder.Default
    private List<StatusHistory> statusHistory = new ArrayList<>();
    
    @Builder.Default
    private List<AssignmentHistory> assignmentHistory = new ArrayList<>();
}