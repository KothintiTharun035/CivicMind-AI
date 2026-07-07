package com.civicmind.controller;

import com.civicmind.dto.IssueRequestDTO;
import com.civicmind.dto.IssueResponseDTO;
import com.civicmind.model.enums.IssueStatus;
import com.civicmind.service.IssueService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    // =========================
    // REPORT ISSUE
    // CITIZEN ONLY
    // =========================
    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<IssueResponseDTO> reportIssue(
            @Valid @RequestBody IssueRequestDTO dto
    ) {

        return ResponseEntity.ok(
                issueService.reportIssue(dto)
        );
    }

    // =========================
    // GET ALL ISSUES
    // OFFICIAL + ADMIN
    // =========================
    @GetMapping
    public ResponseEntity<List<IssueResponseDTO>>
    getAllIssues() {

        return ResponseEntity.ok(
                issueService.getAllIssues()
        );
    }

    // =========================
    // GET MY ISSUES
    // CITIZEN ONLY
    // =========================
    @GetMapping("/my")
    public ResponseEntity<List<IssueResponseDTO>>
    getMyIssues() {

        return ResponseEntity.ok(
                issueService.getMyIssues()
        );
    }

    @GetMapping("/assigned-to-me")
    @PreAuthorize("hasRole('OFFICIAL')")
    public ResponseEntity<List<IssueResponseDTO>>
    getMyAssignedIssues() {

        return ResponseEntity.ok(
                issueService.getMyAssignedIssues()
        );
    }

    // =========================
    // GET ISSUES BY STATUS
    // OFFICIAL + ADMIN
    // =========================
    @GetMapping("/status/{status}")
    public ResponseEntity<List<IssueResponseDTO>>
    getByStatus(
            @PathVariable IssueStatus status
    ) {

        return ResponseEntity.ok(
                issueService.getByStatus(status)
        );
    }

    // =========================
    // ASSIGN ISSUE TO OFFICIAL
    // ADMIN ONLY
    // =========================
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IssueResponseDTO>
    assignIssueToOfficial(
            @PathVariable String id,
            @RequestParam String officialId
    ) {

        return ResponseEntity.ok(
                issueService.assignIssueToOfficial(
                        id,
                        officialId
                )
        );
    }

    // =========================
    // UPDATE ISSUE STATUS
    // OFFICIAL ONLY
    // =========================
    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueResponseDTO>
    updateStatus(
            @PathVariable String id,
            @RequestParam IssueStatus status,
            @RequestParam(required = false)
            String remark
    ) {

        return ResponseEntity.ok(
                issueService.updateStatus(
                        id,
                        status,
                        remark
                )
        );
    }

    // =========================
    // GET ISSUE BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponseDTO>
    getIssue(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                issueService.getIssueById(id)
        );
    }

    // =========================
    // DELETE ISSUE
    // ADMIN ONLY
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable String id
    ) {

        issueService.deleteIssue(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}