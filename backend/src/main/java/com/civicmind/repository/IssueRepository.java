package com.civicmind.repository;

import com.civicmind.model.entity.Issue;
import com.civicmind.model.enums.IssueStatus;
import com.civicmind.model.enums.UrgencyLevel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IssueRepository
        extends MongoRepository<Issue, String> {

    List<Issue> findByStatus(
            IssueStatus status
    );

    List<Issue> findByUrgency(
            UrgencyLevel urgency
    );

    List<Issue> findByReportedById(
            String userId
    );

    // =========================
    // FIND ISSUES ASSIGNED
    // TO A SPECIFIC OFFICIAL
    // =========================
    List<Issue> findByAssignedOfficialId(
            String officialId
    );

    List<Issue> findByCategoryIgnoreCase(
            String category
    );

    long countByStatus(
            IssueStatus status
    );

    long countByUrgency(
            UrgencyLevel urgency
    );
}