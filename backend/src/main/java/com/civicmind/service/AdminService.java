package com.civicmind.service;

import com.civicmind.dto.AdminAnalyticsDTO;
import com.civicmind.dto.OfficialWorkloadDTO;
import com.civicmind.model.entity.Issue;
import com.civicmind.model.entity.User;
import com.civicmind.model.enums.IssueStatus;
import com.civicmind.model.enums.UrgencyLevel;
import com.civicmind.repository.IssueRepository;
import com.civicmind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;

    public AdminAnalyticsDTO getAnalytics() {

        // Get all officials
        List<User> officials = userRepository
                .findAll()
                .stream()
                .filter(user ->
                        user.getRole() != null &&
                        "OFFICIAL".equals(
                                user.getRole().name()
                        )
                )
                .toList();

        // Get all issues once
        List<Issue> allIssues =
                issueRepository.findAll();

                long assignedIssues =
        allIssues.stream()
                .filter(issue ->
                        issue.getAssignedOfficialId() != null &&
                        !issue.getAssignedOfficialId()
                                .isBlank()
                )
                .count();

        long unassignedIssues =
                allIssues.stream()
                        .filter(issue ->
                                issue.getAssignedOfficialId() == null ||
                                issue.getAssignedOfficialId()
                                        .isBlank()
                        )
                        .count();

        // Calculate workload for every official
        List<OfficialWorkloadDTO> officialWorkload =
                officials.stream()
                        .map(official -> {

                            long issueCount =
                                    allIssues.stream()
                                            .filter(issue ->
                                                    issue.getAssignedOfficialId() != null &&
                                                    issue.getAssignedOfficialId()
                                                            .equals(official.getId())
                                            )
                                            .count();

                            return OfficialWorkloadDTO
                                    .builder()
                                    .officialId(
                                            official.getId()
                                    )
                                    .officialName(
                                            official.getFullName()
                                    )
                                    .officialEmail(
                                            official.getEmail()
                                    )
                                    .issueCount(issueCount)
                                    .build();
                        })
                        .toList();

        return AdminAnalyticsDTO.builder()
                .totalUsers(
                        userRepository.count()
                )

                .totalIssues(
                        issueRepository.count()
                )

                .assignedIssues(assignedIssues)
                .unassignedIssues(unassignedIssues)

                .pendingIssues(
                        issueRepository.countByStatus(
                                IssueStatus.PENDING
                        )
                )

                .inProgressIssues(
                        issueRepository.countByStatus(
                                IssueStatus.IN_PROGRESS
                        )
                )

                .resolvedIssues(
                        issueRepository.countByStatus(
                                IssueStatus.RESOLVED
                        )
                )

                .rejectedIssues(
                        issueRepository.countByStatus(
                                IssueStatus.REJECTED
                        )
                )

                .criticalIssues(
                        issueRepository.countByUrgency(
                                UrgencyLevel.CRITICAL
                        )
                )

                .officialWorkload(
                        officialWorkload
                )

                .build();
    }
}