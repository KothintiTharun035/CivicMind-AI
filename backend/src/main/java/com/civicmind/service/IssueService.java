package com.civicmind.service;

import com.civicmind.dto.AIClassificationResult;
import com.civicmind.dto.IssueRequestDTO;
import com.civicmind.dto.IssueResponseDTO;
import com.civicmind.model.entity.AssignmentHistory;
import com.civicmind.model.entity.Issue;
import com.civicmind.model.entity.StatusHistory;
import com.civicmind.model.entity.User;
import com.civicmind.model.enums.IssueStatus;
import com.civicmind.repository.IssueRepository;
import com.civicmind.repository.UserRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    // =========================
    // REPORT NEW ISSUE
    // =========================
    public IssueResponseDTO reportIssue(
            IssueRequestDTO dto
    ) {

        User reporter = getCurrentUser();

        AIClassificationResult classification =
                aiService.classify(
                        dto.getTitle(),
                        dto.getDescription()
                );

        LocalDateTime now =
                LocalDateTime.now();

        // Initial PENDING history
        List<StatusHistory> initialHistory =
                new ArrayList<>();

        initialHistory.add(
                StatusHistory.builder()
                        .status(IssueStatus.PENDING)
                        .changedAt(now)
                        .changedByName(
                                reporter.getFullName()
                        )
                        .remark(null)
                        .build()
        );

        Issue issue =
                Issue.builder()
                        .title(
                                dto.getTitle()
                        )
                        .description(
                                dto.getDescription()
                        )
                        .latitude(
                                dto.getLatitude()
                        )
                        .longitude(
                                dto.getLongitude()
                        )
                        .address(
                                dto.getAddress()
                        )
                        .imageUrl(
                                dto.getImageUrl()
                        )
                        .category(
                                classification.getCategory()
                        )
                        .urgency(
                                classification.getUrgency()
                        )
                        .status(
                                IssueStatus.PENDING
                        )
                        .reportedById(
                                reporter.getId()
                        )
                        .reportedByName(
                                reporter.getFullName()
                        )
                        .createdAt(now)
                        .updatedAt(now)
                        .statusHistory(initialHistory)
                        .build();

        Issue saved =
                issueRepository.save(issue);

        return toDTO(saved);
    }

    // =========================
    // GET ALL ISSUES
    // =========================
    public List<IssueResponseDTO> getAllIssues() {

        return issueRepository
                .findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =========================
    // GET ISSUE BY ID
    // =========================
    public IssueResponseDTO getIssueById(
            String id
    ) {

        Issue issue =
                issueRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Issue not found: " + id
                                )
                        );

        User currentUser =
                getCurrentUser();

        // CITIZEN can view only their own issue
        if (
                currentUser.getRole()
                        .name()
                        .equals("CITIZEN")
        ) {

            boolean isOwner =
                    issue.getReportedById() != null &&
                    issue.getReportedById()
                            .equals(
                                    currentUser.getId()
                            );

            if (!isOwner) {
                throw new RuntimeException(
                        "You are not allowed to view this issue"
                );
            }
        }

        // OFFICIAL and ADMIN can view any issue
        return toDTO(issue);
    }

    // =========================
    // GET CURRENT USER ISSUES
    // =========================
    public List<IssueResponseDTO> getMyIssues() {

        User user =
                getCurrentUser();

        return issueRepository
                .findByReportedById(
                        user.getId()
                )
                .stream()
                .map(this::toDTO)
                .toList();
    }

                // =========================
                // GET ISSUES ASSIGNED TO
                // CURRENT LOGGED-IN OFFICIAL
                // =========================
                public List<IssueResponseDTO> getMyAssignedIssues() {

                User official =
                        getCurrentUser();

                // Extra service-level role protection
                if (!official.getRole().name().equals("OFFICIAL")) {
                        throw new RuntimeException(
                                "Only officials can view assigned issues"
                        );
                }

                return issueRepository
                        .findByAssignedOfficialId(
                                official.getId()
                        )
                        .stream()
                        .map(this::toDTO)
                        .toList();
                }

    // =========================
    // GET ISSUES BY STATUS
    // =========================
    public List<IssueResponseDTO> getByStatus(
            IssueStatus status
    ) {

        return issueRepository
                .findByStatus(status)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    
        public IssueResponseDTO assignIssueToOfficial(
                String issueId,
                String officialId
        ) {

        // Find issue
        Issue issue =
                issueRepository
                        .findById(issueId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Issue not found: "
                                                + issueId
                                )
                        );

        // Find selected official
        User official =
                userRepository
                        .findById(officialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Official not found: "
                                                + officialId
                                )
                        );

        // Make sure selected user
        // really has OFFICIAL role
        if (
                !official.getRole()
                        .name()
                        .equals("OFFICIAL")
        ) {
                throw new RuntimeException(
                        "Selected user is not an official"
                );
        }

        // Current logged-in ADMIN
        User admin =
                getCurrentUser();

        LocalDateTime now =
                LocalDateTime.now();

        // Support older MongoDB issues
        // that do not yet contain assignmentHistory
        if (issue.getAssignmentHistory() == null) {
                issue.setAssignmentHistory(
                        new ArrayList<>()
                );
        }

        // Add assignment / reassignment
        // event to complete history
        issue.getAssignmentHistory().add(
                AssignmentHistory.builder()
                        .officialId(
                                official.getId()
                        )
                        .officialName(
                                official.getFullName()
                        )
                        .officialEmail(
                                official.getEmail()
                        )
                        .assignedByName(
                                admin.getFullName()
                        )
                        .assignedAt(now)
                        .build()
        );

        // Save latest assigned official details
        issue.setAssignedOfficialId(
                official.getId()
        );

        issue.setAssignedOfficialName(
                official.getFullName()
        );

        issue.setAssignedOfficialEmail(
                official.getEmail()
        );

        issue.setAssignedAt(now);
        issue.setUpdatedAt(now);

        Issue saved =
                issueRepository.save(issue);

        return toDTO(saved);
        }

    // =========================
    // UPDATE ISSUE STATUS
    // =========================
    public IssueResponseDTO updateStatus(
            String id,
            IssueStatus status,
            String remark
    ) {

        Issue issue =
                issueRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Issue not found: " + id
                                )
                        );

        // Prevent duplicate status updates
        if (issue.getStatus() == status) {
            throw new RuntimeException(
                    "Issue is already in status: "
                            + status
            );
        }

        // Current logged-in official
        User official =
                getCurrentUser();

        // Official can update only issues
        // assigned to that official
        boolean isAssignedToCurrentOfficial =
                issue.getAssignedOfficialId() != null &&
                issue.getAssignedOfficialId()
                        .equals(official.getId());

        if (!isAssignedToCurrentOfficial) {
        throw new RuntimeException(
                "You can update only issues assigned to you"
        );
        }

        LocalDateTime now =
                LocalDateTime.now();

        // Update issue
        issue.setStatus(status);
        issue.setUpdatedAt(now);

        // Support older MongoDB issues
        if (issue.getStatusHistory() == null) {
            issue.setStatusHistory(
                    new ArrayList<>()
            );
        }

        // Add status history
        // with optional remark
        issue.getStatusHistory().add(
                StatusHistory.builder()
                        .status(status)
                        .changedAt(now)
                        .changedByName(
                                official.getFullName()
                        )
                        .remark(
                                remark == null ||
                                remark.isBlank()
                                        ? null
                                        : remark.trim()
                        )
                        .build()
        );

        Issue saved =
                issueRepository.save(issue);

        return toDTO(saved);
    }

    // =========================
    // DELETE ISSUE
    // =========================
    public void deleteIssue(
            String id
    ) {

        issueRepository.deleteById(id);
    }

    // =========================
    // GET LOGGED-IN USER
    // =========================
    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        )
                );
    }

    // =========================
    // CONVERT ISSUE TO DTO
    // =========================
    private IssueResponseDTO toDTO(
            Issue issue
    ) {

        return IssueResponseDTO.builder()
                .id(
                        issue.getId()
                )
                .title(
                        issue.getTitle()
                )
                .description(
                        issue.getDescription()
                )
                .category(
                        issue.getCategory()
                )
                .urgency(
                        issue.getUrgency()
                )
                .status(
                        issue.getStatus()
                )
                .latitude(
                        issue.getLatitude()
                )
                .longitude(
                        issue.getLongitude()
                )
                .address(
                        issue.getAddress()
                )
                .imageUrl(
                        issue.getImageUrl()
                )
                .reportedByName(
                        issue.getReportedByName() != null
                                ? issue.getReportedByName()
                                : "Anonymous"
                )

                // Assigned official details
                .assignedOfficialId(
                        issue.getAssignedOfficialId()
                )
                .assignedOfficialName(
                        issue.getAssignedOfficialName()
                )
                .assignedOfficialEmail(
                        issue.getAssignedOfficialEmail()
                )
                .assignedAt(
                        issue.getAssignedAt()
                )

                .createdAt(
                        issue.getCreatedAt()
                )
                .updatedAt(
                        issue.getUpdatedAt()
                )
                .statusHistory(
                        issue.getStatusHistory()
                )
                .assignmentHistory(
                        issue.getAssignmentHistory()
                )
                .build();
    }
}