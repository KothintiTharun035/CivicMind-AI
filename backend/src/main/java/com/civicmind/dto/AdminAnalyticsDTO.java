package com.civicmind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDTO {

    private long totalUsers;
    private long totalIssues;

    private long assignedIssues;
    private long unassignedIssues;

    private long pendingIssues;
    private long inProgressIssues;
    private long resolvedIssues;
    private long rejectedIssues;

    private long criticalIssues;
    private List<OfficialWorkloadDTO> officialWorkload;
}