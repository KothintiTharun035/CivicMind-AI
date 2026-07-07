package com.civicmind.model.entity;

import com.civicmind.model.enums.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusHistory {

    private IssueStatus status;

    private LocalDateTime changedAt;

    private String changedByName;
    
    private String remark;

}